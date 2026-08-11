import {
  Booking,
  BookingStatus,
  ReportSummary,
  RequestOtpPayload,
  RequestOtpResponse,
  RestaurantArea,
  RestaurantTable,
  TableSuggestion,
} from "@/types/booking";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const IS_NGROK_API = API_BASE_URL.includes(".ngrok-free.dev");
const ADMIN_TOKEN_KEY = "rtr_admin_token";
const ADMIN_LOGIN_PATH = "/admin-panel/login";
const BOOKINGS_CHANGED_EVENT = "rtr-bookings-changed";
const AVAILABILITY_PAST_TOLERANCE_MS = 60_000;

interface ApiErrorBody {
  code?: string;
  message?: string;
}

export class ApiError extends Error {
  code?: string;
  status: number;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message || "Request failed");
    this.status = status;
    this.code = body.code;
  }
}

async function request<T>(path: string, options: RequestInit = {}, admin = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (IS_NGROK_API) {
    headers.set("ngrok-skip-browser-warning", "true");
  }
  if (admin) {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) headers.set("Authorization", `Basic ${token}`);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (admin && (response.status === 401 || response.status === 403)) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    if (window.location.pathname !== ADMIN_LOGIN_PATH) {
      const redirect = `${window.location.pathname}${window.location.search}`;
      window.location.assign(`${ADMIN_LOGIN_PATH}?redirect=${encodeURIComponent(redirect)}`);
    }
  }
  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = await response.json();
    } catch {
      body = { message: response.statusText };
    }
    throw new ApiError(response.status, body);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function notifyBookingsChanged() {
  window.dispatchEvent(new Event(BOOKINGS_CHANGED_EVENT));
  localStorage.setItem(BOOKINGS_CHANGED_EVENT, String(Date.now()));
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toTimeInputValue(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function ceilToNextMinute(date: Date) {
  const rounded = new Date(date);
  if (rounded.getSeconds() > 0 || rounded.getMilliseconds() > 0) {
    rounded.setMinutes(rounded.getMinutes() + 1);
  }
  rounded.setSeconds(0, 0);
  return rounded;
}

function getAvailabilityStartTime(date: string, startTime: string) {
  const now = new Date();
  if (date !== toDateInputValue(now)) return startTime;

  const requestedStart = new Date(`${date}T${startTime}`);
  if (Number.isNaN(requestedStart.getTime())) return startTime;

  const toleratedPast = new Date(now.getTime() - AVAILABILITY_PAST_TOLERANCE_MS);
  if (requestedStart < toleratedPast) return startTime;

  const earliestStart = ceilToNextMinute(new Date(now.getTime() + AVAILABILITY_PAST_TOLERANCE_MS));
  return requestedStart < earliestStart ? toTimeInputValue(earliestStart) : startTime;
}

export const adminAuth = {
  login: async (username: string, password: string) => {
    const token = btoa(`${username}:${password}`);
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    try {
      await request<Booking[]>("/api/admin/bookings", {}, true);
    } catch (error) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      throw error;
    }
  },
  logout: () => localStorage.removeItem(ADMIN_TOKEN_KEY),
  isLoggedIn: () => Boolean(localStorage.getItem(ADMIN_TOKEN_KEY)),
};

export const publicApi = {
  tables: () => request<RestaurantTable[]>("/api/public/tables"),
  tablesByArea: (area: RestaurantArea) => request<RestaurantTable[]>(`/api/public/tables/areas/${area}`),
  timeMapBookings: (params: Record<string, string> = {}) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value));
    return request<Booking[]>(`/api/public/time-map/bookings${search.size ? `?${search.toString()}` : ""}`);
  },
  availability: (params: {
    area: RestaurantArea;
    date: string;
    startTime: string;
    endTime: string;
    guests: number;
  }) => {
    const startTime = getAvailabilityStartTime(params.date, params.startTime);
    const search = new URLSearchParams({
      area: params.area,
      date: params.date,
      startTime,
      endTime: params.endTime,
      guests: String(params.guests),
    });
    return request<RestaurantTable[]>(`/api/public/tables/availability?${search.toString()}`);
  },
  suggestBestTable: (params: {
    seating: "inside" | "outside";
    date: string;
    startTime: string;
    endTime: string;
    guests: number;
  }) => {
    if (!params.date || !params.startTime || !params.endTime || !Number.isFinite(params.guests)) {
      throw new ApiError(400, { message: "Suggestion date, time and guest count are required." });
    }
    const search = new URLSearchParams({
      seating: params.seating,
      date: params.date,
      startTime: getAvailabilityStartTime(params.date, params.startTime),
      endTime: params.endTime,
      guests: String(params.guests),
    });
    return request<TableSuggestion>(`/api/public/tables/suggest?${search.toString()}`);
  },
  areaImages: (area: RestaurantArea) => request<{ area: RestaurantArea; images: string[] }>(`/api/public/areas/${area}/images`),
  requestOtp: (payload: RequestOtpPayload) =>
    request<RequestOtpResponse>("/api/public/bookings/request-otp", { method: "POST", body: JSON.stringify(payload) }),
  verifyOtp: (verificationId: string, otp: string) =>
    request<Booking>("/api/public/bookings/verify-otp", { method: "POST", body: JSON.stringify({ verificationId, otp }) }).then((booking) => {
      notifyBookingsChanged();
      return booking;
    }),
  resendOtp: (verificationId: string) =>
    request<RequestOtpResponse>("/api/public/bookings/resend-otp", { method: "POST", body: JSON.stringify({ verificationId }) }),
};

export const adminApi = {
	pushConfig: () => request<{ enabled: boolean; publicKey: string; subscriptionCount: number }>("/api/admin/push/config", {}, true),
	subscribePush: (subscription: PushSubscriptionJSON) =>
		request<void>("/api/admin/push/subscriptions", { method: "POST", body: JSON.stringify(subscription) }, true),
	unsubscribePush: (endpoint: string) =>
		request<void>("/api/admin/push/subscriptions", { method: "DELETE", body: JSON.stringify({ endpoint }) }, true),
	testPush: () => request<{ registered: number; accepted: number }>("/api/admin/push/test", { method: "POST" }, true),
  bookings: (params: Record<string, string> = {}) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value));
    return request<Booking[]>(`/api/admin/bookings${search.size ? `?${search.toString()}` : ""}`, {}, true);
  },
  createBooking: (payload: {
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    numberOfGuests: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    area: RestaurantArea;
    tableIds: number[];
    status?: BookingStatus;
    note?: string;
  }) =>
    request<Booking>("/api/admin/bookings", { method: "POST", body: JSON.stringify(payload) }, true).then((booking) => {
      notifyBookingsChanged();
      return booking;
    }),
  approveBooking: (id: number) =>
    request<Booking>(`/api/admin/bookings/${id}/approve`, { method: "PATCH" }, true).then((booking) => {
      notifyBookingsChanged();
      return booking;
    }),
  rejectBooking: (id: number, reason: string) =>
    request<Booking>(`/api/admin/bookings/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) }, true).then((booking) => {
      notifyBookingsChanged();
      return booking;
    }),
  cancelBooking: (id: number) =>
    request<Booking>(`/api/admin/bookings/${id}/cancel`, { method: "PATCH" }, true).then((booking) => {
      notifyBookingsChanged();
      return booking;
    }),
  deleteBooking: (id: number) =>
    request<void>(`/api/admin/bookings/${id}`, { method: "DELETE" }, true).then((result) => {
      notifyBookingsChanged();
      return result;
    }),
  updateBooking: (booking: Booking) =>
    request<Booking>(
      `/api/admin/bookings/${booking.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          numberOfGuests: booking.numberOfGuests,
          bookingDate: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime,
          area: booking.area,
          tableIds: booking.tables.map((table) => table.id),
          status: booking.status,
          note: booking.note,
        }),
      },
      true,
    ).then((updatedBooking) => {
      notifyBookingsChanged();
      return updatedBooking;
    }),
  tables: (area?: RestaurantArea) => request<RestaurantTable[]>(`/api/admin/tables${area ? `?area=${area}` : ""}`, {}, true),
  createTable: (table: Omit<RestaurantTable, "id" | "floor" | "locationName">) =>
    request<RestaurantTable>("/api/admin/tables", { method: "POST", body: JSON.stringify(table) }, true),
  updateTable: (table: RestaurantTable) =>
    request<RestaurantTable>(`/api/admin/tables/${table.id}`, { method: "PUT", body: JSON.stringify(table) }, true),
  updateTablePosition: (table: RestaurantTable) =>
    request<RestaurantTable>(
      `/api/admin/tables/${table.id}/position`,
      { method: "PATCH", body: JSON.stringify({ x: table.x, y: table.y, width: table.width, height: table.height, rotation: table.rotation }) },
      true,
    ),
  deleteTable: (id: number) => request<void>(`/api/admin/tables/${id}`, { method: "DELETE" }, true),
  reportSummary: (params: Record<string, string> = {}) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value));
    return request<ReportSummary>(`/api/admin/reports/summary${search.size ? `?${search.toString()}` : ""}`, {}, true);
  },
};

export const AREAS: { value: RestaurantArea; label: string }[] = [
  { value: "TERRACE", label: "Terrace" },
  { value: "ROMA", label: "Roma" },
  { value: "VERONA", label: "Verona" },
  { value: "SORRENTO", label: "Sorrento" },
];

export const BOOKING_STATUSES: BookingStatus[] = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"];

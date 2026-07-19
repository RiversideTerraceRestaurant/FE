import { Layer, Rect, Stage, Text } from "react-konva";
import { CalendarCheck, ImageIcon, Loader2, RefreshCw } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AREAS, ApiError, publicApi } from "@/services/api";
import { Booking as BookingResult, RequestOtpResponse, RestaurantArea, RestaurantTable, TableStatus } from "@/types/booking";
import { useLanguage } from "@/contexts/LanguageContext";

const statusColor: Record<TableStatus, string> = {
  AVAILABLE: "#16a34a",
  HOLD: "#f59e0b",
  RESERVED: "#dc2626",
  OCCUPIED: "#7c2d12",
  MAINTENANCE: "#6b7280",
};

const statusLabelKey: Record<TableStatus, string> = {
  AVAILABLE: "statusAvailable",
  HOLD: "statusHold",
  RESERVED: "statusReserved",
  OCCUPIED: "statusOccupied",
  MAINTENANCE: "statusMaintenance",
};

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = toDateInputValue(new Date());

export default function Booking() {
  const [area, setArea] = useState<RestaurantArea>("TERRACE");
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [areaImages, setAreaImages] = useState<string[]>([]);
  const [otpSession, setOtpSession] = useState<RequestOtpResponse | null>(null);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasContainerWidth, setCanvasContainerWidth] = useState(520);
  const { toast } = useToast();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    numberOfGuests: "2",
    bookingDate: today,
    startTime: "18:00",
    endTime: "20:00",
    note: "",
  });

  const displayTables = [...tables].sort((a, b) =>
    a.tableNumber.localeCompare(b.tableNumber, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
  const selectedTables = displayTables.filter((table) => selectedTableIds.includes(table.id));
  const selectedCapacity = selectedTables.reduce((total, table) => total + table.capacity, 0);
  const guestCount = Number(form.numberOfGuests) || 0;
  const columnTableLayout = {
    VERONA: { prefix: "V", leftMax: 10, rightMax: 16 },
    SORRENTO: { prefix: "S", leftMax: 4, rightMax: 6 },
  }[area as "VERONA" | "SORRENTO"];
  const useColumnTableLayout = Boolean(columnTableLayout);
  const tableNumberIndex = (table: RestaurantTable) => {
    if (!columnTableLayout) return Number.POSITIVE_INFINITY;
    const match = table.tableNumber.match(new RegExp(`^${columnTableLayout.prefix}(\\d+)$`, "i"));
    return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
  };
  const leftColumnTables = displayTables.filter((table) => tableNumberIndex(table) <= (columnTableLayout?.leftMax ?? 0));
  const rightColumnTables = displayTables.filter((table) => {
    const index = tableNumberIndex(table);
    return Boolean(columnTableLayout) && index > columnTableLayout.leftMax && index <= columnTableLayout.rightMax;
  });
  const fallbackTables = displayTables.filter((table) => tableNumberIndex(table) === Number.POSITIVE_INFINITY);
  const canvasTables = useColumnTableLayout ? [...leftColumnTables, ...rightColumnTables, ...fallbackTables] : displayTables;
  const canvasWidth = 520;
  const tableWidth = 190;
  const tableHeight = 68;
  const rowGap = 18;
  const columnGap = 36;
  const canvasPadding = 28;
  const leftX = canvasPadding;
  const rightX = canvasPadding + tableWidth + columnGap;
  const rowCount = useColumnTableLayout
    ? Math.max(1, leftColumnTables.length, rightColumnTables.length + fallbackTables.length)
    : Math.max(1, Math.ceil(displayTables.length / 2));
  const canvasHeight = Math.max(300, canvasPadding * 2 + rowCount * (tableHeight + rowGap) - rowGap);
  const stageWidth = Math.max(1, Math.min(canvasWidth, canvasContainerWidth));
  const stageScale = stageWidth / canvasWidth;
  const stageHeight = canvasHeight * stageScale;

  const getTablePosition = (table: RestaurantTable) => {
    if (!useColumnTableLayout) {
      const index = displayTables.findIndex((item) => item.id === table.id);
      if (index < rowCount) {
        return {
          x: leftX,
          y: canvasPadding + (rowCount - 1 - index) * (tableHeight + rowGap),
        };
      }
      return {
        x: rightX,
        y: canvasPadding + (index - rowCount) * (tableHeight + rowGap),
      };
    }

    const numberIndex = tableNumberIndex(table);
    if (columnTableLayout && numberIndex <= columnTableLayout.leftMax) {
      return {
        x: leftX,
        y: canvasPadding + (leftColumnTables.length - 1 - leftColumnTables.findIndex((item) => item.id === table.id)) * (tableHeight + rowGap),
      };
    }
    if (columnTableLayout && numberIndex > columnTableLayout.leftMax && numberIndex <= columnTableLayout.rightMax) {
      return {
        x: rightX,
        y: canvasPadding + rightColumnTables.findIndex((item) => item.id === table.id) * (tableHeight + rowGap),
      };
    }
    return {
      x: rightX,
      y: canvasPadding + (rightColumnTables.length + fallbackTables.findIndex((item) => item.id === table.id)) * (tableHeight + rowGap),
    };
  };

  useEffect(() => {
    setSelectedTableIds([]);
    void loadTables();
    void loadImages();
  }, [area, form.bookingDate, form.startTime, form.endTime, form.numberOfGuests]);

  useEffect(() => {
    const element = canvasContainerRef.current;
    if (!element) return;

    const updateWidth = () => setCanvasContainerWidth(Math.max(1, Math.floor(element.getBoundingClientRect().width) - 1));
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const loadTables = async () => {
    setLoadingTables(true);
    try {
      const data = await publicApi.availability({
        area,
        date: form.bookingDate,
        startTime: form.startTime,
        endTime: form.endTime,
        guests: Number(form.numberOfGuests) || 1,
      });
      setTables(data);
    } catch (error) {
      toast({ title: t("bookingCannotLoadTables"), description: error instanceof Error ? error.message : t("bookingTryAgain"), variant: "destructive" });
    } finally {
      setLoadingTables(false);
    }
  };

  const loadImages = async () => {
    try {
      const data = await publicApi.areaImages(area);
      setAreaImages(data.images);
    } catch {
      setAreaImages([]);
    }
  };

  const validate = () => {
    if (!form.customerName.trim()) return `${t("bookingCustomerName")} ${t("bookingRequired")}`;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) return t("bookingEmailInvalid");
    if (!/^[0-9+\-\s()]{8,20}$/.test(form.customerPhone)) return t("bookingPhoneInvalid");
    if (guestCount <= 0) return t("bookingGuestInvalid");
    if (guestCount > 6) return t("bookingLargeParty");
    if (new Date(`${form.bookingDate}T${form.startTime}`) < new Date()) return t("bookingPastTime");
    if (form.endTime <= form.startTime) return t("bookingEndAfterStart");
    if (selectedTables.length === 0) return t("bookingChooseTables");
    if (selectedTables.some((table) => table.status !== "AVAILABLE")) return t("bookingUnavailableSelected");
    if (selectedTables.some((table) => table.area !== area)) return t("bookingWrongAreaSelected");
    if (selectedCapacity < guestCount) return t("bookingCapacityTooSmall");
    return "";
  };

  const toggleTable = (table: RestaurantTable) => {
    if (table.status !== "AVAILABLE") return;
    setSelectedTableIds((ids) => (ids.includes(table.id) ? ids.filter((id) => id !== table.id) : [...ids, table.id]));
  };

  const submitBooking = async (event: FormEvent) => {
    event.preventDefault();
    const message = validate();
    if (message) {
      toast({ title: t("bookingFormIncomplete"), description: message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const response = await publicApi.requestOtp({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        numberOfGuests: Number(form.numberOfGuests),
        bookingDate: form.bookingDate,
        startTime: form.startTime,
        endTime: form.endTime,
        area,
        note: form.note,
        tableIds: selectedTableIds,
      });
      setOtpSession(response);
      setOtp("");
      toast({ title: t("bookingOtpSent"), description: t("bookingOtpSentDescription") });
    } catch (error) {
      if (error instanceof ApiError && error.code === "TABLE_NOT_AVAILABLE") {
        await loadTables();
      }
      toast({ title: t("bookingCannotRequestOtp"), description: error instanceof Error ? error.message : t("bookingTryAnotherTable"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpSession) return;
    setSubmitting(true);
    try {
      const booking = await publicApi.verifyOtp(otpSession.verificationId, otp);
      setOtpSession(null);
      setResult(booking);
      await loadTables();
    } catch (error) {
      if (error instanceof ApiError && error.code === "TABLE_NOT_AVAILABLE") {
        await loadTables();
      }
      toast({ title: t("bookingOtpFailed"), description: error instanceof Error ? error.message : t("bookingTryAgain"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (!otpSession) return;
    const response = await publicApi.resendOtp(otpSession.verificationId);
    setOtpSession(response);
    setOtp("");
  };

  return (
    <div className="mx-auto w-full max-w-6xl overflow-x-hidden px-3 py-6 sm:px-4 sm:py-8">
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">{t("bookingEyebrow")}</p>
        <h1 className="text-3xl font-semibold md:text-4xl">{t("bookingTitle")}</h1>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {AREAS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setArea(item.value)}
            className={`h-11 shrink-0 rounded-md border px-4 text-sm font-semibold transition ${area === item.value ? "bg-primary text-primary-foreground" : "bg-white text-foreground"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="min-w-0 overflow-hidden rounded-md border bg-white p-3 shadow-card sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-semibold">{AREAS.find((item) => item.value === area)?.label} {t("bookingTables")}</h2>
            <Button type="button" variant="outline" size="sm" onClick={loadTables} disabled={loadingTables}>
              {loadingTables ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {t("bookingRefresh")}
            </Button>
          </div>
          <div className="w-full min-w-0 overflow-hidden rounded-md border bg-muted/30">
            <div ref={canvasContainerRef} className="block w-full min-w-0 overflow-hidden">
              <Stage width={stageWidth} height={stageHeight} scaleX={stageScale} scaleY={stageScale}>
                <Layer>
                  <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill="#f8fafc" />
                  {canvasTables.map((table) => {
                    const selected = selectedTableIds.includes(table.id);
                    const disabled = table.status !== "AVAILABLE";
                    const { x, y } = getTablePosition(table);
                    const fill = selected ? "#2563eb" : statusColor[table.status];
                    return (
                      <Rect
                        key={`${table.id}-hitbox`}
                        x={x}
                        y={y}
                        width={tableWidth}
                        height={tableHeight}
                        cornerRadius={10}
                        fill={fill}
                        opacity={disabled ? 0.55 : 1}
                        stroke={selected ? "#1d4ed8" : "#ffffff"}
                        strokeWidth={selected ? 5 : 3}
                        shadowColor="rgba(15, 23, 42, 0.18)"
                        shadowBlur={selected ? 12 : 5}
                        shadowOffsetY={2}
                        onClick={() => toggleTable(table)}
                        onTap={() => toggleTable(table)}
                      />
                    );
                  })}
                  {canvasTables.map((table) => {
                    const disabled = table.status !== "AVAILABLE";
                    const { x, y } = getTablePosition(table);
                    return (
                      <Text
                        key={`${table.id}-label`}
                        x={x}
                        y={y + 12}
                        width={tableWidth}
                        height={tableHeight - 12}
                        align="center"
                        fill="#ffffff"
                        listening={false}
                        text={`${table.tableNumber}\n${table.capacity} ${t("bookingGuestLabel")}${disabled ? ` · ${t(statusLabelKey[table.status])}` : ""}`}
                        fontStyle="bold"
                        fontSize={16}
                        lineHeight={1.35}
                      />
                    );
                  })}
                </Layer>
              </Stage>
            </div>
            {!loadingTables && displayTables.length === 0 && <p className="p-4 text-sm text-muted-foreground">{t("bookingNoTables")}</p>}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            {Object.entries(statusColor).map(([status, color]) => (
              <span key={status} className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                {t(statusLabelKey[status as TableStatus])}
              </span>
            ))}
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-600" />
              {t("bookingSelected")} · {selectedTables.length} {selectedTables.length === 1 ? t("bookingTableSingular") : t("bookingTablePlural")} · {selectedCapacity} {t("bookingSeats")}
            </span>
          </div>
          <Button type="button" variant="secondary" className="mt-4" onClick={() => setShowPhotos(true)}>
            <ImageIcon className="mr-2 h-4 w-4" />
            {t("bookingAreaPhotos")}
          </Button>
        </section>

        <form onSubmit={submitBooking} className="min-w-0 rounded-md border bg-white p-3 shadow-card sm:p-4">
          <h2 className="mb-4 font-semibold">{t("bookingDetails")}</h2>
          <div className="grid gap-4">
            <Field label={t("bookingCustomerName")} id="customerName" value={form.customerName} onChange={(value) => setForm({ ...form, customerName: value })} />
            <Field label={t("bookingEmail")} id="customerEmail" type="email" value={form.customerEmail} onChange={(value) => setForm({ ...form, customerEmail: value })} />
            <Field label={t("bookingPhone")} id="customerPhone" value={form.customerPhone} onChange={(value) => setForm({ ...form, customerPhone: value })} />
            <Field label={t("bookingGuests")} id="numberOfGuests" type="number" min="1" max="6" value={form.numberOfGuests} onChange={(value) => setForm({ ...form, numberOfGuests: value })} />
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {t("bookingLargeParty")}
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label={t("bookingDate")} id="bookingDate" type="date" min={today} value={form.bookingDate} onChange={(value) => setForm({ ...form, bookingDate: value })} />
              <Field label={t("bookingStart")} id="startTime" type="time" value={form.startTime} onChange={(value) => setForm({ ...form, startTime: value })} />
              <Field label={t("bookingEnd")} id="endTime" type="time" value={form.endTime} onChange={(value) => setForm({ ...form, endTime: value })} />
            </div>
            <div>
              <Label>{t("bookingSelectedTables")}</Label>
              <div className="mt-2 rounded-md border bg-muted/40 px-3 py-3 text-sm">
                {selectedTables.length
                  ? `${selectedTables.map((table) => table.tableNumber).join(", ")} · ${selectedCapacity} ${t("bookingSeats")}`
                  : t("bookingChooseTables")}
              </div>
            </div>
            {selectedTables.length > 0 && selectedCapacity < guestCount && (
              <p className="text-sm text-destructive">{t("bookingNotEnoughSeats")}</p>
            )}
            <div>
              <Label htmlFor="note">{t("bookingNotes")}</Label>
              <Textarea id="note" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder={t("bookingOptional")} />
            </div>
            <Button type="submit" disabled={submitting || selectedTables.length === 0}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarCheck className="mr-2 h-4 w-4" />}
              {t("bookingContinue")}
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={showPhotos} onOpenChange={setShowPhotos}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{AREAS.find((item) => item.value === area)?.label} {t("bookingPhotos")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {(areaImages.length ? areaImages : ["/placeholder.svg"]).map((src) => (
              <img key={src} src={src} alt={`${area} dining area`} className="aspect-[4/3] w-full rounded-md object-cover" />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(otpSession)} onOpenChange={(open) => !open && setOtpSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("bookingVerifyEmail")}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t("bookingOtpInstruction")} {otpSession?.email}. {t("bookingOtpExpires")}</p>
          <Input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" maxLength={6} placeholder="123456" />
          <div className="flex gap-2">
            <Button onClick={verifyOtp} disabled={otp.length !== 6 || submitting}>{t("bookingVerifyOtp")}</Button>
            <Button type="button" variant="outline" onClick={resendOtp}>{t("bookingResendOtp")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(result)} onOpenChange={(open) => !open && setResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("bookingSuccessTitle")}</DialogTitle>
          </DialogHeader>
          {result && (
            <div className="space-y-2 text-sm">
              <p><strong>{t("bookingCode")}:</strong> {result.bookingCode}</p>
              <p><strong>{t("bookingCustomerName")}:</strong> {result.customerName}</p>
              <p><strong>{t("bookingEmail")}:</strong> {result.customerEmail}</p>
              <p><strong>{t("bookingPhone")}:</strong> {result.customerPhone}</p>
              <p><strong>{t("bookingArea")}:</strong> {result.area}</p>
              <p><strong>{t("bookingTable")}:</strong> {result.tables.map((table) => table.tableNumber).join(", ")}</p>
              <p><strong>{t("bookingDateTime")}:</strong> {result.bookingDate} {result.startTime} - {result.endTime}</p>
              <p><strong>{t("bookingGuests")}:</strong> {result.numberOfGuests}</p>
              <p><strong>{t("bookingStatus")}:</strong> {t("bookingPendingApproval")}</p>
              <p className="pt-2 text-muted-foreground">{t("bookingCheckEmail")}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  min,
  max,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  max?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} required />
    </div>
  );
}

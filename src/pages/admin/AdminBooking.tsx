import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Save, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AREAS, BOOKING_STATUSES, adminApi } from "@/services/api";
import { Booking, BookingStatus, RestaurantArea, RestaurantTable } from "@/types/booking";
import { useBookingRealtime } from "@/hooks/use-booking-realtime";

type BookingDraft = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  area: RestaurantArea;
  status: BookingStatus;
  note: string;
};

export default function AdminBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({ date: "", area: "", status: "", search: "", tableNumber: "" });
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [adminTables, setAdminTables] = useState<RestaurantTable[]>([]);
  const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const openedDeepLinkRef = useRef<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    if (!bookingId || openedDeepLinkRef.current === bookingId) return;
    openedDeepLinkRef.current = bookingId;
    void adminApi.booking(Number(bookingId)).then(openBooking).catch((error) => {
      toast({ title: "Cannot open booking", description: error instanceof Error ? error.message : "Booking not found.", variant: "destructive" });
    });
  }, [searchParams]);

  useEffect(() => {
    if (!draft?.area) return;
    void loadAdminTables(draft.area);
  }, [draft?.area]);

  const load = async (requestedPage = page) => {
    setLoading(true);
    try {
      const result = await adminApi.bookingsPage({ ...filters, page: String(requestedPage), size: "10" });
      setBookings(result.content);
      setPage(result.page);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (error) {
      toast({ title: "Cannot load bookings", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useBookingRealtime(() => { void load(); });

  const openBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedTableIds(booking.tables.map((table) => table.id));
    setDraft({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      numberOfGuests: String(booking.numberOfGuests),
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      area: booking.area,
      status: booking.status,
      note: booking.note || "",
    });
  };

  const closeBooking = () => {
    setSelectedBooking(null);
    setDraft(null);
    setAdminTables([]);
    setSelectedTableIds([]);
    if (searchParams.has("bookingId")) {
      searchParams.delete("bookingId");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const loadAdminTables = async (area: RestaurantArea) => {
    try {
      setAdminTables(await adminApi.tables(area));
    } catch (error) {
      toast({ title: "Cannot load tables", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    }
  };

  const refreshAfterAction = async (nextBooking?: Booking) => {
    await load();
    if (nextBooking) {
      openBooking(nextBooking);
    }
  };

  const action = async (type: "approve" | "reject" | "delete") => {
    if (!selectedBooking) return;
    try {
      if (type === "approve") {
        await adminApi.approveBooking(selectedBooking.id);
        closeBooking();
        await load();
        return;
      }
      if (type === "reject") {
        const reason = window.prompt("Reject reason");
        if (!reason) return;
        const updated = await adminApi.rejectBooking(selectedBooking.id, reason);
        await refreshAfterAction(updated);
        return;
      }
      if (type === "delete" && window.confirm("Delete this booking?")) {
        await adminApi.deleteBooking(selectedBooking.id);
        closeBooking();
        await load();
      }
    } catch (error) {
      toast({ title: "Action failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    }
  };

  const saveBooking = async () => {
    if (!selectedBooking || !draft) return;
    if (draft.endTime <= draft.startTime) {
      toast({ title: "Cannot update booking", description: "End time must be after start time.", variant: "destructive" });
      return;
    }
    const selectedTables = adminTables.filter((table) => selectedTableIds.includes(table.id));
    if (selectedTables.length === 0) {
      toast({ title: "Cannot update booking", description: "Please select at least one table.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const updated = await adminApi.updateBooking({
        ...selectedBooking,
        customerName: draft.customerName,
        customerEmail: draft.customerEmail,
        customerPhone: draft.customerPhone,
        numberOfGuests: Number(draft.numberOfGuests),
        bookingDate: draft.bookingDate,
        startTime: draft.startTime,
        endTime: draft.endTime,
        area: draft.area,
        status: draft.status,
        note: draft.note,
        tables: selectedTables,
      });
      toast({ title: "Booking updated", description: updated.bookingCode });
      await refreshAfterAction(updated);
    } catch (error) {
      toast({ title: "Update failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleAdminTable = (tableId: number) => {
    setSelectedTableIds((ids) => (ids.includes(tableId) ? ids.filter((id) => id !== tableId) : [...ids, tableId]));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Bookings</h2>
        <p className="text-sm text-muted-foreground">Tap a booking to review details and manage its status.</p>
      </div>
      <div className="grid gap-3 rounded-xl border bg-white p-3 sm:p-4 md:grid-cols-5">
        <Input type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} />
        <Select value={filters.area || "ALL"} onValueChange={(value) => setFilters({ ...filters, area: value === "ALL" ? "" : (value as RestaurantArea) })}>
          <SelectTrigger><SelectValue placeholder="Area" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All areas</SelectItem>
            {AREAS.map((area) => <SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.status || "ALL"} onValueChange={(value) => setFilters({ ...filters, status: value === "ALL" ? "" : (value as BookingStatus) })}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {BOOKING_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="Table" value={filters.tableNumber} onChange={(event) => setFilters({ ...filters, tableNumber: event.target.value })} />
        <div className="flex gap-2">
          <Input placeholder="Name, email, phone" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
          <Button type="button" onClick={() => { setPage(0); void load(0); }}><Search className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-white px-4 py-3">
        <p className="text-sm text-muted-foreground">{totalElements} bookings · Page {totalPages === 0 ? 0 : page + 1} of {totalPages}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={loading || page === 0} onClick={() => void load(page - 1)}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button>
          <Button variant="outline" size="sm" disabled={loading || page + 1 >= totalPages} onClick={() => void load(page + 1)}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid w-full max-w-full gap-3">
        {bookings.map((booking) => (
          <button
            key={booking.id}
            type="button"
            onClick={() => openBooking(booking)}
            className={`w-full max-w-full overflow-hidden rounded-md border p-4 text-left shadow-sm transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary ${
              booking.status === "PENDING"
                ? "border-red-300 bg-red-50"
                : booking.status === "APPROVED"
                  ? "border-border bg-white"
                  : "border-border bg-muted/40"
            }`}
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{booking.bookingCode}</p>
                <p className="mt-1 truncate text-base font-medium">{booking.customerName}</p>
                <p className="truncate text-sm text-muted-foreground">{booking.customerEmail}</p>
              </div>
              <Badge variant={booking.status === "REJECTED" ? "destructive" : "default"} className="shrink-0">
                {booking.status}
              </Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <SummaryItem label="Area" value={booking.area} />
              <SummaryItem label="Table" value={booking.tables.map((table) => table.tableNumber).join(", ")} />
              <SummaryItem label="Date" value={booking.bookingDate} />
              <SummaryItem label="Time" value={`${booking.startTime} - ${booking.endTime}`} />
            </div>
          </button>
        ))}
        {!loading && bookings.length === 0 && <p className="rounded-md border bg-white p-6 text-center text-muted-foreground">No bookings found.</p>}
        {loading && <p className="rounded-md border bg-white p-6 text-center text-muted-foreground">Loading bookings...</p>}
      </div>

      <Dialog open={Boolean(selectedBooking)} onOpenChange={(open) => !open && closeBooking()}>
        <DialogContent className="max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-[calc(100%-1rem)] max-w-3xl overflow-y-auto rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>{selectedBooking?.bookingCode}</DialogTitle>
            <DialogDescription>Review booking details before approving, rejecting, updating, cancelling, or deleting.</DialogDescription>
          </DialogHeader>

          {selectedBooking && draft && (
            <div className="space-y-5">
              <div className={`rounded-md border p-4 ${selectedBooking.status === "PENDING" ? "border-red-300 bg-red-50" : "bg-white"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{selectedBooking.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.customerEmail} · {selectedBooking.customerPhone}</p>
                  </div>
                  <Badge variant={selectedBooking.status === "REJECTED" ? "destructive" : "default"}>{selectedBooking.status}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                  <SummaryItem label="Tables" value={selectedBooking.tables.map((table) => table.tableNumber).join(", ")} />
                  <SummaryItem label="Guests" value={String(selectedBooking.numberOfGuests)} />
                  <SummaryItem label="Created" value={new Date(selectedBooking.createdAt).toLocaleString()} />
                </div>
              </div>

              <BookingMiniMap booking={selectedBooking} tables={adminTables} />

              <div className="grid gap-4 sm:grid-cols-2">
                <EditableField label="Customer name" value={draft.customerName} onChange={(value) => setDraft({ ...draft, customerName: value })} />
                <EditableField label="Email" type="email" value={draft.customerEmail} onChange={(value) => setDraft({ ...draft, customerEmail: value })} />
                <EditableField label="Phone" value={draft.customerPhone} onChange={(value) => setDraft({ ...draft, customerPhone: value })} />
                <EditableField label="Guests" type="number" value={draft.numberOfGuests} onChange={(value) => setDraft({ ...draft, numberOfGuests: value })} />
                <EditableField label="Date" type="date" value={draft.bookingDate} onChange={(value) => setDraft({ ...draft, bookingDate: value })} />
                <div className="grid grid-cols-2 gap-3">
                  <EditableField label="Start" type="time" value={draft.startTime} onChange={(value) => setDraft({ ...draft, startTime: value })} />
                  <EditableField label="End" type="time" value={draft.endTime} onChange={(value) => setDraft({ ...draft, endTime: value })} />
                </div>
                <div>
                  <Label>Area</Label>
                  <Select value={draft.area} onValueChange={(value) => {
                    setDraft({ ...draft, area: value as RestaurantArea });
                    setSelectedTableIds([]);
                  }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AREAS.map((area) => <SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={draft.status} onValueChange={(value) => setDraft({ ...draft, status: value as BookingStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BOOKING_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="booking-note">Note</Label>
                  <Textarea id="booking-note" value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Tables</Label>
                  <div className="mt-2 grid max-h-56 gap-2 overflow-y-auto rounded-md border bg-muted/20 p-2 sm:grid-cols-2">
                    {adminTables.map((table) => {
                      const checked = selectedTableIds.includes(table.id);
                      return (
                        <button
                          key={table.id}
                          type="button"
                          onClick={() => toggleAdminTable(table.id)}
                          className={`rounded-md border p-3 text-left transition ${
                            checked ? "border-blue-600 bg-blue-50" : "border-border bg-white hover:border-primary"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate font-semibold">{table.tableNumber}</p>
                              <p className="text-sm text-muted-foreground">{table.capacity} seats · {table.status}</p>
                            </div>
                            <span className={`mt-1 h-4 w-4 shrink-0 rounded-full border ${checked ? "border-blue-600 bg-blue-600" : "border-muted-foreground"}`} />
                          </div>
                        </button>
                      );
                    })}
                    {adminTables.length === 0 && <p className="p-3 text-sm text-muted-foreground">No tables found for this area.</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button onClick={saveBooking} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  Update
                </Button>
                {selectedBooking.status === "PENDING" && (
                  <>
                    <Button onClick={() => action("approve")}>
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="outline" onClick={() => action("reject")}>
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={closeBooking}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => action("delete")}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BookingMiniMap({ booking, tables }: { booking: Booking; tables: RestaurantTable[] }) {
  const selected = new Set(booking.tables.map((table) => table.id));
  if (tables.length === 0) return <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">Loading time map…</div>;
  const maxX = Math.max(...tables.map((table) => table.x + table.width), 1);
  const maxY = Math.max(...tables.map((table) => table.y + table.height), 1);
  return (
    <div className="rounded-xl border bg-slate-50 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div><p className="font-semibold">Booking time map</p><p className="text-sm text-muted-foreground">{booking.bookingDate} · {booking.startTime}–{booking.endTime} · {booking.area}</p></div>
        <p className="text-sm font-medium text-blue-700">Highlighted: {booking.tables.map((table) => table.tableNumber).join(", ")}</p>
      </div>
      <div className="relative aspect-[16/9] min-h-52 overflow-hidden rounded-lg border bg-white">
        {tables.map((table) => {
          const active = selected.has(table.id);
          return <div key={table.id} className={`absolute flex items-center justify-center rounded-md border-2 text-xs font-bold shadow-sm ${active ? "z-10 border-blue-700 bg-blue-600 text-white ring-4 ring-blue-200" : "border-slate-300 bg-slate-100 text-slate-600"}`} style={{left:`${(table.x/maxX)*88+3}%`,top:`${(table.y/maxY)*80+5}%`,width:`${Math.max(7,(table.width/maxX)*90)}%`,height:`${Math.max(12,(table.height/maxY)*86)}%`,transform:`rotate(${table.rotation||0}deg)`}}>{table.tableNumber}</div>;
        })}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="truncate font-medium">{value || "-"}</p>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

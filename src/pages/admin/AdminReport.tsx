import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AREAS, BOOKING_STATUSES, adminApi } from "@/services/api";
import { BookingStatus, ReportSummary, RestaurantArea } from "@/types/booking";

export default function AdminReport() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", area: "", status: "" });

  useEffect(() => {
    void load();
  }, []);

  const load = async () => setSummary(await adminApi.reportSummary(filters));
  const chartData = Object.entries(summary?.bookingsByDate || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Reports</h2>
        <p className="text-sm text-muted-foreground">Live booking metrics from backend data.</p>
      </div>
      <div className="grid gap-3 rounded-md border bg-white p-4 md:grid-cols-5">
        <Input type="date" value={filters.startDate} onChange={(event) => setFilters({ ...filters, startDate: event.target.value })} />
        <Input type="date" value={filters.endDate} onChange={(event) => setFilters({ ...filters, endDate: event.target.value })} />
        <Select value={filters.area || "ALL"} onValueChange={(value) => setFilters({ ...filters, area: value === "ALL" ? "" : (value as RestaurantArea) })}>
          <SelectTrigger><SelectValue placeholder="Area" /></SelectTrigger>
          <SelectContent><SelectItem value="ALL">All areas</SelectItem>{AREAS.map((area) => <SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filters.status || "ALL"} onValueChange={(value) => setFilters({ ...filters, status: value === "ALL" ? "" : (value as BookingStatus) })}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="ALL">All statuses</SelectItem>{BOOKING_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
        </Select>
        <Button onClick={load}>Apply</Button>
      </div>
      {summary ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Metric label="Total" value={summary.totalBookings} />
            <Metric label="Pending" value={summary.pendingBookings} />
            <Metric label="Approved" value={summary.approvedBookings} />
            <Metric label="Rejected" value={summary.rejectedBookings} />
            <Metric label="Cancelled" value={summary.cancelledBookings} />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard title="Bookings by date" data={chartData} />
            <ChartCard title="Bookings by area" data={Object.entries(summary.bookingsByArea).map(([name, value]) => ({ name, value }))} />
            <ChartCard title="Bookings by table" data={Object.entries(summary.bookingsByTable).map(([name, value]) => ({ name, value }))} />
            <ChartCard title="Peak hours" data={Object.entries(summary.peakHours).map(([name, value]) => ({ name, value }))} />
          </div>
        </>
      ) : (
        <p className="rounded-md border bg-white p-6 text-center text-muted-foreground">Loading report...</p>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-white p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function ChartCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <div className="rounded-md border bg-white p-4">
      <h3 className="mb-4 font-semibold">{title}</h3>
      {data.length ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No data.</p>
      )}
    </div>
  );
}

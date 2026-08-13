import { BarChart3, CalendarCheck, Clock3, LogOut, Table2, UtensilsCrossed } from "lucide-react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminApi, adminAuth } from "@/services/api";
import { Button } from "@/components/ui/button";
import { PushNotificationButton } from "@/components/PushNotificationButton";
import { useEffect, useState } from "react";
import { useBookingRealtime } from "@/hooks/use-booking-realtime";

const links = [
  { to: "/admin-panel/booking", label: "Booking", icon: CalendarCheck },
  { to: "/admin-panel/table", label: "Table", icon: Table2 },
  { to: "/admin-panel/report", label: "Report", icon: BarChart3 },
  { to: "/admin-panel/time-map", label: "Time Map", icon: Clock3 },
  { to: "/admin-panel/menu", label: "Menu", icon: UtensilsCrossed },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isTimeMap = location.pathname === "/admin-panel/time-map";
  const [pendingCount, setPendingCount] = useState(0);
  const loadPendingCount = async () => {
    try { setPendingCount((await adminApi.pendingBookingCount()).count); } catch { /* auth redirect/error is handled by API client */ }
  };
  useEffect(() => { void loadPendingCount(); }, []);
  useBookingRealtime(() => { void loadPendingCount(); });
  if (!adminAuth.isLoggedIn()) {
    return <Navigate to={`/admin-panel/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`} replace />;
  }
  return (
    <div className="admin-app-shell flex min-h-[100dvh] flex-col bg-muted/30">
      <header className="sticky top-0 z-40 shrink-0 border-b bg-white/90 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3 md:py-4">
          <div>
            <h1 className="text-base font-semibold sm:text-xl">Riverside Terrace Admin</h1>
            <p className="hidden text-sm text-muted-foreground sm:block">Booking, table and report management</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto h-9 w-9 shrink-0 rounded-full md:hidden"
            aria-label="Logout"
            onClick={() => { adminAuth.logout(); navigate("/admin-panel/login"); }}
          ><LogOut className="h-4 w-4" /></Button>
          <nav className="admin-mobile-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-6 border-t bg-white/95 px-1 backdrop-blur-xl md:static md:flex md:w-auto md:gap-1 md:border-0 md:bg-transparent md:p-0">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition md:h-10 md:flex-row md:px-3 md:py-0 md:text-sm ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-white text-foreground hover:bg-muted"
                  }`
                }
              >
                <span className="relative"><Icon className="h-4 w-4 shrink-0" />{to === "/admin-panel/booking" && pendingCount > 0 && <span className="absolute -right-3 -top-3 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">{pendingCount > 99 ? "99+" : pendingCount}</span>}</span>
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
            <PushNotificationButton />
            <Button
              variant="outline"
              className="hidden h-10 min-w-0 px-1 text-xs md:inline-flex md:shrink-0 md:px-3 md:text-sm"
              onClick={() => {
                adminAuth.logout();
                navigate("/admin-panel/login");
              }}
            >
              <LogOut className="h-4 w-4 shrink-0 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </nav>
        </div>
      </header>
      <main className={isTimeMap ? "min-h-0 flex-1 overflow-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0" : "container mx-auto px-3 py-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-4 sm:py-6 md:pb-6"}>
        <Outlet />
      </main>
    </div>
  );
}

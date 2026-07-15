import { BarChart3, CalendarCheck, Clock3, LogOut, Table2 } from "lucide-react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminAuth } from "@/services/api";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/admin-panel/booking", label: "Booking", icon: CalendarCheck },
  { to: "/admin-panel/table", label: "Table", icon: Table2 },
  { to: "/admin-panel/report", label: "Report", icon: BarChart3 },
  { to: "/admin-panel/time-map", label: "Time Map", icon: Clock3 },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isTimeMap = location.pathname === "/admin-panel/time-map";
  if (!adminAuth.isLoggedIn()) {
    return <Navigate to={`/admin-panel/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`} replace />;
  }
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="z-40 shrink-0 border-b bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Riverside Terrace Admin</h1>
            <p className="text-sm text-muted-foreground">Booking, table and report management</p>
          </div>
          <nav className="grid w-full grid-cols-5 gap-1 sm:flex sm:w-auto sm:gap-2 sm:overflow-x-auto">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex h-10 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-xs font-medium transition sm:gap-2 sm:px-3 sm:text-sm ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-white text-foreground hover:bg-muted"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
            <Button
              variant="outline"
              className="h-10 min-w-0 px-1 text-xs sm:shrink-0 sm:px-3 sm:text-sm"
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
      <main className={isTimeMap ? "min-h-0 flex-1 overflow-hidden" : "container mx-auto px-4 py-6"}>
        <Outlet />
      </main>
    </div>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Menu from "./pages/Menu";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AdminBooking from "./pages/admin/AdminBooking";
import AdminTable from "./pages/admin/AdminTable";
import AdminReport from "./pages/admin/AdminReport";
import AdminMenu from "./pages/admin/AdminMenu";
import TimeMapIndex from "./features/time-map/pages/Index";
import { AuthProvider as TimeMapAuthProvider } from "./features/time-map/hooks/use-auth";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route element={<PublicLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
            </Route>
            <Route path="/menu-only" element={<Menu />} />
            <Route
              path="/guest/timemap"
              element={(
                <TimeMapAuthProvider>
                  <TimeMapIndex viewOnly />
                </TimeMapAuthProvider>
              )}
            />
            <Route path="/admin-panel/login" element={<AdminLogin />} />
            <Route path="/admin-panel" element={<Navigate to="/admin-panel/booking" replace />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin-panel/booking" element={<AdminBooking />} />
              <Route path="/admin-panel/table" element={<AdminTable />} />
              <Route path="/admin-panel/report" element={<AdminReport />} />
              <Route path="/admin-panel/menu" element={<AdminMenu />} />
              <Route
                path="/admin-panel/time-map"
                element={(
                  <TimeMapAuthProvider>
                    <TimeMapIndex embedded />
                  </TimeMapAuthProvider>
                )}
              />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

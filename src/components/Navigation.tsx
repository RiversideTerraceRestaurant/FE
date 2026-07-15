import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const logoUrl = "https://res.cloudinary.com/dbp8ozwty/image/upload/v1764756385/z7288581516415_acc08636c048abc731036e54bc165913_gwix72.jpg";

const navItems = [
  { label: "navHome", to: "/home" },
  { label: "navBooking", to: "/booking" },
  { label: "navMenu", to: "/menu" },
  { label: "navAbout", to: "/about" },
];

export const Navigation = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: t("navLoggedOut"),
      description: t("navLoggedOutDescription"),
    });
    navigate("/home");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 shadow-sm backdrop-blur-sm animate-slide-down">
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
        <div className="flex min-h-16 w-full items-center justify-between gap-3">
          <Link
            to="/home"
            aria-label="Riverside Terrace home"
            className="flex min-w-0 items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
              <img
                src={logoUrl}
                alt="Riverside Terrace Restaurant"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="truncate text-sm font-semibold sm:text-base">Riverside Terrace</span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSelector />
            {user ? (
              <>
                <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="hidden md:inline-flex"
                >
                  {t("navDashboard")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("navLogout")}</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                size="sm"
                className="gap-2 shadow-md transition-all hover:shadow-lg"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t("navLogin")}</span>
              </Button>
            )}
          </div>
        </div>
        <nav className="flex w-full items-center gap-1 overflow-x-auto border-t border-border py-2 md:justify-center md:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`
              }
            >
                {t(item.label)}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

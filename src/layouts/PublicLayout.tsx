import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export function PublicLayout() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <footer className="relative mt-12 bg-white py-12 text-black">
        <div className="relative z-10 container mx-auto max-w-6xl px-4 text-center">
          <p className="mb-3 font-sans text-2xl font-semibold">
            <span className="mb-4 text-sm opacity-90">Riverside Terrace</span>{" "}
            <span className="mb-4 text-sm opacity-90">Restaurant</span>
          </p>
          <p className="mb-4 text-sm opacity-90">{t("footerAddress")}</p>
          <div className="mx-auto h-px w-32 bg-black/10" />
          <p className="mt-4 text-xs opacity-75">(+84) 911500440</p>
        </div>
      </footer>
    </div>
  );
}

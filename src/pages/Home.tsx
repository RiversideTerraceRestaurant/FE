import { ArrowRight, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/type/type";
import restaurantImage from "@/assets/restaurant.png";
import { useLanguage } from "@/contexts/LanguageContext";

const heroImage = "https://res.cloudinary.com/dbp8ozwty/image/upload/v1764899267/z7291253840965_9eefef40c488b1bd2d17bff28170f43f_1_wg9t7t.jpg";
export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    supabase
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(6)
      .then(({ data }) => setItems(data || []));
  }, []);

  return (
    <div className="bg-background">
      <section className="relative min-h-[520px] overflow-hidden">
        <img src={heroImage} alt="Riverside Terrace restaurant dining room" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 container mx-auto flex min-h-[520px] items-center px-4 py-16">
          <div className="max-w-2xl animate-fade-in text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest">{t("homeEyebrow")}</p>
            <h1 className="mb-4 text-4xl font-semibold leading-tight md:text-6xl">{t("homeTitle")}</h1>
            <p className="mb-6 text-base leading-7 text-white/90 md:text-lg">
              {t("homeSubtitle")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/booking">
                  <CalendarCheck className="mr-2 h-5 w-5" />
                  {t("homeBook")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/menu">
                  {t("homeMenu")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div className="animate-fade-in">
            <h2 className="mb-3 text-3xl font-semibold">{t("homeWarmTitle")}</h2>
            <p className="text-muted-foreground">
              {t("homeWarmText")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[heroImage, restaurantImage, heroImage, restaurantImage].map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt="Restaurant gallery"
                onError={(event) => {
                  event.currentTarget.src = "/placeholder.svg";
                }}
                className="aspect-[4/3] w-full rounded-md object-cover shadow-card"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/45 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">{t("homeSpecialTitle")}</h2>
              <p className="mt-2 text-muted-foreground">{t("homeSpecialText")}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/menu">{t("homeExplore")}</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-md border bg-white shadow-card">
                <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className="shrink-0 text-sm font-semibold text-primary">{item.price?.toLocaleString()} VND</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </article>
            ))}
            {items.length === 0 && <p className="text-muted-foreground">{t("homeLoadingMenu")}</p>}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-2 md:py-16">
        <div className="rounded-md border bg-white p-6 shadow-card">
          <h2 className="mb-2 text-2xl font-semibold">{t("homePlanTitle")}</h2>
          <p className="mb-5 text-muted-foreground">{t("homePlanText")}</p>
          <Button asChild>
            <Link to="/booking">{t("homeGoBooking")}</Link>
          </Button>
        </div>
        <div className="rounded-md border bg-white p-6 shadow-card">
          <h2 className="mb-2 text-2xl font-semibold">{t("homeBrowseTitle")}</h2>
          <p className="mb-5 text-muted-foreground">{t("homeBrowseText")}</p>
          <Button asChild variant="secondary">
            <Link to="/menu">{t("homeOpenMenu")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

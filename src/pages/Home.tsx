import { ArrowRight, CalendarCheck, ChevronDown, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
      .order("price", { ascending: false, nullsFirst: false })
      .limit(5)
      .then(({ data }) => setItems(data || []));
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".home-morph");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.16 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden bg-[radial-gradient(circle_at_12%_20%,hsl(16_85%_93%),transparent_32%),radial-gradient(circle_at_88%_55%,hsl(34_90%_90%),transparent_35%),linear-gradient(180deg,#fffaf5,#f8eee5)]">
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden p-3 sm:p-5">
        <div className="absolute inset-0 scale-105 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl items-end px-3 pb-10 sm:px-8 sm:pb-16">
          <div className="liquid-glass home-morph max-w-3xl rounded-[2rem] p-6 text-white sm:p-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{t("homeEyebrow")}</p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] md:text-7xl">{t("homeTitle")}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 md:text-lg">{t("homeSubtitle")}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-7 shadow-xl">
                <Link to="/booking"><CalendarCheck className="mr-2 h-5 w-5" />{t("homeBook")}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="rounded-full bg-white/85 px-7 backdrop-blur-lg">
                <Link to="/menu">{t("homeMenu")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
        <ChevronDown className="absolute bottom-5 left-1/2 z-10 h-7 w-7 -translate-x-1/2 animate-bounce text-white/75" />
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="home-morph liquid-glass grid gap-8 overflow-hidden p-5 md:grid-cols-[0.9fr_1.1fr] md:items-center md:p-8">
          <div className="p-2 md:p-6">
            <UtensilsCrossed className="mb-5 h-9 w-9 text-primary" />
            <h2 className="text-3xl font-semibold md:text-5xl">{t("homeWarmTitle")}</h2>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">{t("homeWarmText")}</p>
          </div>
          <div className="relative min-h-[360px]">
            <img src={heroImage} alt="Restaurant dining room" className="absolute left-0 top-0 h-[72%] w-[72%] rounded-[2rem] object-cover shadow-2xl" />
            <img src={restaurantImage} alt="Riverside Terrace" className="absolute bottom-0 right-0 h-[64%] w-[64%] rounded-[2rem] border-4 border-white/70 object-cover shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="home-morph liquid-glass p-6 md:p-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Top 5</p>
              <h2 className="mt-2 text-3xl font-semibold md:text-5xl">{t("homeSpecialTitle")}</h2>
              <p className="mt-3 text-muted-foreground">{t("homeSpecialText")}</p>
            </div>
            <Button asChild variant="outline" className="rounded-full bg-white/60"><Link to="/menu">{t("homeExplore")}</Link></Button>
          </div>
          {items.length ? (
            <Carousel opts={{ align: "start", loop: items.length > 2 }} className="mx-auto w-full">
              <CarouselContent className="-ml-3">
                {items.map((item) => (
                  <CarouselItem key={item.id} className="basis-[88%] pl-3 sm:basis-1/2 lg:basis-1/3">
                    <article className="group h-full overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/55 shadow-lg backdrop-blur-md">
                      <div className="overflow-hidden"><img src={item.image_url || "/placeholder.svg"} alt={item.name} className="h-56 w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{item.price?.toLocaleString()} VND</span>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                      </div>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3 border-white/70 bg-white/85 shadow-lg" />
              <CarouselNext className="right-3 border-white/70 bg-white/85 shadow-lg" />
            </Carousel>
          ) : <p className="text-muted-foreground">{t("homeLoadingMenu")}</p>}
        </div>
      </section>

      <section className="container mx-auto grid gap-5 px-4 pb-16 md:grid-cols-2 md:pb-24">
        {[
          { title: t("homePlanTitle"), text: t("homePlanText"), label: t("homeGoBooking"), to: "/booking" },
          { title: t("homeBrowseTitle"), text: t("homeBrowseText"), label: t("homeOpenMenu"), to: "/menu" },
        ].map((card) => (
          <div key={card.to} className="home-morph liquid-glass flex min-h-64 flex-col justify-between p-7 md:p-9">
            <div><h2 className="text-2xl font-semibold md:text-3xl">{card.title}</h2><p className="mt-3 leading-7 text-muted-foreground">{card.text}</p></div>
            <Button asChild className="mt-8 w-fit rounded-full px-6"><Link to={card.to}>{card.label}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        ))}
      </section>
    </div>
  );
}

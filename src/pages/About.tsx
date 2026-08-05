import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const mapsUrl = "https://maps.app.goo.gl/UQ64H1smLtqcHJCV6";
  const { t } = useLanguage();
  return (
    <div className="bg-background">
      <section className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-[1fr_1.1fr] md:py-16">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">{t("aboutEyebrow")}</p>
          <h1 className="mb-4 text-4xl font-semibold">{t("homeTitle")}</h1>
          <p className="leading-7 text-muted-foreground">
            {t("aboutText")}
          </p>
        </div>
        <img
          src="https://res.cloudinary.com/dbp8ozwty/image/upload/v1764899267/z7291253840965_9eefef40c488b1bd2d17bff28170f43f_1_wg9t7t.jpg"
          alt="Riverside Terrace dining space"
          className="aspect-[4/3] w-full rounded-md object-cover shadow-card"
        />
      </section>
      <section className="bg-muted/45 py-12">
        <div className="container mx-auto grid gap-4 px-4 md:grid-cols-3">
          <div className="rounded-md border bg-white p-5">
            <MapPin className="mb-3 h-5 w-5 text-primary" />
            <h2 className="mb-2 font-semibold">{t("aboutAddress")}</h2>
            <p className="text-sm text-muted-foreground">{t("footerAddress")}</p>
          </div>
          <div className="rounded-md border bg-white p-5">
            <Phone className="mb-3 h-5 w-5 text-primary" />
            <h2 className="mb-2 font-semibold">{t("aboutPhone")}</h2>
            <p className="text-sm text-muted-foreground">(+84) 911500440</p>
          </div>
          <div className="rounded-md border bg-white p-5">
            <Mail className="mb-3 h-5 w-5 text-primary" />
            <h2 className="mb-2 font-semibold">{t("aboutEmail")}</h2>
            <p className="text-sm text-muted-foreground">litalianoriverside@gmail.com</p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-2xl font-semibold">{t("aboutHours")}</h2>
            <p className="text-muted-foreground">{t("aboutDaily")}</p>
          </div>
          <div>
            <h2 className="mb-3 text-2xl font-semibold">{t("aboutFind")}</h2>
            <Button asChild>
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                {t("aboutMaps")}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

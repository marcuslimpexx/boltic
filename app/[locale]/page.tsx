import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-6xl font-bold text-primary">{t("hero_title")}</h1>
      <p className="mt-4 text-muted">{t("hero_subtitle")}</p>
    </main>
  );
}

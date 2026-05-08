import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { SettingsForms } from "./settings-forms";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return { title: t("settings") };
}

export default async function SettingsPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const t = await getTranslations({ locale, namespace: "account" });

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/account">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("title")}
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">{t("settings")}</h1>
      <SettingsForms
        name={session.user.name ?? ""}
        email={session.user.email ?? ""}
      />
    </div>
  );
}

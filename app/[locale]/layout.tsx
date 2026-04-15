import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SiteHeader } from "@/components/SiteHeader";
import { routing } from "@/i18n/routing";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    zh: "个人网站",
    en: "Personal site",
  };
  return {
    title: titles[locale] ?? titles.zh,
    description:
      locale === "en"
        ? "Portfolio and blog."
        : "作品集与技术博客。",
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-dvh antialiased">
        {gaMeasurementId ? (
          <GoogleAnalytics measurementId={gaMeasurementId} />
        ) : null}
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

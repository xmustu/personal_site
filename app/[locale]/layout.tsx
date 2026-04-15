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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const canonicalPath = locale === "zh" ? "" : `/${locale}`;
  const canonicalUrl = `${normalizedSiteUrl}${canonicalPath}`;
  const titles: Record<string, string> = {
    zh: "个人网站",
    en: "Personal site",
  };
  const descriptions: Record<string, string> = {
    en: "Portfolio and blog.",
    zh: "作品集与技术博客。",
  };

  return {
    title: titles[locale] ?? titles.zh,
    description: descriptions[locale] ?? descriptions.zh,
    metadataBase: new URL(normalizedSiteUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        zh: `${normalizedSiteUrl}`,
        en: `${normalizedSiteUrl}/en`,
      },
    },
    openGraph: {
      title: titles[locale] ?? titles.zh,
      description: descriptions[locale] ?? descriptions.zh,
      url: canonicalUrl,
      siteName: "Personal Site",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] ?? titles.zh,
      description: descriptions[locale] ?? descriptions.zh,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isProduction = process.env.NODE_ENV === "production";

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-dvh antialiased">
        {isProduction && gaMeasurementId ? (
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

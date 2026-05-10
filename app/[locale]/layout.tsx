import type { Metadata } from "next";
import SkyBackground from "@/components/SkyBackground";
import { notFound } from "next/navigation";

const locales = ["en", "es", "fr", "ru"];

export const metadata: Metadata = {
  title: "Million Dollars Listing Marbella",
  description: "Ultra-luxury properties in Marbella",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  return (
    <html lang={locale}>
      <body style={{ background: "#000", margin: 0 }}>
        <SkyBackground />{children}</body>
    </html>
  );
}

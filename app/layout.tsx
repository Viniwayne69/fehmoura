import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { SITE_NAME, SITE_URL, SLOGAN } from "@/lib/constants";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

const description =
  "Feh Moura é DJ de música eletrônica, house e groove. Sets personalizados para clubes, festivais, festas privadas e eventos corporativos.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | ${SLOGAN}`, template: `%s | ${SITE_NAME}` },
  description,
  keywords: ["DJ Feh Moura", "Feh Moura", "DJ", "DJ para eventos", "DJ house", "música eletrônica", "DJ para festas"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SLOGAN}`,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "DJ Feh Moura tocando para a pista lotada" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#070707", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}

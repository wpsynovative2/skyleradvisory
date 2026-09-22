import type { Metadata, Viewport } from "next";
import { Baskervville, DM_Sans, Expletus_Sans, Jost, Poppins } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import site from "@/data/site.json";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import EnquiryModal from "@/components/forms/EnquiryModal";
import DisclaimerGate from "@/components/ui/DisclaimerGate";
import PageLoader from "@/components/ui/PageLoader";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { EnquiryModalProvider } from "@/components/ui/EnquiryModalProvider";
import { RECAPTCHA_SCRIPT_SRC, recaptchaEnabled } from "@/lib/recaptcha";
import "./globals.css";

/* The five families the original site loads, self-hosted by next/font. */
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], display: "swap" });

const baskervville = Baskervville({
  variable: "--font-baskervville",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const expletus = Expletus_Sans({
  variable: "--font-expletus",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/* Brand faces supplied in public/fonts. */
const monari = localFont({
  src: "../public/fonts/Monari.ttf",
  variable: "--font-monari",
  display: "swap",
  weight: "400",
});

const shunsine = localFont({
  src: "../public/fonts/Shunsine.ttf",
  variable: "--font-shunsine",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "real estate advisory Mumbai",
    "property consultant Mumbai",
    "residential project sales",
    "commercial project sales",
    "developer mandate",
    "Skyler Advisory",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.legalName} | ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.legalName} | ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#282360",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.legalName,
  description: site.description,
  url: site.url,
  telephone: site.contact.phones,
  email: site.contact.emails[0],
  foundingDate: String(site.establishedYear),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 20, B/908, Sector 9, Ghansoli",
    addressLocality: "Navi Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400701",
    addressCountry: "IN",
  },
  areaServed: "Mumbai Metropolitan Region",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${baskervville.variable} ${expletus.variable} ${dmSans.variable} ${poppins.variable} ${monari.variable} ${shunsine.variable} h-full antialiased`}
    >
      {/* pb clears the fixed mobile action bar; the bar itself covers that strip */}
      <body className="flex min-h-full flex-col bg-navy pb-[74px] lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <EnquiryModalProvider>
          <SmoothScroll />
          <PageLoader />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingActions />
          <EnquiryModal />
          <DisclaimerGate />
        </EnquiryModalProvider>

        {/* reCAPTCHA v3 scores the whole visit, so it loads site-wide rather
            than only where a form is on screen. Skipped when no key is set. */}
        {recaptchaEnabled ? (
          <Script id="recaptcha-v3" src={RECAPTCHA_SCRIPT_SRC} strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  );
}

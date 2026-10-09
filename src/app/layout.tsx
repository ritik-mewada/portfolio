import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CommandMenu } from "@/components/command-menu";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { ScrollProgress } from "@/components/scroll-progress";
import { site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const description = `${site.name} — ${site.summary}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s · ${site.name}` },
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    site.name,
    "Software Engineer",
    "QA Engineer",
    "IoT QA",
    "Software Validation",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "Playwright",
    "Toronto",
    "Ontario",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.summary,
    firstName: "Ritik",
    lastName: "Mewada",
  },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.role}`, description: site.summary },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#121318" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: "IoT QA / Software Validation Engineer",
  worksFor: { "@type": "Organization", name: "Maestro Digital Mine" },
  address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Humber College" },
    { "@type": "CollegeOrUniversity", name: "Gujarat Technological University" },
  ],
  sameAs: [site.socials.github, site.socials.linkedin],
  knowsAbout: ["Software Quality Assurance", "Test Automation", "IoT", "React", "Next.js", "Node.js", "TypeScript"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="flex min-h-svh flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-accent px-4 py-2 text-accent-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Providers>
          <ScrollProgress />
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CommandMenu />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

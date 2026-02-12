import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  const siteName = settings?.siteName || "Sport Health";
  const titleTemplate = settings?.titleTemplate || `%s | ${siteName}`;
  const description = settings?.description || "Fisioterapia Esportiva SJC - Dr. Carlos Prado";

  return {
    title: {
      default: siteName,
      template: titleTemplate,
    },
    description: description,
    openGraph: {
      images: settings?.ogImage ? [settings.ogImage] : [],
      title: siteName,
      description: description,
    },
    twitter: {
      card: 'summary_large_image',
      site: settings?.twitterHandle || '',
      title: siteName,
      description: description,
    },
    themeColor: settings?.themeColor || '#0a4d2c',
    icons: settings?.iconUrl ? [settings.iconUrl] : []
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": settings?.siteName || "Sport Health - Dr. Carlos Prado",
    "image": settings?.ogImage || "/images/hero-dr-carlos.jpg",
    "telephone": settings?.contactPhone || "+5512997150819",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.address || "Av. Linneu de Moura, s/n",
      "addressLocality": settings?.addressCity || "São José dos Campos",
      "addressRegion": settings?.addressRegion || "SP",
      "postalCode": settings?.addressPostalCode || "12244-380",
      "addressCountry": "BR"
    },
    "priceRange": "R$",
    "openingHours": "Mo-Su 00:00-23:59"
  };

  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
        {settings?.iconUrl && <link rel="icon" href={settings.iconUrl} />}
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased font-inter bg-[#fafafa] text-[#1a1a1a]`}>
        {children}
      </body>
    </html>
  );
}

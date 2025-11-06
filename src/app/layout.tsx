import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "./providers";
import "@/index.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Y Hotel - Khách Sạn Sang Trọng | Đặt Phòng Trực Tuyến",
  description: "Y Hotel - Khách sạn sang trọng với dịch vụ đẳng cấp quốc tế. Đặt phòng trực tuyến với ưu đãi tốt nhất. Trải nghiệm nghỉ dưỡng đẳng cấp.",
  keywords: "khách sạn, sang trọng, đặt phòng, Y Hotel, nghỉ dưỡng, phòng cao cấp, dịch vụ 5 sao",
  authors: [{ name: "Y Hotel" }],
  openGraph: {
    title: "Y Hotel - Khách Sạn Sang Trọng",
    description: "Y Hotel - Khách sạn sang trọng với dịch vụ đẳng cấp quốc tế. Đặt phòng trực tuyến với ưu đãi tốt nhất.",
    type: "website",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lovable_dev",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Y Hotel",
    "description": "Khách sạn sang trọng với dịch vụ đẳng cấp quốc tế tại trung tâm thành phố",
    "url": "https://yhotel.lovable.app",
    "telephone": "+84-123-456-789",
    "email": "info@yhotel.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Đường ABC",
      "addressLocality": "Thành phố Hồ Chí Minh",
      "addressCountry": "VN"
    },
    "starRating": {
      "@type": "Rating",
      "ratingValue": "5"
    },
    "priceRange": "$$$$",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "WiFi miễn phí"
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Hồ bơi"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Phòng gym"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Nhà hàng"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  };

  return (
    <html lang="vi" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <Providers>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}


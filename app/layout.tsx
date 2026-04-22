import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "The Lady Fashion Store — Premium Indian Sarees",
  description: "Discover handpicked, authentic Indian sarees for every occasion. Bringing the finest weavers across India directly to your doorstep.",
  keywords: "sarees online, buy sarees, silk sarees, banarasi sarees, wedding sarees India",
  openGraph: {
    type: "website",
    title: "The Lady Fashion Store — Premium Indian Sarees",
    description: "Discover handpicked, authentic Indian sarees for every occasion.",
    images: [{ url: "https://picsum.photos/seed/sareestory/1200/630" }],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
        <WhatsAppButton number={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""} />
      </body>
    </html>
  );
}

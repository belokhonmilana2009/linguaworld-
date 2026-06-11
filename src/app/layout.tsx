import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "LinguaWorld — Изучай английский с AI",
    template: "%s | LinguaWorld",
  },
  description: "Премиальная платформа для изучения английского языка. Проходи путь от A0 до C2 через интерактивные задания, голосовые ответы и ИИ-проверку.",
  keywords: ["английский язык", "изучение английского", "english learning", "AI english", "lingua world"],
  authors: [{ name: "LinguaWorld" }],
  creator: "LinguaWorld",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "LinguaWorld",
    title: "LinguaWorld — Изучай английский с AI",
    description: "Премиальная платформа для изучения английского языка с ИИ-проверкой",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinguaWorld — Изучай английский с AI",
    description: "Премиальная платформа для изучения английского языка с ИИ-проверкой",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

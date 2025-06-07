import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CharacterProvider } from "@/app/contexts/characterContext";
import MainLayout from "@/app/components/templates/MainLayout/MainLayout";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rick & Morty",
  description: "Test app for Rick & Morty characters by Maria Mesa Rojas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${montserrat.className}`}>
        <CharacterProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </CharacterProvider>
      </body>
    </html>
  );
}

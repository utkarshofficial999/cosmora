import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { SpaceCanvas } from "@/components/three/SpaceCanvas";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Cosmora — Story-Driven 3D Space Platform",
  description:
    "Production-grade story-driven space education, 3D solar system exploration, mission control, and AI assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="bg-space-dark text-slate-100 antialiased selection:bg-cyan-500 selection:text-white relative min-h-screen">
        {/* Persistent 3D Canvas Background Viewport */}
        <SpaceCanvas />

        {/* Global Navigation Header */}
        <Navbar />

        {/* Main Page Content */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Bebas_Neue, Gloock, Manrope } from "next/font/google";
import "./globals.css";
import Iconify from "@/components/Iconify";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const gloock = Gloock({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gloock",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  title: "Vectorline | Spec Console",
  description:
    "Vectorline turns planning sessions into annotated structures: live frames, spatial notes, asset references, ownership signals, and route-level context rendered in one calm workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${manrope.variable} ${gloock.variable} ${bebasNeue.variable} bg-[#070707] text-white font-sans antialiased selection:bg-[#e8c382] selection:text-[#351e10] overflow-x-hidden min-h-screen`}
      >
        <Iconify />
        {children}
      </body>
    </html>
  );
}

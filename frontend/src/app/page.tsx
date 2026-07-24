import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CopilotDashboard from "@/components/CopilotDashboard";
import PlatformOverview from "@/components/PlatformOverview";
import Architecture from "@/components/Architecture";
import Signals from "@/components/Signals";
import FaqSection from "@/components/FaqSection";
import Protocol from "@/components/Protocol";
import Deployment from "@/components/Deployment";
import Footer from "@/components/Footer";
import AnimationRoot from "@/components/AnimationRoot";

export default function Home() {
  return (
    <>
      {/* Fixed atmosphere layers */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.02] mix-blend-screen noise-bg"></div>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30 grid-lines"></div>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-48 opacity-60 top-fade"></div>

      <Header />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Hero />
        <CopilotDashboard />
        <PlatformOverview />
        <Architecture />
        <Signals />
        <FaqSection />
        <Protocol />
        <Deployment />
      </main>

      <Footer />

      {/* Lenis + GSAP motion engine (client-only) */}
      <AnimationRoot />
    </>
  );
}

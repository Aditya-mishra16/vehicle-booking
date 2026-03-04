"use client";
import dynamic from "next/dynamic";

import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import Services from "@/components/home/Services";
import ImageBannerSection from "@/components/home/ImageBannerSection";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

const FAQSection = dynamic(() => import("@/components/home/FAQSection"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <Services />
      <ImageBannerSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </div>
  );
}

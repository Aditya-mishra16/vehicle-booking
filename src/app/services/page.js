"use client";

import ServiceDetails from "@/components/services/ServiceDetails";
import ImageBannerSection from "@/components/home/ImageBannerSection";
import ServicesSection from "@/components/home/Services";

export default function ServicesPage() {
  return (
    <>
      <ServiceDetails />
      <ImageBannerSection />
      <ServicesSection />
    </>
  );
}

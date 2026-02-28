import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
          Didn’t find what <br />
          you’re <span className="text-brandColor">looking for?</span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 text-lg mb-10">
          Send your questions and we’ll respond shortly.
        </p>

        {/* Button */}
        <Button className="bg-black hover:bg-neutral-800 text-white px-8 py-4 rounded-xl text-base flex items-center gap-2 mx-auto">
          Ask on Whatsapp <ArrowRight size={18} />
        </Button>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const defaultMessage =
    "Hi, I couldn’t find the route I was looking for. Can you help?";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    defaultMessage,
  )}`;

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
          Didn’t find what <br />
          you’re <span className="text-brandColor">looking for?</span>
        </h2>

        <p className="text-gray-500 text-lg mb-10">
          Send your questions and we’ll respond shortly.
        </p>

        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button className="bg-black hover:bg-brandColor text-white px-8 py-4 rounded-xl text-base flex items-center gap-2 mx-auto transition-all duration-300 hover:scale-105">
            Ask on WhatsApp <ArrowRight size={18} />
          </Button>
        </a>
      </div>
    </section>
  );
}

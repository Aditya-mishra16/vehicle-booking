"use client";

import { Phone, Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const contactCards = [
  {
    icon: Phone,
    label: "Phone",
    value: PHONE_NUMBER || "+91 3829247289",
    sub: "Mon–Sun, 9am–8pm",
    href: `tel:${PHONE_NUMBER || "+913829247289"}`,
    cta: "Call now",
  },
  {
    icon: Mail,
    label: "Email",
    value: "Cabeazy.travel@gmail.com",
    sub: "We reply within 24 hours",
    href: "mailto:Cabeazy.travel@gmail.com",
    cta: "Send email",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: WHATSAPP_NUMBER || "+91 3829247289",
    sub: "Fastest response",
    href: WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I want to enquire about an outstation trip.")}`
      : "#",
    cta: "Chat now",
  },
];

export default function ContactDetails() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            Let's Get <span className="text-brandColor">Talking</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            If you have any questions or you'd like to find out more about what
            we do, please get in touch.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-14 md:mb-20">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.label}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  card.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="
                  group flex flex-col items-center gap-3 text-center
                  bg-white border border-gray-100 rounded-2xl
                  p-6 shadow-sm
                  hover:shadow-md hover:border-brandColor/20
                  transition-all duration-200
                "
              >
                <div
                  className="
                  w-12 h-12 rounded-xl
                  bg-brandColor/5 border border-brandColor/10
                  flex items-center justify-center
                  group-hover:bg-brandColor group-hover:border-brandColor
                  transition-all duration-200
                "
                >
                  <Icon
                    size={20}
                    className="text-brandColor group-hover:text-white transition-colors duration-200"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{card.label}</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                </div>
                <span
                  className="
                  inline-flex items-center gap-1
                  text-xs font-medium text-brandColor
                  opacity-0 group-hover:opacity-100
                  -translate-y-1 group-hover:translate-y-0
                  transition-all duration-200
                "
                >
                  {card.cta}
                  <ArrowUpRight size={12} />
                </span>
              </a>
            );
          })}
        </div>

        {/* Form Section */}
        <div className="bg-gray-50 rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
          {/* Left Image */}
          <div className="hidden md:block">
            <img
              src="/images/contactImage.png"
              alt="Contact"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Form */}
          <div className="p-6 sm:p-8 md:p-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Send us a message
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              Fill in the form and we'll get back to you shortly.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

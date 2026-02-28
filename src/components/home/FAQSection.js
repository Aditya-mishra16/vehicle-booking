"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question:
        "How do I request a ride for outstation travel from Mumbai to Goa?",
      answer:
        "Simply enter your pickup and drop locations on the homepage, select your vehicle, choose date & time, and confirm your booking.",
    },
    {
      question: "What ride options are available to get from Mumbai to Goa?",
      answer:
        "We offer standard sedans, SUVs, and luxury vehicles depending on your comfort and budget preference.",
    },
    {
      question: "Are there any hidden charges?",
      answer:
        "No. Our pricing is completely transparent with fixed per-kilometer rates and no last-minute price jumps.",
    },
    {
      question: "Can I schedule a ride in advance?",
      answer:
        "Yes, you can schedule your ride for any future date and time while booking.",
    },
    {
      question: "Do you provide customer support during the trip?",
      answer:
        "Yes. Our support team is available to assist you before, during, and after your journey.",
    },
  ];

  return (
    <section className="pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-bold mb-16">Frequently asked questions</h2>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-200"
            >
              <AccordionTrigger className="text-left text-lg font-medium py-6 hover:no-underline">
                {faq.question}
              </AccordionTrigger>

              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

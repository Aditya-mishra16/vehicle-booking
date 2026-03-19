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
      question: "How do I book a cab with CabEazy?",
      answer:
        "Enter your pickup and drop locations, select your trip type, date and time, choose a vehicle, and review the estimated fare. Once confirmed, share your details and our team will connect with you to finalize the booking.",
    },
    {
      question: "Is the fare shown final or just an estimate?",
      answer:
        "The fare shown is an estimate based on distance and vehicle type. Final pricing may vary slightly depending on tolls, route changes, and additional requirements, but we ensure complete transparency with no hidden charges.",
    },
    {
      question: "What types of trips can I book?",
      answer:
        "You can book one-way trips, round trips, and local city rides. Our platform is designed for flexible travel based on your needs.",
    },
    {
      question: "Can I schedule a ride in advance?",
      answer:
        "Yes, you can easily schedule your ride for any future date and time while booking. This ensures availability and a smooth travel experience.",
    },
    {
      question: "How will my booking be confirmed?",
      answer:
        "Once you submit your booking details, our team will connect with you via WhatsApp to confirm your ride. You will also receive a confirmation email with complete trip details, including the assigned driver information.",
    },
    {
      question: "Are there any hidden charges?",
      answer:
        "No, we follow transparent pricing. The estimate includes base fare, but tolls, parking, and state taxes (if applicable) are charged as per actuals.",
    },
    {
      question: "What vehicles are available?",
      answer:
        "We offer a range of vehicles including hatchbacks, sedans, and SUVs to suit different budgets and group sizes.",
    },
    {
      question: "Is customer support available during the trip?",
      answer:
        "Yes, our support team is available throughout your journey to assist you with any issues or queries.",
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

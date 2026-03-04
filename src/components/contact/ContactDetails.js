"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactDetails() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            Let’s Get <span className="text-brandColor">Talking</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            If you have any questions or you'd like to find out more about what
            we do, please get in touch.
          </p>
        </div>

        {/* Contact Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center mb-14 md:mb-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white shadow flex items-center justify-center">
              <Phone className="text-brandColor" size={20} />
            </div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="font-medium">+91 3829247289</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white shadow flex items-center justify-center">
              <Mail className="text-brandColor" size={20} />
            </div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium">support@nameee.com</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white shadow flex items-center justify-center">
              <MessageCircle className="text-brandColor" size={20} />
            </div>
            <p className="text-gray-500 text-sm">Whatsapp</p>
            <p className="font-medium">+91 3829247289</p>
          </div>
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
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

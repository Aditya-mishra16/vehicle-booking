"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
      {/* Name */}
      <div className="flex flex-col gap-2 md:gap-3">
        <Label className="text-sm md:text-base font-semibold text-black">
          Name
        </Label>
        <Input
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
          className="
            h-12 md:h-14
            bg-white
            border-0
            rounded-xl
            px-5
            text-base
            placeholder:text-gray-500
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2 md:gap-3">
        <Label className="text-sm md:text-base font-semibold text-black">
          Email
        </Label>
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="
            h-12 md:h-14
            bg-white
            border-0
            rounded-xl
            px-5
            text-base
            placeholder:text-gray-500
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2 md:gap-3">
        <Label className="text-sm md:text-base font-semibold text-black">
          Your message
        </Label>
        <Textarea
          name="message"
          placeholder="Enter your message..."
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          className="
            bg-white
            border-0
            rounded-xl
            px-5
            py-3 md:py-4
            text-base
            placeholder:text-gray-500
            resize-none
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="
          w-full
          h-12 md:h-14
          bg-black
          hover:bg-gray-900
          text-white
          rounded-xl
          text-base
          font-medium
        "
      >
        Submit →
      </Button>
    </form>
  );
}

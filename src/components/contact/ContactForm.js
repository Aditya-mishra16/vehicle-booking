"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Zod validation
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const issues = result.error?.issues ?? result.error?.errors ?? [];
      toast.error(issues[0]?.message ?? "Please fill in all fields correctly");
      return;
    }

    const loadingToast = toast.loading("Sending message...");
    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FloatingInput
        label="Your Name"
        name="name"
        required
        value={formData.name}
        onChange={handleChange}
        disabled={loading}
      />

      <FloatingInput
        label="Email Address"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
        disabled={loading}
      />

      <FloatingTextarea
        label="Your Message"
        name="message"
        required
        value={formData.message}
        onChange={handleChange}
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="
          w-full h-14 rounded-xl
          bg-black text-white font-medium text-base
          hover:bg-gray-900
          active:scale-[0.98]
          transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-md
        "
      >
        {loading ? "Sending..." : "Send Message →"}
      </button>
    </form>
  );
}

// ── FLOATING INPUT ────────────────────────────────────────────────────────
function FloatingInput({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
  disabled,
}) {
  return (
    <div className="relative group">
      <span
        className={`
          absolute left-4 px-1 text-xs z-10
          bg-white transition-all duration-200 pointer-events-none
          ${
            value
              ? "-top-2 text-xs text-gray-500"
              : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
          }
          group-focus-within:-top-2 group-focus-within:translate-y-0
          group-focus-within:text-xs group-focus-within:text-brandColor
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder=""
        className="
          w-full h-14 px-4
          rounded-xl border border-gray-200
          bg-white text-gray-900 text-base
          focus:outline-none focus:ring-2 focus:ring-brandColor/30 focus:border-brandColor
          hover:border-gray-300
          disabled:bg-gray-50 disabled:cursor-not-allowed
          transition-all duration-150
        "
      />
    </div>
  );
}

// ── FLOATING TEXTAREA ─────────────────────────────────────────────────────
function FloatingTextarea({
  label,
  name,
  required,
  value,
  onChange,
  disabled,
}) {
  return (
    <div className="relative group">
      <span
        className={`
          absolute left-4 px-1 text-xs z-10
          bg-white transition-all duration-200 pointer-events-none
          ${
            value
              ? "-top-2 text-xs text-gray-500"
              : "top-4 text-sm text-gray-400"
          }
          group-focus-within:-top-2 group-focus-within:translate-y-0
          group-focus-within:text-xs group-focus-within:text-brandColor
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder=""
        rows={5}
        className="
          w-full px-4 pt-5 pb-3
          rounded-xl border border-gray-200
          bg-white text-gray-900 text-base
          focus:outline-none focus:ring-2 focus:ring-brandColor/30 focus:border-brandColor
          hover:border-gray-300
          disabled:bg-gray-50 disabled:cursor-not-allowed
          resize-none
          transition-all duration-150
        "
      />
    </div>
  );
}

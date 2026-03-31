"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Car } from "lucide-react";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Logging in...");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success("Welcome Admin");
        window.location.href = "/admin";
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center mb-4 shadow-lg">
            <Car size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            CabEazy <span className="text-brandColor">Admin</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your dashboard
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-5"
        >
          {/* Email */}
          <FloatingInput
            label="Admin Email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={loading}
          />

          {/* Password */}
          <FloatingInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={loading}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-gray-400 hover:text-gray-600 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-13 py-3.5 rounded-xl
              bg-black text-white font-medium text-sm
              hover:bg-gray-900
              active:scale-[0.98]
              transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-md mt-2
            "
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Logging in...
              </span>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          CabEazy Admin Panel · Restricted Access
        </p>
      </div>
    </div>
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
  suffix,
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
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder=""
        className={`
          w-full h-14 rounded-xl border border-gray-200
          bg-white text-gray-900 text-sm
          focus:outline-none focus:ring-2 focus:ring-brandColor/30 focus:border-brandColor
          hover:border-gray-300
          disabled:bg-gray-50 disabled:cursor-not-allowed
          transition-all duration-150
          ${suffix ? "px-4 pr-11" : "px-4"}
        `}
      />
      {suffix && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {suffix}
        </div>
      )}
    </div>
  );
}

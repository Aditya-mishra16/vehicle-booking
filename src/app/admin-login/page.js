"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const loadingToast = toast.loading("Logging in...");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Welcome Admin");

        // full reload so middleware detects cookie
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-[420px] p-8 rounded-xl shadow-lg border"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          CabEazy Admin Login
        </h2>

        <div className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Admin Email</label>
            <input
              type="email"
              required
              disabled={loading}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              disabled={loading}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor disabled:opacity-60"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-brandColor text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

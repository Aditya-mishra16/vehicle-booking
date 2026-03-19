"use client";

import { useEffect, useState } from "react";

export default function BookingStepper({ step, setStep }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ Define steps differently for desktop vs mobile
  const steps = isDesktop
    ? [
        { id: 2, label: "Vehicle Details", displayId: 1 },
        { id: 3, label: "Review & Confirm", displayId: 2 },
      ]
    : [
        { id: 1, label: "Trip", displayId: 1 },
        { id: 2, label: "Vehicle", displayId: 2 },
        { id: 3, label: "Confirm", displayId: 3 },
      ];

  const handleStepClick = (targetStep) => {
    // ❌ Prevent forward navigation
    if (targetStep > step) return;

    setStep(targetStep);
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center min-w-[220px] md:min-w-[260px]">
        {steps.map((item, index) => {
          const isActive = step >= item.id;
          const isCompleted = step > item.id;
          const isClickable = item.id <= step;

          return (
            <div
              key={item.id}
              className={`flex items-center flex-1 transition ${
                isClickable ? "cursor-pointer" : "opacity-50"
              }`}
              onClick={() => isClickable && handleStepClick(item.id)}
            >
              {/* ✅ Correct numbering */}
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold transition
                ${
                  isActive ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {item.displayId}
              </div>

              {/* ✅ Correct label */}
              <span
                className={`ml-2 text-xs font-medium whitespace-nowrap transition
                ${isActive ? "text-black" : "text-gray-400"}`}
              >
                {item.label}
              </span>

              {/* Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-3 transition
                  ${isCompleted ? "bg-black" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

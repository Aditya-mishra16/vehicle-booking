"use client";

export default function BookingStepper({ step, setStep, selectedVehicle }) {
  const steps = [
    { id: 1, label: "Choose Ride" },
    { id: 2, label: "Review & Confirm" },
  ];

  const handleStepClick = (targetStep) => {
    if (targetStep === 2 && !selectedVehicle) return;
    setStep(targetStep);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((item, index) => {
        const active = step >= item.id;

        return (
          <div
            key={item.id}
            className="flex items-center flex-1 cursor-pointer"
            onClick={() => handleStepClick(item.id)}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
              ${active ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
            >
              {item.id}
            </div>

            <span
              className={`ml-3 text-sm font-medium
              ${active ? "text-black" : "text-gray-400"}`}
            >
              {item.label}
            </span>

            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-4
                ${step > item.id ? "bg-black" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

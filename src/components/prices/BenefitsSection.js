"use client";

export default function BenefitsSection() {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-12 text-center">
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Affordable one-way fares
          </h3>
          <p className="text-gray-600">
            Travel comfortably with transparent pricing.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">24x7 availability</h3>
          <p className="text-gray-600">Book anytime or schedule in advance.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">In-app safety features</h3>
          <p className="text-gray-600">Share trip details and ride safely.</p>
        </div>
      </div>
    </div>
  );
}

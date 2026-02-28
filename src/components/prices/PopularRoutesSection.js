"use client";

export default function PopularRoutesSection() {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-3xl font-bold mb-10">
          Popular nearby intercity routes
        </h2>

        <div className="grid md:grid-cols-2 gap-8 text-lg underline">
          <div className="space-y-4">
            <p>Mumbai to Ahmedabad</p>
            <p>Mumbai to Ahmednagar</p>
            <p>Mumbai to Alibag</p>
          </div>

          <div className="space-y-4">
            <p>Mumbai to Raigad</p>
            <p>Mumbai to Akola</p>
            <p>Mumbai to Amarnath</p>
          </div>
        </div>
      </div>
    </div>
  );
}

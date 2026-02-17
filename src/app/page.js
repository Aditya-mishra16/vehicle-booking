import HeroSection from "@/components/home/HeroSection";
export default function HomePage() {
  return (
    <div>
      <div className="text-center">
      <HeroSection />
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Book Now
        </button>
      </div>
    </div>
  );
}
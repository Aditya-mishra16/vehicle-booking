"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      {/* 404 Number */}
      <h1 className="text-7xl md:text-8xl font-bold text-brandColor mb-4">
        404
      </h1>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        Page not found
      </h2>

      {/* Description */}
      <p className="text-gray-500 max-w-md mb-8">
        The page you're looking for doesn't exist or may have been moved. Please
        check the URL or navigate back.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => router.back()}
          className="
            bg-brandColor text-white px-6 py-3 rounded-lg
            hover:opacity-90 transition
          "
        >
          Go Back
        </button>

        <button
          onClick={() => router.push("/")}
          className="
            border border-gray-300 px-6 py-3 rounded-lg
            hover:bg-gray-100 transition
          "
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

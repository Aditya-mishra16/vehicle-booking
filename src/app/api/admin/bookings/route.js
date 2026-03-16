import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Driver from "@/models/Driver";

export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find()
      .populate({
        path: "driver",
        model: Driver,
        select: "fullName city phone",
      })
      .sort({ createdAt: -1 });

    return Response.json({
      success: true,
      bookings,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

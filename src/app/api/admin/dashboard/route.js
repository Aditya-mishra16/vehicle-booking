import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Driver from "@/models/Driver";
import Vehicle from "@/models/Vehicle";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await connectDB();

    const [
      totalBookings,
      totalVehicles,
      totalDrivers,
      totalContacts,
      unassignedBookings,
      pendingDrivers,
      recentBookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Vehicle.countDocuments(),
      Driver.countDocuments(),
      Contact.countDocuments(),
      Booking.countDocuments({ driver: null }),
      Driver.countDocuments({ status: "pending" }),
      Booking.find().sort({ createdAt: -1 }).limit(5),
    ]);

    return Response.json({
      success: true,
      stats: {
        totalBookings,
        totalVehicles,
        totalDrivers,
        totalContacts,
        unassignedBookings,
        pendingDrivers,
      },
      recentBookings,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return Response.json(
      { success: false, error: "Failed to load dashboard data" },
      { status: 500 },
    );
  }
}

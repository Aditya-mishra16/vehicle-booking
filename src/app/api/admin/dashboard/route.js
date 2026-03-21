import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Driver from "@/models/Driver";
import Vehicle from "@/models/Vehicle";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const fourWeeksAgo = new Date(now);
    fourWeeksAgo.setDate(now.getDate() - 27);
    fourWeeksAgo.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      totalVehicles,
      totalDrivers,
      totalContacts,
      unassignedBookings,
      pendingDrivers,
      approvedDrivers,
      recentBookings,
      bookingsByStatus,
      weeklyRaw,
      monthlyRaw,
    ] = await Promise.all([
      Booking.countDocuments(),
      Vehicle.countDocuments(),
      Driver.countDocuments(),
      Contact.countDocuments(),

      Booking.countDocuments({ driver: null }),

      Driver.countDocuments({ status: "pending" }),
      Driver.countDocuments({ status: "approved" }),

      Booking.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("driver", "fullName"),

      Booking.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Booking.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Booking.aggregate([
        { $match: { createdAt: { $gte: fourWeeksAgo } } },
        {
          $group: {
            _id: { $week: "$createdAt" },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // ── Weekly Trend ─────────────────────
    const weeklyMap = {};
    weeklyRaw.forEach((d) => (weeklyMap[d._id] = d.bookings));

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split("T")[0];

      weeklyTrend.push({
        day: days[d.getDay()],
        bookings: weeklyMap[key] || 0,
      });
    }

    // ── Monthly Trend ─────────────────────
    const monthlyTrend = monthlyRaw.map((d, i) => ({
      day: `Week ${i + 1}`,
      bookings: d.bookings,
    }));

    while (monthlyTrend.length < 4) {
      monthlyTrend.unshift({
        day: `Week ${monthlyTrend.length + 1}`,
        bookings: 0,
      });
    }

    // ── Status Counts ─────────────────────
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      assigned: 0,
      completed: 0,
      cancelled: 0,
    };

    bookingsByStatus.forEach((s) => {
      if (statusCounts.hasOwnProperty(s._id)) {
        statusCounts[s._id] = s.count;
      }
    });

    return Response.json({
      success: true,
      stats: {
        totalBookings,
        totalVehicles,
        totalDrivers,
        totalContacts,

        unassignedBookings,
        pendingDrivers,
        approvedDrivers,

        assignedBookings: statusCounts.assigned,

        pendingBookings: statusCounts.pending,
        confirmedBookings: statusCounts.confirmed,
        completedBookings: statusCounts.completed,
        cancelledBookings: statusCounts.cancelled,

        weeklyTrend,
        monthlyTrend,
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

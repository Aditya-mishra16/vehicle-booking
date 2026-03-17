import { connectDB } from "@/lib/mongodb";
import Driver from "@/models/Driver";

export async function GET() {
  try {
    await connectDB();

    const drivers = await Driver.find().sort({ createdAt: -1 });

    return Response.json({
      success: true,
      drivers,
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to fetch drivers" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { fullName, phone, email, city, vehicle } = body;

    if (!fullName || !phone || !city || !vehicle) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const driver = await Driver.create({
      fullName,
      phone,
      email,
      city,
      vehicle,
    });

    return Response.json({
      success: true,
      driver,
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to create driver" },
      { status: 500 },
    );
  }
}

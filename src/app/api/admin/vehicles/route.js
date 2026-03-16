import { connectDB } from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

export async function GET() {
  try {
    await connectDB();

    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    return Response.json({ vehicles });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, type, seats, pricePerKm } = body;

    await connectDB();

    const vehicle = await Vehicle.create({
      name,
      type,
      seats,
      pricePerKm,
    });

    return Response.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to create vehicle" },
      { status: 500 },
    );
  }
}

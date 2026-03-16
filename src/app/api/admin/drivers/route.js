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

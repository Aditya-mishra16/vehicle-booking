import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await connectDB();

    const contacts = await Contact.find().sort({ createdAt: -1 });

    return Response.json({
      success: true,
      contacts,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

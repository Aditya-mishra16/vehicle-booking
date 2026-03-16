import { connectDB } from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import mongoose from "mongoose";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIX
    const body = await req.json();

    console.log("Updating vehicle:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({
        success: false,
        error: "Invalid vehicle ID",
      });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        name: body.name,
        type: body.type,
        seats: body.seats,
        pricePerKm: body.pricePerKm,
      },
      { returnDocument: "after" }, // ✅ replaces deprecated `new: true`
    );

    if (!updatedVehicle) {
      return Response.json({
        success: false,
        error: "Vehicle not found",
      });
    }

    return Response.json({
      success: true,
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, error: "Update failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ FIX

    console.log("Deleting vehicle:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({
        success: false,
        error: "Invalid vehicle ID",
      });
    }

    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return Response.json({
        success: false,
        error: "Vehicle not found",
      });
    }

    return Response.json({
      success: true,
      message: "Vehicle deleted",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, error: "Delete failed" },
      { status: 500 },
    );
  }
}

import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  name: String,
  type: String,
  seats: Number,
  pricePerKm: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Vehicle ||
  mongoose.model("Vehicle", VehicleSchema);

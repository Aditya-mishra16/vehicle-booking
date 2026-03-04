import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  city: String,
  vehicle: String,

  status: {
    type: String,
    default: "pending", // pending | approved | rejected
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Driver || mongoose.model("Driver", DriverSchema);

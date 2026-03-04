import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  bookingId: String,
  name: String,
  email: String,
  phone: String,
  pickup: String,
  drop: String,
  startDate: Date,
  vehicle: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);

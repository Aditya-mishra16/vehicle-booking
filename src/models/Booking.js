import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    pickup: {
      type: String,
      required: true,
      trim: true,
    },

    drop: {
      type: String,
      required: true,
      trim: true,
    },

    /* ---------- PICKUP ---------- */

    startDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      default: null,
    },

    /* ---------- RETURN (ROUND TRIP) ---------- */

    endDate: {
      type: Date,
      default: null,
    },

    endTime: {
      type: String,
      default: null,
    },

    tripType: {
      type: String,
      enum: ["oneway", "roundtrip"],
      default: "oneway",
    },

    /* ---------- VEHICLE ---------- */

    vehicle: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    /* ---------- DRIVER ---------- */

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* ---------- FIX FOR NEXTJS MODEL CACHING ---------- */

let Booking;

if (mongoose.models.Booking) {
  Booking = mongoose.models.Booking;
} else {
  Booking = mongoose.model("Booking", BookingSchema);
}

export default Booking;

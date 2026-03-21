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

    startDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      default: null,
    },

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

    vehicle: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "assigned", "completed", "cancelled"],
      default: "pending",
    },

    driverAssigned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);

/** @format */

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: false, // Making it optional for backward compatibility
    },
    customerName: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    packageName: {
      type: String,
      required: false,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "packages",
      required: false,
    },
    guideName: {
      type: String,
      required: false,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "guides",
      required: false,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
// Add after the schema definition but before exporting the model
bookingSchema.index({ customerId: 1, bookingDate: -1 }); // For customer booking history
bookingSchema.index({ packageId: 1, status: 1 }); // For agent dashboard
bookingSchema.index({ guideId: 1, bookingDate: -1 }); // For guide assignments
bookingSchema.index({ status: 1 }); // For filtering by status
bookingSchema.index({ bookingDate: -1 }); // For date-based queries
// Compound index for multi-criteria searches
bookingSchema.index({ customerId: 1, status: 1, bookingDate: -1 }); // For upcoming/past bookings

export const bookings = mongoose.model("Bookings", bookingSchema);

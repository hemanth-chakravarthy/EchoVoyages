/** @format */

import mongoose from "mongoose";

const packageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    itinerary: {
      type: String,
    },
    highlights: {
      type: String,
      required: true,
    },
    availableDates: [
      {
        type: Date,
      },
    ],
    maxGroupSize: {
      type: Number,
      required: true,
      min: 1,
    },
    // Single guide field (keeping for backward compatibility)
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      required: false,
    },
    // Multiple guides can be assigned to a package
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guide",
      },
    ],
    AgentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agencies",
      required: true,
    },
    AgentName: {
      type: String,
      required: false,
    },
    reviews: [
      {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "customers" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    image: {
      type: Array,
      required: true,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
// Add strategic indexes for frequently queried fields
packageSchema.index({ location: 1 });
packageSchema.index({ price: 1 });
packageSchema.index({ duration: 1 });
packageSchema.index({ maxGroupSize: 1 });

// Add compound indexes for multi-criteria searches
packageSchema.index({ location: 1, price: 1 });
packageSchema.index({ location: 1, duration: 1 });
packageSchema.index({ price: 1, duration: 1 });

// Add index for sorting operations
packageSchema.index({ price: 1, totalBookings: -1 });
packageSchema.index({ totalBookings: -1 }); // For popularity sorting
export const packages = mongoose.model("packages", packageSchema);

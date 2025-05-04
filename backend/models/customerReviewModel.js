/** @format */

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: false,
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
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "guides",
      required: false,
    },
    guideName: {
      type: String,
      reqired: false,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reports: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
// Add after the schema definition but before exporting the model
reviewSchema.index({ packageId: 1 }); // For package reviews queries
reviewSchema.index({ guideId: 1 }); // For guide reviews queries
reviewSchema.index({ rating: -1 }); // For sorting by rating
reviewSchema.index({ date: -1 }); // For sorting by date
reviewSchema.index({ status: 1 }); // For filtering by status

// Compound indexes for multi-criteria searches
reviewSchema.index({ packageId: 1, rating: -1 }); // For package rating filtering
reviewSchema.index({ guideId: 1, rating: -1 }); // For guide rating filtering

export const reviews = mongoose.model("Review", reviewSchema);

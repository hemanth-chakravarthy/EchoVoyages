import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    customerName:{
      type:String
    },
    packageName:{
      type:String
    },
    AgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "agencies",
      required: false,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "packages",
      required: true,
    },
    requestType: {
      type: String,
      enum: ["customize", "book"],
      required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number,
        required: true
    },
    itinerary: {
        type: String
    },
    availableDates: [
        {
            type: Date
        }
    ],
    maxGroupSize: {
        type: Number,
        required: true,
        min: 1
    },
    
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

export const requests = mongoose.model("Requests", requestSchema);

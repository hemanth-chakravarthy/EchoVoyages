import mongoose from "mongoose";

const customerSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      required: true,
    },
    phno: {
      type: String,
      required: true,
    },
    gmail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "customer",
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        "luxury",
        "adventure",
        "business",
        "family",
        "budget-friendly",
        "other",
      ],
    },
    profilePicture: {
      type: String,
      required: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },
    isverified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const customers = mongoose.model("customers", customerSchema);

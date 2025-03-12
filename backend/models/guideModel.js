import mongoose from "mongoose";

const guideSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: false,
      min: 0,
    },
    languages: {
      type: [String],
      required: false,
    },
    location: {
      type: String,
      required: false,
    },

    phno: {
      type: String,
      required: true,
    },
    gmail: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "guide",
    },
    password: {
      type: String,
      required: true,
    },
    ratings: {
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      numberOfReviews: {
        type: Number,
        default: 0,
      },
    },
    availability: {
      type: Boolean,
      default: false,
    },
    availableDates: [
      {
        startDate: {
          type: Date,
          required: false,
        },
        endDate: {
          type: Date,
          required: false,
        },
      },
    ],
    assignedPackages: [
      {
        packageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "packages",
        },
        price: {
          type: Number,
          required: false,
        },
      },
    ],
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

export const Guide = mongoose.model("Guide", guideSchema);

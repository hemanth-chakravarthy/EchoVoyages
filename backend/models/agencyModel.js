import mongoose from "mongoose";

const agencySchema = mongoose.Schema(
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
      gmail: {
        type: String,
        required: true,
        trim: true,
      },
      phno: {
        type: String,
        required: true,
        trim: true,
      },
      // Add contactInfo field to match existing database schema
      contactInfo: {
        email: {
          type: String,
          trim: true,
          default: function() {
            return this.gmail || '';
          }
        },
        phone: {
          type: String,
          trim: true,
          default: function() {
            return this.phno || '';
          }
        }
      },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      default: "agency",
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
    travelPackages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "packages",
        required: false,
      },
    ],
    packageName: [
      {
        type: String,
      },
    ],
    bookingRequests: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "customers",
          required: false,
        },
        packageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "packages",
          required: false,
        },
        status: {
          type: String,
          enum: ["pending", "confirmed", "canceled"],
          default: "pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    verificationCode: {
      type: String,
      default: "",
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String
    }
  },
  {
    timestamps: true,
  }

);

// Add a pre-save hook to ensure contactInfo is properly set
agencySchema.pre('save', function(next) {
  // If contactInfo doesn't exist or email is not set, initialize it
  if (!this.contactInfo) {
    this.contactInfo = {};
  }

  // Set contactInfo.email to gmail if not already set
  if (!this.contactInfo.email) {
    this.contactInfo.email = this.gmail;
  }

  // Set contactInfo.phone to phno if not already set
  if (!this.contactInfo.phone) {
    this.contactInfo.phone = this.phno;
  }

  next();
});

export const Agency = mongoose.model("agency", agencySchema);

import mongoose from "mongoose";
const packageSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        duration: {
            type: Number,  // Duration in days
            required: true
        },
        location: {
            type: String,
            required: true
        },
        itinerary: {
            type: String
        },
        highlights: {
            type: String,  // Array of highlights or key features of the package
            required: true
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
        guide: {
            type: mongoose.Schema.Types.ObjectId,  // Reference to the guide associated with the package
            ref: 'guides',
            required: false
        },
        AgentID:{
            type: mongoose.Schema.Types.ObjectId,  // Reference to the guide associated with the package
            ref: 'agencies',
            required: true
        },
        AgentName:{
            type: String,
            required: true
        },
        reviews: [
            {
            customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customers' },
            rating: { type: Number, min: 1, max: 5 },
            comment: String,
            date: { type: Date, default: Date.now }
            }
        ],
        image: {
            type: Array,
            required: true
        },
        totalBookings: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export const packages = mongoose.model('packages',packageSchema)

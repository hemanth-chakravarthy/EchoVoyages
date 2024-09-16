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
        itinerary: [
            {
            day: Number,
            details: String
            }
        ],
        highlights: {
            type: [String],  // Array of highlights or key features of the package
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
        // guide: {
        //     type: mongoose.Schema.Types.ObjectId,  // Reference to the guide associated with the package
        //     ref: 'Guides'
        // },
        // agent: {
        //     type: mongoose.Schema.Types.ObjectId,  // Reference to the agent creating or managing the package
        //     ref: 'Agents',
        //     required: true
        // },
        reviews: [
            {
            customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customers' },
            rating: { type: Number, min: 1, max: 5 },
            comment: String,
            date: { type: Date, default: Date.now }
            }
        ],
        totalBookings: {
            type: Number,
            default: 0
        },
        images: [
            {
            url: String,
            description: String
            }
        ],
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

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
            type: Number,
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
            type: String,
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'guides',
            required: false
        },
        AgentID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'agencies',
            required: true
        },
        AgentName: {
            type: String,
            required: false
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
            type: String,
            enum: ['pending', 'confirmed', 'canceled'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

export const packages = mongoose.model('packages', packageSchema);

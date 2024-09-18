import mongoose from 'mongoose';

const guideSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: Number,
        required: true,  // Years of experience
        min: 0
    },
    languages: {
        type: [String],  // List of languages the guide speaks
        required: true
    },
    location: {
        type: String,
        required: true
    },
    contact: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    ratings: {
        averageRating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        numberOfReviews: {
            type: Number,
            default: 0
        }
    },
    availability: {
        type: Boolean,
        default: true  // Whether the guide is available or not
    },
    assignedPackages: [{
        packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'packages'  // References the 'Package' model
        },
        price: {
            type: Number,  // Price for the specific package
            required: true
        }
    }]
}, {
    timestamps: true
});

export const Guide = mongoose.model('Guide', guideSchema);

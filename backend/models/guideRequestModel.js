import mongoose from 'mongoose';

const guideRequestSchema = new mongoose.Schema({
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide',
        required: true
    },
    guideName: {
        type: String,
        required: false
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'packages',
        required: false
    },
    packageName: {
        type: String,
        required: false
    },
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agencies',
        required: true
    },
    agencyName: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    // Who initiated the request
    initiator: {
        type: String,
        enum: ['guide', 'agency'],
        required: true
    },
    // Request type
    type: {
        type: String,
        enum: ['package_assignment', 'general_collaboration'],
        default: 'package_assignment'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create a compound index to prevent duplicate requests
// For package assignments
guideRequestSchema.index(
    {
        guideId: 1,
        packageId: 1,
        type: 1,
        status: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            packageId: { $exists: true },
            type: 'package_assignment',
            status: 'pending'
        }
    }
);

// For general collaboration
guideRequestSchema.index(
    {
        guideId: 1,
        agencyId: 1,
        type: 1,
        status: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            type: 'general_collaboration',
            status: 'pending'
        }
    }
);

export const GuideRequest = mongoose.model('GuideRequest', guideRequestSchema);

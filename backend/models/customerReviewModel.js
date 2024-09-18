import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    customerName: {
        type: String,  // Store the name of the customer
        required: true
    },
    packageName: {
        type: String,  // Store the name of the package
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
});

export const reviews = mongoose.model('Review', reviewSchema);

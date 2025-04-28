import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        unique: true,
        required: false // Making it optional for backward compatibility
    },
    customerName: {
        type: String,
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    packageName: {
        type: String,
        required: false
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'packages',
        required: false
    },
    guideName: {
        type: String,
        required: false
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'guides',
        required: false
    },
    totalPrice: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export const bookings = mongoose.model('Bookings', bookingSchema);

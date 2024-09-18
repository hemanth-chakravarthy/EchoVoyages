import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',  // Reference to the customer
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'packages',  // Reference to the package
        required: true
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'guides',  // Optional reference to the guide
        required: false
    },
    bookingDate: {
        type: Date,
        default: Date.now,  // Automatically set booking date
        required: true
    },
    totalPrice: {
        type: Number,
        required: true  // Store the total price of the booking
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

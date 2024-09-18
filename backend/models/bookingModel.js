import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customerName: {
        type: String,  // Store the name of the customer
        required: true
    },
    packageName: {
        type: String,  // Store the name of the package
        required: true
    },
    guideName: {
        type: String,  // Optional: Store the name of the guide
        required: false
    },
    totalPrice: {
        type: Number,  // Store the total price of the booking
        required: true
    },
    bookingDate: {
        type: Date,  // Automatically set booking date
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

import mongoose from 'mongoose';

const financialSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',  // Reference to the booking related to the financial record
        required: true
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide',  // Reference to the guide involved in the booking
        required: false
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',  // Reference to the agent if involved
        required: false
    },
    commission: {
        type: Number,  // Percentage commission on the booking
        required: true
    },
    totalAmount: {
        type: Number,  // Total amount of the booking
        required: true
    },
    payoutAmount: {
        type: Number,  // Amount to be paid out to the guide/agent
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],  // Status of the payout
        default: 'pending'
    },
    payoutDate: {
        type: Date,  // When the payout was made
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

export const Financials = mongoose.model('Financial', financialSchema);

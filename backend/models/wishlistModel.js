// models/wishlistModel.js
import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    packages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Package',
            required: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export { Wishlist };

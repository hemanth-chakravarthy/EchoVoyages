// models/wishlistModel.js
import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer' // Adjust this if your customer model is named differently
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'packages' // Adjust this if your package model is named differently
    }
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;

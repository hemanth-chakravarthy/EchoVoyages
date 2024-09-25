import mongoose from "mongoose";

const wishListGuideSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'customers' // Adjust this if your customer model is named differently
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Guide' // Adjust this if your package model is named differently
    }
}, {timestamps: true})

export const wishlistGuide = mongoose.model('wishlistGuide',wishListGuideSchema)
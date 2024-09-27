import mongoose from "mongoose";

const wishListGuideSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'customers'
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Guide' 
    }
}, {timestamps: true})

export const wishlistGuide = mongoose.model('wishlistGuide',wishListGuideSchema)
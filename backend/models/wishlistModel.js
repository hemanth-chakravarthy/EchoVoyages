// models/wishlistModel.js
import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'customers' 
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'packages' 
    }
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;

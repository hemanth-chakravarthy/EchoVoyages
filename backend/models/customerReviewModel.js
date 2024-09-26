import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    customerName: {
        type: String,  // Store the name of the customer
        required: false
    },
    packageName: {
        type: String,  // Store the name of the package
        required: false
    },
    packageId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'packages',  // Reference to the package model
        required: false
    },
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',  // Reference to the customer model
        required:true
    },
    guideId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'guides',
        required: false
    },
    guideName:{
        type: String,
        reqired: false
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
    },
    reports:{
        type: Number,
        default: 0
    }
}, {timestamps: true} );

export const reviews = mongoose.model('Review', reviewSchema);

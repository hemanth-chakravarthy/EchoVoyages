import mongoose from "mongoose";

const agencySchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        contactInfo: {
            email: {
                type: String,
                required: true,
                unique: true,
                trim: true
            },
            phone: {
                type: String,
                required: true,
                trim: true
            }
        },
        password : {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            required: false,
            trim: true
        },
        specialization: {
            type: String, // e.g., luxury, adventure
            required: false,
            enum: ['luxury', 'adventure', 'business', 'family', 'other']
        },
        travelPackages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'packages', 
                required: false
            }
        ],
        packageName:[
            {
                type:String
            }
        ],
        bookingRequests: [
            {
                customerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'customers', 
                    required: false
                },
                packageId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'packages', 
                    required: false
                },
                status: {
                    type: String,
                    enum: ['pending', 'confirmed', 'canceled'],
                    default: 'pending'
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        
    },
    {
        timestamps: true
    }
);

export const Agency = mongoose.model('agency', agencySchema);

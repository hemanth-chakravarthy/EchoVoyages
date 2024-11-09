import mongoose from "mongoose";

const customerSchema = mongoose.Schema(
    {
        username : {
            type: String,
            required: true,
            unique: true
        },
        Name : {
            type: String,
            required: true,
        },
        phno :{
            type: String,
            required: true
        },
        gmail : {
            type: String,
            required: true,
            unique: true
        },
        password : {
            type: String,
            required: true,
        },
        role :{
            type: String,
            default: 'custome'
        },
        specialization: {
            type: String, // e.g., luxury, adventure
            required: false,
            enum: ['luxury', 'adventure', 'business', 'family', 'other']
        }
    },
    {
        timestamps: true
    }
)

export const customers = mongoose.model('customers',customerSchema);
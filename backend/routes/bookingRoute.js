import express from 'express'
import { bookings } from '../models/bookingModel.js';
import { packages } from '../models/packageModel.js';
import { customers } from '../models/customerModel.js';

import {Guide} from '../models/guideModel.js'
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { customerId, packageId, guideId } = req.body;

        // Fetch the package details including price
        const packageData = await packages.findById(packageId);
        if (!packageData) {
            return res.status(404).send({ message: 'Package not found' });
        }
        const customerData = await customers.findById(customerId)
        if(!customerData){
            return res.status(404).send({ message: 'Customer not found' });
        }
        

        // Get the total price from the package
        const totalPrice = packageData.price;
        const packageName = packageData.name;
        const customerName = customerData.username;
        


        // Create the booking
        const newBooking = new bookings({
            customerName,
            customerId,
            packageId,
            packageName,
            totalPrice,
            status: 'confirmed'
        });

        // Save the booking to the database
        const savedBooking = await newBooking.save();
        res.status(201).send(savedBooking);

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error creating booking' });
    }
});
// get all bookings
router.get('/',async (req,res) => {
    try {
        const book = await bookings.find({});
        return res.status(200).json({
            count: book.length,
            data: book
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})

// delete a booking
router.delete('/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const result = await bookings.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" Bokking not found"})
        }
        return res.status(200).json({message:" Booking deleted"})


    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// update booking
router.put('/:id',async (req,res) => {
    try {
        const {id} = req.params;
        const result = await bookings.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message:" Booking not found"})
        }
        return res.status(200).json({message:" Booking updated"})

    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// view a single booking
router.get('/:id',async (req,res) => {
    try {
        let {id} = req.params
        id = id.toString()
        const book = await bookings.findOne({ _id: id });
        return res.status(200).json(book)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})

export default router


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
        const guideData = await Guide.findById(guideId)
        if(!guideData){
            return res.status(404).send({ message: 'Guide not found' });
        }

        // Get the total price from the package
        const totalPrice = packageData.price;
        const packageName = packageData.name;
        const customerName = customerData.username;
        const guideName = guideData.name

        // Create the booking
        const newBooking = new bookings({
            customerName,
            packageName,
            guideName,
            totalPrice
        });

        // Save the booking to the database
        const savedBooking = await newBooking.save();
        res.status(201).send(savedBooking);

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error creating booking' });
    }
});

export default router


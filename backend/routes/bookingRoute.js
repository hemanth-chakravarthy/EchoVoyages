import express from 'express'
import { bookings } from '../models/bookingModel.js';
import { packages } from '../models/packageModel.js';
import { customers } from '../models/customerModel.js';
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { customerId, packageId, guideId } = req.body;

        // Fetch the package details including price
        const packageData = await packages.findById(packageId);
        if (!packageData) {
            return res.status(404).send({ message: 'Package not found' });
        }

        // Get the total price from the package
        const totalPrice = packageData.price;

        // Create the booking
        const newBooking = new bookings({
            customerId,
            packageId,
            guideId,
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


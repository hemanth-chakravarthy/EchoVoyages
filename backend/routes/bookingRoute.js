import express from 'express'
import { bookings } from '../models/bookingModel.js';
import { packages } from '../models/packageModel.js';
import { customers } from '../models/customerModel.js';
import {Guide} from '../models/guideModel.js'

const router = express.Router();

// Function to generate a custom booking ID
const generateBookingId = (customerName) => {
    // Get the first 3 letters of the customer name (uppercase)
    const namePrefix = customerName.substring(0, 3).toUpperCase();

    // Generate a random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    // Get current date in YYMMDD format
    const date = new Date();
    const dateStr = date.getFullYear().toString().substr(-2) +
                   (date.getMonth() + 1).toString().padStart(2, '0') +
                   date.getDate().toString().padStart(2, '0');

    // Combine to create the booking ID: XXX-1234-YYMMDD
    return `${namePrefix}-${randomNum}-${dateStr}`;
};


router.post('/', async (req, res,next) => {
    console.log('Booking request received:', req.body);
    try {
        const { customerId, packageId, guideId } = req.body;

        // Validate required fields
        if (!customerId) {
            return res.status(400).send({ message: 'Customer ID is required' });
        }

        let totalPrice = 0;
        let packageName = null;
        let customerName = null;
        let guideData = null;

        // Fetch customer details
        const customerData = await customers.findById(customerId);
        if (!customerData) {
            return res.status(404).send({ message: 'Customer not found' });
        }
        customerName = customerData.username;

        // Fetch package details if packageId is provided
        if (packageId) {
            const packageData = await packages.findById(packageId);
            if (!packageData) {
                return res.status(404).send({ message: 'Package not found' });
            }
            packageName = packageData.name; // Set the packageName if found
            totalPrice = packageData.price; // You may want to set totalPrice from packageData
        }

        // Fetch guide details if guideId is provided
        if (guideId) {
            guideData = await Guide.findById(guideId);
            if (!guideData) {
                return res.status(404).send({ message: 'Guide not found' });
            }
        }

        // Generate a unique custom booking ID
        let bookingId;
        let isUnique = false;

        // Keep generating IDs until we find a unique one
        while (!isUnique) {
            bookingId = generateBookingId(customerName);
            // Check if this ID already exists in the database
            const existingBooking = await bookings.findOne({ bookingId });
            if (!existingBooking) {
                isUnique = true;
            }
        }

        // Create the booking
        const newBooking = new bookings({
            bookingId,
            customerName,
            customerId,
            packageId: packageId || null, // Only include package if provided
            packageName,
            guideId: guideId || null, // Only include guideId if provided
            guideName: guideData ? guideData.name : undefined,  // Store guide's name if available
            totalPrice,
            status: 'pending',
        });

        // Save the booking to the database
        const savedBooking = await newBooking.save();
        return res.status(201).send(savedBooking);

    } catch (error) {
        console.log(error);
        next(error);
        return res.status(500).send({ message: 'Error creating booking' });
    }
});

// get all bookings
router.get('/',async (req,res,next) => {
    try {
        const book = await bookings.find({});
        return res.status(200).json({
            count: book.length,
            data: book
        })
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
})
router.get('/cust/:customerId', async (req, res,next) => {
    const { customerId } = req.params; // Extract customerId from the URL

    if (!customerId) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }
    try {
        // Find bookings associated with the specific customerId
        const booking = await bookings.find({ customerId });

        // If no bookings are found
        if (booking.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this customer' });
        }

        // Send the found bookings as a response
        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        next(error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});
router.get('/pack/:packageId', async (req, res,next) => {
    const { packageId } = req.params; // Extract customerId from the URL

    if (!packageId) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
        // Find bookings associated with the specific customerId
        const booking = await bookings.find({ packageId });

        // If no bookings are found
        if (booking.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this package' });
        }

        // Send the found bookings as a response
        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        next(error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});
router.get('/guides/:guideId',async (req, res,next) => {
    const { guideId } = req.params; // Extract customerId from the URL

    if (!guideId) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
        // Find bookings associated with the specific customerId
        const booking = await bookings.find({ guideId });

        // If no bookings are found
        if (booking.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this guide!' });
        }

        // Send the found bookings as a response
        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        next(error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }

})

// delete a booking
router.delete('/:id', async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await bookings.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" Bokking not found"})
        }
        return res.status(200).json({message:" Booking deleted"})


    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
// update booking
router.put('/:id',async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await bookings.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message:" Booking not found"})
        }
        return res.status(200).json({message:" Booking updated"})

    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
// view a single booking
router.get('/:id',async (req,res,next) => {
    try {
        let {id} = req.params
        id = id.toString()
        const book = await bookings.findOne({ _id: id });
        return res.status(200).json(book)
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
router.get('/verifyBooking', async (req, res,next) => {
    const { customerId, packageId } = req.query;

    try {
      const booking = await Booking.findOne({ customerId, packageId });
      res.status(200).json({ hasBooking: !!booking });
    } catch (error) {
        next(error);
      res.status(500).json({ message: 'Error verifying booking', error });
    }
  });

export default router


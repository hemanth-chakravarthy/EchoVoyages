import express from 'express'
import { bookings } from '../models/bookingModel.js';
import { packages } from '../models/packageModel.js';
import { customers } from '../models/customerModel.js';
import {Guide} from '../models/guideModel.js'

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - customerName
 *         - customerId
 *         - totalPrice
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the booking
 *         bookingId:
 *           type: string
 *           description: Custom generated booking ID (format XXX-1234-YYMMDD)
 *         customerName:
 *           type: string
 *           description: Name of the customer who made the booking
 *         customerId:
 *           type: string
 *           description: ID of the customer who made the booking
 *         packageName:
 *           type: string
 *           description: Name of the booked package
 *         packageId:
 *           type: string
 *           description: ID of the booked package
 *         guideName:
 *           type: string
 *           description: Name of the assigned guide
 *         guideId:
 *           type: string
 *           description: ID of the assigned guide
 *         totalPrice:
 *           type: number
 *           description: Total price of the booking
 *         bookingDate:
 *           type: string
 *           format: date-time
 *           description: Date when the booking was made
 *         status:
 *           type: string
 *           enum: [pending, confirmed, canceled]
 *           description: Status of the booking
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the booking was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the booking was last updated
 *       example:
 *         _id: "60d21b4667d0d8992e610c90"
 *         bookingId: "JOH-1234-230515"
 *         customerName: "John Doe"
 *         customerId: "60d21b4667d0d8992e610c91"
 *         packageName: "Adventure in the Alps"
 *         packageId: "60d21b4667d0d8992e610c92"
 *         guideName: "Jane Smith"
 *         guideId: "60d21b4667d0d8992e610c93"
 *         totalPrice: 1200
 *         bookingDate: "2023-05-15T10:30:00Z"
 *         status: "confirmed"
 */

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


/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     description: Create a new booking for a customer, optionally with a package and guide
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID of the customer making the booking
 *               packageId:
 *                 type: string
 *                 description: ID of the package being booked (optional)
 *               guideId:
 *                 type: string
 *                 description: ID of the guide for the booking (optional)
 *               totalPrice:
 *                 type: number
 *                 description: Total price of the booking (optional, will be set from package if provided)
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Customer, package, or guide not found
 *       500:
 *         description: Internal server error
 */
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

        // If the booking has both a package and a guide, attach the guide to the package
        if (packageId && guideId) {
            try {
                const packageData = await packages.findById(packageId);
                if (packageData) {
                    // Check if guide is already in the guides array
                    const guideExists = packageData.guides.some(
                        g => g.toString() === guideId.toString()
                    );

                    if (!guideExists) {
                        // Add guide to the package's guides array
                        packageData.guides.push(guideId);
                        await packageData.save();
                        console.log(`Attached guide ${guideId} to package ${packageId}`);
                    }

                    // Check if package is already in guide's assignedPackages
                    const packageExists = guideData.assignedPackages.some(
                        pkg => pkg.packageId.toString() === packageId.toString()
                    );

                    if (!packageExists) {
                        // Add package to guide's assignedPackages
                        guideData.assignedPackages.push({
                            packageId: packageId,
                            packageName: packageName,
                            price: totalPrice,
                            status: savedBooking.status === 'confirmed' ? 'confirmed' : 'pending'
                        });
                        await guideData.save();
                        console.log(`Added package ${packageId} to guide's assigned packages`);
                    }
                }
            } catch (error) {
                console.error('Error attaching guide to package:', error);
                // Continue with the response even if attachment fails
            }
        }

        return res.status(201).send(savedBooking);

    } catch (error) {
        console.log(error);
        next(error);
        return res.status(500).send({ message: 'Error creating booking' });
    }
});

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     description: Retrieve a list of all bookings
 *     responses:
 *       200:
 *         description: A list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of bookings returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /bookings/cust/{customerId}:
 *   get:
 *     summary: Get bookings by customer ID
 *     tags: [Bookings]
 *     description: Retrieve all bookings for a specific customer
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         description: ID of the customer to get bookings for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bookings for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Customer ID is required
 *       404:
 *         description: No bookings found for this customer
 *       500:
 *         description: Server error
 */
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
        const { status } = req.body;

        // Find the booking before updating
        const booking = await bookings.findById(id);
        if(!booking){
            return res.status(404).json({message:"Booking not found"})
        }

        // Update the booking
        const result = await bookings.findByIdAndUpdate(id, req.body, { new: true });

        // If status is being changed to confirmed and there's a guide, update guide earnings and attach guide to package
        if (status === 'confirmed' && booking.status !== 'confirmed' && booking.guideId) {
            try {
                // Import the Guide model and Package model
                const { Guide } = await import('../models/guideModel.js');
                const { packages } = await import('../models/packageModel.js');

                // Calculate guide's share (70% of package price)
                const guideShare = booking.totalPrice * 0.7;

                // Get current date info for monthly tracking
                const now = new Date();
                const month = now.getMonth() + 1; // JavaScript months are 0-indexed
                const year = now.getFullYear();

                // Update guide's earnings
                const guide = await Guide.findById(booking.guideId);
                if (guide) {
                    // Add to total and pending earnings
                    guide.earnings.total += guideShare;
                    guide.earnings.pending += guideShare;

                    // Add to earnings history
                    guide.earnings.history.push({
                        bookingId: booking._id,
                        packageId: booking.packageId,
                        packageName: booking.packageName,
                        customerName: booking.customerName,
                        amount: guideShare,
                        date: now,
                        status: 'pending'
                    });

                    // Check if entry for this month exists
                    const monthlyEntryIndex = guide.earnings.monthly.findIndex(
                        entry => entry.month === month && entry.year === year
                    );

                    if (monthlyEntryIndex !== -1) {
                        // Update existing monthly entry
                        guide.earnings.monthly[monthlyEntryIndex].amount += guideShare;
                    } else {
                        // Create new monthly entry
                        guide.earnings.monthly.push({
                            month,
                            year,
                            amount: guideShare
                        });
                    }

                    // Save the updated guide
                    await guide.save();
                    console.log(`Updated guide earnings for booking ${id}`);

                    // If there's a package, attach the guide to the package
                    if (booking.packageId) {
                        const packageData = await packages.findById(booking.packageId);
                        if (packageData) {
                            // Check if guide is already in the guides array
                            const guideExists = packageData.guides.some(
                                g => g.toString() === booking.guideId.toString()
                            );

                            if (!guideExists) {
                                // Add guide to the package's guides array
                                packageData.guides.push(booking.guideId);
                                await packageData.save();
                                console.log(`Attached guide ${booking.guideId} to package ${booking.packageId}`);
                            }

                            // Check if package is already in guide's assignedPackages
                            const packageExists = guide.assignedPackages.some(
                                pkg => pkg.packageId.toString() === booking.packageId.toString()
                            );

                            if (!packageExists) {
                                // Add package to guide's assignedPackages
                                guide.assignedPackages.push({
                                    packageId: booking.packageId,
                                    packageName: booking.packageName,
                                    price: booking.totalPrice,
                                    status: 'confirmed'
                                });
                                await guide.save();
                                console.log(`Added package ${booking.packageId} to guide's assigned packages`);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error updating guide earnings or attaching guide to package:', error);
                // Continue with the response even if earnings update fails
            }
        }

        return res.status(200).json({
            message: "Booking updated successfully",
            booking: result
        });

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
/**
 * @swagger
 * /bookings/verifyBooking:
 *   get:
 *     summary: Verify if a booking exists
 *     tags: [Bookings]
 *     description: Check if a booking exists for a specific customer and package
 *     parameters:
 *       - in: query
 *         name: customerId
 *         required: true
 *         description: ID of the customer
 *         schema:
 *           type: string
 *       - in: query
 *         name: packageId
 *         required: true
 *         description: ID of the package
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasBooking:
 *                   type: boolean
 *                   description: Whether a booking exists for the customer and package
 *       500:
 *         description: Server error
 */
router.get('/verifyBooking', async (req, res,next) => {
    const { customerId, packageId } = req.query;

    try {
      const booking = await bookings.findOne({ customerId, packageId });
      res.status(200).json({ hasBooking: !!booking });
    } catch (error) {
        next(error);
      res.status(500).json({ message: 'Error verifying booking', error });
    }
  });

export default router


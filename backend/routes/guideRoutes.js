import express from 'express';
import { Guide } from '../models/guideModel.js';  // Import the Guide model
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Guide:
 *       type: object
 *       required:
 *         - username
 *         - name
 *         - phno
 *         - gmail
 *         - password
 *         - specialization
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the guide
 *         username:
 *           type: string
 *           description: Username of the guide
 *         name:
 *           type: string
 *           description: Full name of the guide
 *         experience:
 *           type: number
 *           description: Years of experience
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           description: Languages spoken by the guide
 *         location:
 *           type: string
 *           description: Location of the guide
 *         phno:
 *           type: string
 *           description: Phone number of the guide
 *         gmail:
 *           type: string
 *           description: Email address of the guide
 *         role:
 *           type: string
 *           default: guide
 *           description: Role of the user
 *         password:
 *           type: string
 *           description: Hashed password of the guide
 *         profilePicture:
 *           type: string
 *           description: Path to the guide's profile picture
 *         ratings:
 *           type: object
 *           properties:
 *             averageRating:
 *               type: number
 *               description: Average rating of the guide
 *             numberOfReviews:
 *               type: number
 *               description: Number of reviews for the guide
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *                 description: ID of the customer who left the review
 *               rating:
 *                 type: number
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 description: Review comment
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date when the review was submitted
 *         availability:
 *           type: boolean
 *           description: Whether the guide is available
 *         availableDates:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of availability
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of availability
 *         assignedPackages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               packageId:
 *                 type: string
 *                 description: ID of the assigned package
 *               packageName:
 *                 type: string
 *                 description: Name of the assigned package
 *               price:
 *                 type: number
 *                 description: Price of the package
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the assignment
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the assignment
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, canceled]
 *                 description: Status of the assignment
 *         specialization:
 *           type: string
 *           enum: [luxury, adventure, business, family, budget-friendly, other]
 *           description: Specialization of the guide
 *         earnings:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *               description: Total earnings of the guide
 *             pending:
 *               type: number
 *               description: Pending earnings of the guide
 *             received:
 *               type: number
 *               description: Received earnings of the guide
 *             monthly:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: number
 *                     description: Month number (1-12)
 *                   year:
 *                     type: number
 *                     description: Year
 *                   amount:
 *                     type: number
 *                     description: Amount earned in that month
 *             history:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bookingId:
 *                     type: string
 *                     description: ID of the booking
 *                   packageId:
 *                     type: string
 *                     description: ID of the package
 *                   packageName:
 *                     type: string
 *                     description: Name of the package
 *                   customerName:
 *                     type: string
 *                     description: Name of the customer
 *                   amount:
 *                     type: number
 *                     description: Amount earned from this booking
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Date of the earning
 *                   status:
 *                     type: string
 *                     enum: [pending, paid]
 *                     description: Payment status
 *       example:
 *         _id: "60d21b4667d0d8992e610c93"
 *         username: "janesmith"
 *         name: "Jane Smith"
 *         experience: 5
 *         languages: ["English", "French", "Spanish"]
 *         location: "Paris, France"
 *         phno: "+33123456789"
 *         gmail: "jane.smith@example.com"
 *         role: "guide"
 *         profilePicture: "/public/guideProfiles/profile-1624276806-123456.jpg"
 *         ratings:
 *           averageRating: 4.8
 *           numberOfReviews: 25
 *         availability: true
 *         specialization: "luxury"
 */

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "public/guideProfiles";

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            "profile-" + uniqueSuffix + path.extname(file.originalname)
        );
    },
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Not an image! Please upload only images."), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

/**
 * @swagger
 * /guides:
 *   post:
 *     summary: Create a new guide
 *     tags: [Guides]
 *     description: Create a new guide with basic information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - experience
 *               - languages
 *               - location
 *               - contact
 *               - availableDates
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the guide
 *               experience:
 *                 type: number
 *                 description: Years of experience
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Languages spoken by the guide
 *               location:
 *                 type: string
 *                 description: Location of the guide
 *               contact:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     description: Phone number of the guide
 *                   email:
 *                     type: string
 *                     description: Email address of the guide
 *               availability:
 *                 type: boolean
 *                 description: Whether the guide is available
 *               availableDates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       description: Start date of availability
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       description: End date of availability
 *     responses:
 *       201:
 *         description: Guide created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res, next) => {
    try {
        const { name, experience, languages, location, contact, availability, availableDates } = req.body;

        // Validate required fields
        if (!name || !experience || !languages || !location || !contact || !contact.phone || !contact.email || !availableDates) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new guide instance
        const newGuide = new Guide({
            name,
            experience,
            languages,
            location,
            contact,
            availability,
            availableDates
        });

        // Save the guide to the database
        const savedGuide = await Guide.create(newGuide);
        return res.status(201).send(savedGuide)
    } catch (error) {
        console.error(error);
        next(error);
        res.status(500).json({ message: 'An error occurred while saving the guide' });
    }
});

/**
 * @swagger
 * /guides:
 *   get:
 *     summary: Get all guides
 *     tags: [Guides]
 *     description: Retrieve a list of all guides
 *     responses:
 *       200:
 *         description: A list of guides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of guides returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Guide'
 *       500:
 *         description: Server error
 */
router.get('/',async (req,res, next) => {
    try {
        const guides = await Guide.find({});
        return res.status(200).json({
            count: guides.length,
            data: guides
        })
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
})
/**
 * @swagger
 * /guides/{id}:
 *   put:
 *     summary: Update a guide
 *     tags: [Guides]
 *     description: Update a specific guide by ID, with support for profile picture upload
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guide to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the guide
 *               experience:
 *                 type: number
 *                 description: Years of experience
 *               languages:
 *                 type: string
 *                 format: json
 *                 description: JSON string of languages spoken by the guide
 *               location:
 *                 type: string
 *                 description: Location of the guide
 *               contact:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     description: Phone number of the guide
 *                   email:
 *                     type: string
 *                     description: Email address of the guide
 *               availability:
 *                 type: boolean
 *                 description: Whether the guide is available
 *               specializations:
 *                 type: string
 *                 description: Specializations of the guide
 *               pricing:
 *                 type: string
 *                 format: json
 *                 description: JSON string of pricing information
 *               bio:
 *                 type: string
 *                 description: Biography of the guide
 *               availableDates:
 *                 type: string
 *                 format: json
 *                 description: JSON string of available dates
 *               ratings:
 *                 type: string
 *                 format: json
 *                 description: JSON string of ratings information
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file
 *     responses:
 *       200:
 *         description: Guide updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.put('/:id', upload.single('profilePicture'), async (req, res, next) => {
    try {
        const {
            name,
            experience,
            languages: languagesStr,
            location,
            contact,
            availability,
            specializations,
            pricing,
            bio,
            availableDates: availableDatesStr,
            ratings: ratingsStr // Add the ratings object here
        } = req.body;

        // Parse JSON strings to objects/arrays
        let languages = languagesStr;
        try {
            if (typeof languagesStr === 'string') {
                languages = JSON.parse(languagesStr);
            }
        } catch (e) {
            console.error('Error parsing languages:', e);
        }

        let availableDates = [];
        try {
            if (typeof availableDatesStr === 'string') {
                availableDates = JSON.parse(availableDatesStr);
            }
        } catch (e) {
            console.error('Error parsing availableDates:', e);
        }

        let ratings = null;
        try {
            if (typeof ratingsStr === 'string') {
                ratings = JSON.parse(ratingsStr);
            } else {
                ratings = ratingsStr;
            }
        } catch (e) {
            console.error('Error parsing ratings:', e);
        }

        // Create update object
        const updateData = {
            name,
            experience,
            languages,
            location,
            contact,
            availability: true,
            specializations,
            pricing,
            bio
        };

        // Only include availableDates if it's a valid array
        if (Array.isArray(availableDates)) {
            updateData.availableDates = availableDates;
        }

        // If ratings are provided, update them
        if (ratings) {
            updateData['ratings.averageRating'] = ratings.averageRating;
            updateData['ratings.numberOfReviews'] = ratings.numberOfReviews;
        }

        // If a file was uploaded, add the path to the update data
        if (req.file) {
            // Use forward slashes for path consistency across platforms
            updateData.profilePicture = req.file.path.replace(/\\/g, '/');
            console.log('Profile picture uploaded:', updateData.profilePicture);
        }

        // Update guide fields
        const guide = await Guide.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!guide) {
            return res.status(404).send({ message: "Guide not found" });
        }

        return res.status(200).send(guide);
    } catch (error) {
        console.log(error);
        next(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


/**
 * @swagger
 * /guides/{id}:
 *   get:
 *     summary: Get a guide by ID
 *     tags: [Guides]
 *     description: Retrieve a specific guide by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guide to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guide details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res, next) => {
    try {
        const guide = await Guide.findById(req.params.id)
        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }
        return res.status(200).json(guide);
    } catch (error) {
        console.error("Error updating guide:", error);
        // Only call next(error) and don't try to send a response directly
        return next(error);
    }
});

/**
 * @swagger
 * /guides/{id}:
 *   delete:
 *     summary: Delete a guide
 *     tags: [Guides]
 *     description: Delete a specific guide by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guide to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guide deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guide deleted successfully
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const guide = await Guide.findByIdAndDelete(req.params.id);
        if (!guide) {
            return res.status(404).send({ message: "Guide not found" });
        }
        return res.status(200).send({ message: "Guide deleted successfully" });
    } catch (error) {
        console.log(error);
        next(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /guides/{id}/assigned-packages:
 *   get:
 *     summary: Get assigned packages for a guide
 *     tags: [Guides]
 *     description: Retrieve all packages assigned to a specific guide
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guide to get assigned packages for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of assigned packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of assigned packages
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the package
 *                       name:
 *                         type: string
 *                         description: Name of the package
 *                       description:
 *                         type: string
 *                         description: Description of the package
 *                       price:
 *                         type: number
 *                         description: Price of the package
 *                       duration:
 *                         type: number
 *                         description: Duration of the package in days
 *                       location:
 *                         type: string
 *                         description: Location of the package
 *                       image:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Images of the package
 *                       status:
 *                         type: string
 *                         description: Status of the assignment
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                         description: Start date of the assignment
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                         description: End date of the assignment
 *                       avgRating:
 *                         type: number
 *                         description: Average rating of the package
 *                       reviewCount:
 *                         type: integer
 *                         description: Number of reviews for the package
 *                       bookingCount:
 *                         type: integer
 *                         description: Number of bookings for the package
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.get('/:id/assigned-packages', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the guide and populate the assignedPackages field
        const guide = await Guide.findById(id)
            .populate({
                path: 'assignedPackages.packageId',
                select: 'name description price duration location image reviews'
            });

        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        // Extract and return the assigned packages
        const assignedPackages = guide.assignedPackages || [];

        // Process the packages to include additional information
        const processedPackages = assignedPackages.map(pkg => {
            // Get the package details
            const packageDetails = pkg.packageId;

            // If packageId is not populated (e.g., package was deleted), skip this entry
            if (!packageDetails) {
                return null;
            }

            // Calculate average rating from reviews
            let avgRating = 0;
            let reviewCount = 0;

            if (packageDetails.reviews && packageDetails.reviews.length > 0) {
                const totalRating = packageDetails.reviews.reduce((sum, review) => sum + review.rating, 0);
                avgRating = totalRating / packageDetails.reviews.length;
                reviewCount = packageDetails.reviews.length;
            }

            // Return processed package data
            return {
                _id: packageDetails._id,
                name: packageDetails.name,
                description: packageDetails.description,
                price: packageDetails.price,
                duration: packageDetails.duration,
                location: packageDetails.location,
                image: packageDetails.image,
                status: pkg.status,
                startDate: pkg.startDate,
                endDate: pkg.endDate,
                avgRating,
                reviewCount,
                bookingCount: 0 // This would need to be calculated from bookings if needed
            };
        }).filter(pkg => pkg !== null); // Remove null entries (packages that couldn't be populated)

        return res.status(200).json({
            count: processedPackages.length,
            data: processedPackages
        });
    } catch (error) {
        console.error('Error fetching assigned packages:', error);
        return next(error);
    }
});
// Get guide earnings
router.get('/:id/earnings', async (req, res, next) => {
    try {
        const { id } = req.params;

        const guide = await Guide.findById(id)
            .select('earnings')
            .populate({
                path: 'earnings.history.bookingId',
                select: 'customerName bookingDate status'
            })
            .populate({
                path: 'earnings.history.packageId',
                select: 'name price'
            });

        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        return res.status(200).json(guide.earnings);
    } catch (error) {
        console.error('Error fetching guide earnings:', error);
        return next(error);
    }
});

// Get monthly earnings for charts
router.get('/:id/monthly-earnings', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { year } = req.query;

        const guide = await Guide.findById(id).select('earnings.monthly');

        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        // Filter by year if provided
        let monthlyData = guide.earnings.monthly || [];
        if (year) {
            monthlyData = monthlyData.filter(item => item.year === parseInt(year));
        }

        // Format data for charts - create array with 12 months
        const formattedData = Array(12).fill(0);
        monthlyData.forEach(item => {
            if (item.month >= 1 && item.month <= 12) {
                formattedData[item.month - 1] = item.amount;
            }
        });

        return res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error fetching monthly earnings:', error);
        return next(error);
    }
});

// Mark earnings as paid
router.put('/:id/earnings/:earningId/paid', async (req, res, next) => {
    try {
        const { id, earningId } = req.params;

        // Find the guide
        const guide = await Guide.findById(id);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        // Find the specific earning in the history array
        const earningIndex = guide.earnings.history.findIndex(
            item => item._id.toString() === earningId
        );

        if (earningIndex === -1) {
            return res.status(404).json({ message: 'Earning record not found' });
        }

        const earning = guide.earnings.history[earningIndex];

        // Check if already paid
        if (earning.status === 'paid') {
            return res.status(400).json({ message: 'Payment already marked as paid' });
        }

        // Update status and move amount from pending to received
        const amountToMove = earning.amount;
        earning.status = 'paid';

        guide.earnings.pending -= amountToMove;
        guide.earnings.received += amountToMove;

        // Save the updated guide
        await guide.save();

        return res.status(200).json({
            message: 'Payment marked as received',
            earnings: guide.earnings
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        return next(error);
    }
});

export default router;

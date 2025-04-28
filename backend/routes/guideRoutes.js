import express from 'express';
import { Guide } from '../models/guideModel.js';  // Import the Guide model
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

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

// Save a guide
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

// Get assigned packages for a guide
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
export default router;

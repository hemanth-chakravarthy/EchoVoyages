import express from 'express';
import { packages } from '../models/packageModel.js'; // Importing the Package model
import multer from 'multer';
import {Agency} from '../models/agencyModel.js'
import { customers } from '../models/customerModel.js';
import { Guide } from '../models/guideModel.js'; // Import Guide model
import path from 'path';
import { cacheMiddleware, clearCacheMiddleware } from '../middleware/cacheMiddleware.js';
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Package:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - duration
 *         - location
 *         - highlights
 *         - maxGroupSize
 *         - AgentID
 *         - image
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the package
 *         name:
 *           type: string
 *           description: Name of the travel package
 *         description:
 *           type: string
 *           description: Detailed description of the package
 *         price:
 *           type: number
 *           description: Price of the package
 *         duration:
 *           type: number
 *           description: Duration of the package in days
 *         location:
 *           type: string
 *           description: Location of the package
 *         itinerary:
 *           type: string
 *           description: Detailed itinerary of the package
 *         highlights:
 *           type: string
 *           description: Highlights of the package
 *         availableDates:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *           description: List of available dates for the package
 *         maxGroupSize:
 *           type: number
 *           description: Maximum group size for the package
 *         guide:
 *           type: string
 *           description: ID of the primary guide (for backward compatibility)
 *         guides:
 *           type: array
 *           items:
 *             type: string
 *           description: List of guide IDs assigned to the package
 *         AgentID:
 *           type: string
 *           description: ID of the agency that created the package
 *         AgentName:
 *           type: string
 *           description: Name of the agency that created the package
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
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 description: Review comment
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date when the review was submitted
 *           description: List of reviews for the package
 *         image:
 *           type: array
 *           items:
 *             type: string
 *           description: List of image paths for the package
 *         totalBookings:
 *           type: number
 *           description: Total number of bookings for the package
 *         isActive:
 *           type: string
 *           enum: [pending, confirmed, canceled]
 *           description: Status of the package
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the package was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the package was last updated
 *       example:
 *         _id: "60d21b4667d0d8992e610c85"
 *         name: "Adventure in the Alps"
 *         description: "Experience the thrill of the Alps with this adventure package"
 *         price: 1200
 *         duration: 7
 *         location: "Swiss Alps"
 *         itinerary: "Day 1: Arrival, Day 2: Hiking, Day 3: Skiing..."
 *         highlights: "Breathtaking views, Professional guides, All equipment included"
 *         availableDates: ["2023-07-15", "2023-08-01"]
 *         maxGroupSize: 10
 *         guides: ["60d21b4667d0d8992e610c86", "60d21b4667d0d8992e610c87"]
 *         AgentID: "60d21b4667d0d8992e610c88"
 *         AgentName: "Alpine Adventures"
 *         image: ["/public/packageImage/1624276806-alps1.jpg", "/public/packageImage/1624276806-alps2.jpg"]
 *         totalBookings: 5
 *         isActive: "confirmed"
 */

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('public', 'packageImage'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /packages:
 *   post:
 *     summary: Create a new travel package
 *     tags: [Packages]
 *     description: Create a new travel package with images and optional guide assignments
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - duration
 *               - location
 *               - itinerary
 *               - highlights
 *               - availableDates
 *               - maxGroupSize
 *               - AgentID
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the travel package
 *               description:
 *                 type: string
 *                 description: Detailed description of the package
 *               price:
 *                 type: number
 *                 description: Price of the package
 *               duration:
 *                 type: number
 *                 description: Duration of the package in days
 *               location:
 *                 type: string
 *                 description: Location of the package
 *               itinerary:
 *                 type: string
 *                 description: Detailed itinerary of the package
 *               highlights:
 *                 type: string
 *                 description: Highlights of the package
 *               availableDates:
 *                 type: string
 *                 description: Comma-separated list of available dates
 *               maxGroupSize:
 *                 type: number
 *                 description: Maximum group size for the package
 *               guide:
 *                 type: string
 *                 description: ID of the primary guide (optional)
 *               guides:
 *                 type: string
 *                 description: Comma-separated list or JSON array of guide IDs (optional)
 *               AgentID:
 *                 type: string
 *                 description: ID of the agency creating the package
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images for the package
 *     responses:
 *       201:
 *         description: Package created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       400:
 *         description: Missing required fields or invalid guide ID
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Internal server error
 */
router.post('/', upload.array('images'), clearCacheMiddleware('/packages'), async (req, res, next) => {
    try {
        // Check if all required fields are provided
        const {
            name, description, price, duration, location, itinerary, highlights, availableDates, maxGroupSize, guide, AgentID
        } = req.body;

        if (!name || !description || !price || !duration || !location || !itinerary || !highlights || !availableDates || !maxGroupSize || !AgentID) {
            return res.status(400).send({
                message: "Please provide all required fields"
            });
        }
        const AgentData = await Agency.findById(AgentID)
        if(!AgentData){
            return res.status(404).send({ message: 'Agent not found' });
        }
        const AgentName = AgentData.username;
        // Map over the uploaded files to extract file paths
        const imagePaths = req.files ? req.files.map(file => `/public/packageImage/${file.filename}`) : [];

        // Process guides array if provided
        let guidesArray = [];
        if (req.body.guides) {
            // If guides is a string, try to parse it as JSON
            if (typeof req.body.guides === 'string') {
                try {
                    guidesArray = JSON.parse(req.body.guides);
                } catch (e) {
                    // If parsing fails, assume it's a comma-separated string
                    guidesArray = req.body.guides.split(',').map(id => id.trim());
                }
            } else if (Array.isArray(req.body.guides)) {
                guidesArray = req.body.guides;
            }

            // Remove duplicates from guides array
            guidesArray = [...new Set(guidesArray)];

            // Validate that all guide IDs exist
            for (const guideId of guidesArray) {
                const guideExists = await Guide.findById(guideId);
                if (!guideExists) {
                    return res.status(400).send({
                        message: `Guide with ID ${guideId} does not exist`
                    });
                }
            }
        }

        // Create a new package object with the data from the request
        const newPackage = {
            name,
            description,
            price,
            duration,
            location,
            itinerary,
            highlights,
            availableDates: availableDates.split(','),  // Assuming dates are passed as a comma-separated string
            maxGroupSize,
            guide: guide || null, // Single guide (for backward compatibility)
            guides: guidesArray,  // Array of guide IDs
            AgentID,
            AgentName, // Store the agentID in the package
            reviews: req.body.reviews || [],
            image: imagePaths,  // Save the image paths to the database
            totalBookings: req.body.totalBookings || 0,
            isActive: 'pending'
        };

        // Save the new package in the database
        const savedPackage = await packages.create(newPackage);

        // Send the response with the saved package
        return res.status(201).send(savedPackage);
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).send({
            message: "Internal Server Error"
        });
    }
});

/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Get all travel packages
 *     tags: [Packages]
 *     description: Retrieve a list of all travel packages with guide details
 *     responses:
 *       200:
 *         description: A list of packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of packages returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
 *       500:
 *         description: Server error
 */
router.get('/', cacheMiddleware(300), async (req, res, next) => {
    try {
        // Find all packages and populate guide details
        const packs = await packages.find({})
            .populate({
                path: 'guide',
                select: 'name experience languages location ratings' // Select specific fields to return
            })
            .populate({
                path: 'guides',
                select: 'name experience languages location ratings' // Select specific fields to return
            });

        return res.status(200).json({
            count: packs.length,
            data: packs
        });
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({ message: error.message });
    }
})
/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get a specific travel package by ID
 *     tags: [Packages]
 *     description: Retrieve detailed information about a specific travel package by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the package to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.get('/:id', cacheMiddleware(300), async (req, res, next) => {
    try {
        let { id } = req.params;
        id = id.toString();

        // Find the package and populate guide details
        const pack = await packages.findOne({ _id: id })
            .populate({
                path: 'guide',
                select: 'name experience languages location ratings' // Select specific fields to return
            })
            .populate({
                path: 'guides',
                select: 'name experience languages location ratings' // Select specific fields to return
            });

        if (!pack) {
            return res.status(404).json({ message: "Package not found" });
        }

        return res.status(200).json(pack);
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({ message: error.message });
    }
})
// update package
router.put('/:id', clearCacheMiddleware('/packages'), async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the package first to make sure it exists
        const existingPackage = await packages.findById(id);
        if (!existingPackage) {
            return res.status(404).json({ message: "Package not found" });
        }

        // Handle guides array if provided
        if (req.body.guides) {
            let guidesArray = [];

            // If guides is a string, try to parse it as JSON
            if (typeof req.body.guides === 'string') {
                try {
                    guidesArray = JSON.parse(req.body.guides);
                } catch (e) {
                    // If parsing fails, assume it's a comma-separated string
                    guidesArray = req.body.guides.split(',').map(id => id.trim());
                }
            } else if (Array.isArray(req.body.guides)) {
                guidesArray = req.body.guides;
            }

            // Remove duplicates from guides array
            guidesArray = [...new Set(guidesArray)];

            // Validate that all guide IDs exist
            for (const guideId of guidesArray) {
                const guideExists = await Guide.findById(guideId);
                if (!guideExists) {
                    return res.status(400).send({
                        message: `Guide with ID ${guideId} does not exist`
                    });
                }
            }

            // Update the guides array in the request body
            req.body.guides = guidesArray;
        }

        // Update the package
        const result = await packages.findByIdAndUpdate(id, req.body, { new: true });

        return res.status(200).json({
            message: "Package updated successfully",
            data: result
        });
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({ message: error.message });
    }
})
// delete a package
router.delete('/:id', clearCacheMiddleware('/packages'), async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await packages.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" package not found"})
        }
        return res.status(200).json({message:" package deleted"})


    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
router.get('/agents/:AgentID', cacheMiddleware(300), async (req, res, next) => {
    const { AgentID } = req.params;
    // This check might not be needed since AgentID is expected in the route
    if (!AgentID) {
        return res.status(400).json({ message: 'Agent ID is required' });
    }

    try {
        // Query the packages for the given AgentID and populate guide details
        const agentPackages = await packages.find({ AgentID })
            .populate({
                path: 'guide',
                select: 'name experience languages location ratings' // Select specific fields to return
            })
            .populate({
                path: 'guides',
                select: 'name experience languages location ratings' // Select specific fields to return
            });

        // Check if no packages were found for the agent
        if (agentPackages.length === 0) {
            return res.status(404).json({ message: 'No packages found for this agent' });
        }

        // Respond with the packages found
        res.status(200).json(agentPackages);
    } catch (error) {
        console.error(error);
        next(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Endpoint to assign guides to a package
router.post('/:id/guides', clearCacheMiddleware('/packages'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { guideIds } = req.body;

        // Validate input
        if (!guideIds || !Array.isArray(guideIds)) {
            return res.status(400).json({
                message: 'Guide IDs must be provided as an array'
            });
        }

        // Find the package
        const packageData = await packages.findById(id);
        if (!packageData) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Remove duplicates
        const uniqueGuideIds = [...new Set(guideIds)];

        // Validate that all guide IDs exist
        for (const guideId of uniqueGuideIds) {
            const guideExists = await Guide.findById(guideId);
            if (!guideExists) {
                return res.status(400).json({
                    message: `Guide with ID ${guideId} does not exist`
                });
            }
        }

        // Update the package with the new guides
        const updatedPackage = await packages.findByIdAndUpdate(
            id,
            { guides: uniqueGuideIds },
            { new: true }
        ).populate({
            path: 'guides',
            select: 'name experience languages location ratings'
        });

        // Update each guide's assignedPackages array
        for (const guideId of uniqueGuideIds) {
            // Check if the guide already has this package assigned
            const guide = await Guide.findById(guideId);
            const packageExists = guide.assignedPackages.some(
                pkg => pkg.packageId.toString() === id
            );

            if (!packageExists) {
                await Guide.findByIdAndUpdate(
                    guideId,
                    {
                        $push: {
                            assignedPackages: {
                                packageId: id,
                                packageName: packageData.name,
                                price: packageData.price,
                                status: 'confirmed'
                            }
                        }
                    }
                );
            }
        }

        return res.status(200).json({
            message: 'Guides assigned to package successfully',
            data: updatedPackage
        });
    } catch (error) {
        console.error('Error assigning guides to package:', error);
        next(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to get packages by guide ID
router.get('/guides/:guideId', cacheMiddleware(300), async (req, res, next) => {
    try {
        const { guideId } = req.params;

        // Check if the guide exists
        const guideExists = await Guide.findById(guideId);
        if (!guideExists) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        // Find packages that have this guide in their guides array
        const guidePackages = await packages.find({
            $or: [
                { guide: guideId },
                { guides: guideId }
            ]
        }).populate({
            path: 'guides',
            select: 'name experience languages location ratings'
        });

        if (guidePackages.length === 0) {
            return res.status(404).json({ message: 'No packages found for this guide' });
        }

        return res.status(200).json({
            count: guidePackages.length,
            data: guidePackages
        });
    } catch (error) {
        console.error('Error fetching packages by guide:', error);
        next(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to remove a guide from a package
router.delete('/:packageId/guides/:guideId', clearCacheMiddleware('/packages'), async (req, res, next) => {
    try {
        const { packageId, guideId } = req.params;

        // Find the package
        const packageData = await packages.findById(packageId);
        if (!packageData) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Check if the guide exists
        const guideExists = await Guide.findById(guideId);
        if (!guideExists) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        // Remove the guide from the package's guides array
        const updatedPackage = await packages.findByIdAndUpdate(
            packageId,
            { $pull: { guides: guideId } },
            { new: true }
        ).populate({
            path: 'guides',
            select: 'name experience languages location ratings'
        });

        // Remove the package from the guide's assignedPackages array
        await Guide.findByIdAndUpdate(
            guideId,
            {
                $pull: {
                    assignedPackages: { packageId: packageId }
                }
            }
        );

        return res.status(200).json({
            message: 'Guide removed from package successfully',
            data: updatedPackage
        });
    } catch (error) {
        console.error('Error removing guide from package:', error);
        next(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

export default router;

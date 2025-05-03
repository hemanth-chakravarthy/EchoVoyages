import express from 'express';
import { Agency } from '../models/agencyModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Agency:
 *       type: object
 *       required:
 *         - name
 *         - gmail
 *         - phno
 *         - specialization
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the agency
 *         username:
 *           type: string
 *           description: Username of the agency
 *         name:
 *           type: string
 *           description: Name of the agency
 *         gmail:
 *           type: string
 *           description: Email address of the agency
 *         phno:
 *           type: string
 *           description: Phone number of the agency
 *         password:
 *           type: string
 *           description: Hashed password of the agency
 *         role:
 *           type: string
 *           default: agency
 *           description: Role of the user
 *         bio:
 *           type: string
 *           description: Biography or description of the agency
 *         specialization:
 *           type: string
 *           enum: [luxury, adventure, business, family, budget-friendly, other]
 *           description: Specialization of the agency
 *         profileImage:
 *           type: string
 *           description: Path to the agency's profile image
 *         contactInfo:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Contact email of the agency
 *             phone:
 *               type: string
 *               description: Contact phone number of the agency
 *         travelPackages:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of travel packages offered by the agency
 *         packageName:
 *           type: array
 *           items:
 *             type: string
 *           description: Names of travel packages offered by the agency
 *         bookingRequests:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of booking requests received by the agency
 *       example:
 *         _id: "60d21b4667d0d8992e610c88"
 *         username: "alpineadventures"
 *         name: "Alpine Adventures"
 *         gmail: "info@alpineadventures.com"
 *         phno: "+41123456789"
 *         role: "agency"
 *         bio: "Specializing in mountain and alpine adventures since 2005"
 *         specialization: "adventure"
 *         profileImage: "/public/agencyProfiles/profile-1624276806-123456.jpg"
 *         contactInfo:
 *           email: "info@alpineadventures.com"
 *           phone: "+41123456789"
 *         travelPackages: ["60d21b4667d0d8992e610c85", "60d21b4667d0d8992e610c86"]
 *         packageName: ["Adventure in the Alps", "Swiss Mountain Retreat"]
 */

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "public/agencyProfiles";

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
 * /agencies:
 *   post:
 *     summary: Create a new agency
 *     tags: [Agencies]
 *     description: Create a new travel agency with basic information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gmail
 *               - phno
 *               - bio
 *               - specialization
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the agency
 *               gmail:
 *                 type: string
 *                 description: Email address of the agency
 *               phno:
 *                 type: string
 *                 description: Phone number of the agency
 *               bio:
 *                 type: string
 *                 description: Biography or description of the agency
 *               specialization:
 *                 type: string
 *                 enum: [luxury, adventure, business, family, budget-friendly, other]
 *                 description: Specialization of the agency
 *               travelPackages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs of travel packages offered by the agency (optional)
 *               packageName:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Names of travel packages offered by the agency (optional)
 *               bookingRequests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs of booking requests received by the agency (optional)
 *     responses:
 *       201:
 *         description: Agency created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agency'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res,next) => {
    try {
        const { name, gmail, phno, bio, specialization } = req.body;

        if (!name || !gmail || !phno || !bio || !specialization) {
            return res.status(400).send({
                message: "Send all required fields"
            });
        }

        const newAgency = {
            name,
            gmail,
            phno,
            bio,
            specialization,
            // Add contactInfo to match existing database schema
            contactInfo: {
                email: gmail,
                phone: phno
            },
            travelPackages: req.body.travelPackages || [],
            packageName: req.body.packageName || [],
            bookingRequests: req.body.bookingRequests || []
        };

        const agency = await Agency.create(newAgency);
        return res.status(201).send(agency);
    } catch (error) {
        console.log(error);
        next(error);
        res.status(500).send({ message: error.message });
    }
});

/**
 * @swagger
 * /agencies:
 *   get:
 *     summary: Get all agencies
 *     tags: [Agencies]
 *     description: Retrieve a list of all travel agencies
 *     responses:
 *       200:
 *         description: A list of agencies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of agencies returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Agency'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res,next) => {
    try {
        const agencies = await Agency.find({});
        return res.status(200).json({
            count: agencies.length,
            data: agencies
        });
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({ message: error.message });
    }
});

// Delete an agency
router.delete('/:id', async (req, res,next) => {
    try {
        const { id } = req.params;
        const result = await Agency.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Agency not found" });
        }
        return res.status(200).json({ message: "Agency deleted" });
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({ message: error.message });
    }
});

// Update an agency with profile image support
router.put('/:id', upload.single('profileImage'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If a file was uploaded, add the path to the update data
        if (req.file) {
            // Use forward slashes for path consistency across platforms
            updateData.profileImage = req.file.path.replace(/\\/g, '/');
            console.log('Profile image uploaded:', updateData.profileImage);
        }

        // Handle array fields that might be sent as JSON strings
        ['travelPackages', 'packageName', 'bookingRequests'].forEach(field => {
            if (updateData[field] && typeof updateData[field] === 'string') {
                try {
                    updateData[field] = JSON.parse(updateData[field]);
                    console.log(`Parsed ${field} as JSON:`, updateData[field]);
                } catch (e) {
                    console.error(`Error parsing ${field} as JSON:`, e);
                    delete updateData[field]; // Remove invalid field to prevent errors
                }
            }
        });

        // Handle contactInfo updates
        if (req.body['contactInfo.email'] || req.body['contactInfo.phone']) {
            updateData.contactInfo = updateData.contactInfo || {};
            if (req.body['contactInfo.email']) {
                updateData.contactInfo.email = req.body['contactInfo.email'];
                updateData.gmail = req.body['contactInfo.email']; // Update gmail field too
                delete updateData['contactInfo.email'];
            }
            if (req.body['contactInfo.phone']) {
                updateData.contactInfo.phone = req.body['contactInfo.phone'];
                updateData.phno = req.body['contactInfo.phone']; // Update phno field too
                delete updateData['contactInfo.phone'];
            }
        }

        const result = await Agency.findByIdAndUpdate(id, updateData, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Agency not found" });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

/**
 * @swagger
 * /agencies/{id}:
 *   get:
 *     summary: Get an agency by ID
 *     tags: [Agencies]
 *     description: Retrieve a specific agency by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the agency to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agency details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agency'
 *       404:
 *         description: Agency not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res,next) => {
    try {
        const { id } = req.params;
        const agency = await Agency.findById(id);
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }
        return res.status(200).json(agency);
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({ message: error.message });
    }
});

export default router;

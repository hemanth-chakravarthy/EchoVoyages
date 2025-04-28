import express from 'express';
import { Agency } from '../models/agencyModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

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

// Save a new agency
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

// Get all agencies
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

// View a single agency
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

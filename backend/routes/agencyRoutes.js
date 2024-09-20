import express from 'express';
import { Agency } from '../models/agencyModel.js'; // Make sure to adjust the path as needed
const router = express.Router();

// Save a new agency
router.post('/', async (req, res) => {
    try {
        const { name, contactInfo, bio, specialization } = req.body;

        if (!name || !contactInfo || !bio || !specialization) {
            return res.status(400).send({
                message: "Send all required fields"
            });
        }

        const newAgency = {
            name,
            contactInfo,
            bio,
            specialization,
            travelPackages: req.body.travelPackages || [],
            packageName: req.body.packageName || [],
            bookingRequests: req.body.bookingRequests || []
        };

        const agency = await Agency.create(newAgency);
        return res.status(201).send(agency);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

// Get all agencies
router.get('/', async (req, res) => {
    try {
        const agencies = await Agency.find({});
        return res.status(200).json({
            count: agencies.length,
            data: agencies
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Delete an agency
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Agency.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Agency not found" });
        }
        return res.status(200).json({ message: "Agency deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Update an agency
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Agency.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Agency not found" });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// View a single agency
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const agency = await Agency.findById(id);
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }
        return res.status(200).json(agency);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;

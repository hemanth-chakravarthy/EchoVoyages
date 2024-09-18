import express from 'express';
import { Guide } from '../models/guideModel.js';  // Import the Guide model

const router = express.Router();

// Save a guide
router.post('/', async (req, res) => {
    try {
        const { name, experience, languages, location, contact, availability } = req.body;

        // Validate required fields
        if (!name || !experience || !languages || !location || !contact || !contact.phone || !contact.email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new guide instance
        const newGuide = new Guide({
            name,
            experience,
            languages,
            location,
            contact,
            availability
        });

        // Save the guide to the database
        const savedGuide = await Guide.create(newGuide);
        return res.status(201).send(savedGuide)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the guide' });
    }
});

export default router;

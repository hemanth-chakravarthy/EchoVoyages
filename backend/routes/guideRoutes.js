import express from 'express';
import { Guide } from '../models/guideModel.js';  // Import the Guide model

const router = express.Router();

// Save a guide
router.post('/', async (req, res) => {
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
        res.status(500).json({ message: 'An error occurred while saving the guide' });
    }
});

router.get('/',async (req,res) => {
    try {
        const guides = await Guide.find({});
        return res.status(200).json({
            count: guides.length,
            data: guides
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})
router.put('/:id', async (req, res) => {
    try {
        const { 
            name, 
            experience, 
            languages, 
            location, 
            contact, 
            availability, 
            specializations, 
            pricing, 
            bio, 
            availableDates, 
            ratings // Add the ratings object here
        } = req.body;

        // Update guide fields, including ratings
        const guide = await Guide.findByIdAndUpdate(
            req.params.id,
            {
                name,
                experience,
                languages,
                location,
                contact,
                availability: true,
                specializations,
                availableDates,
                pricing,
                bio,
                'ratings.averageRating': ratings.averageRating, // Update averageRating
                'ratings.numberOfReviews': ratings.numberOfReviews // Update numberOfReviews
            },
            { new: true }
        );

        if (!guide) {
            return res.status(404).send({ message: "Guide not found" });
        }

        return res.status(200).send(guide);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id)
        if (!guide) {
            return res.status(404).send({ message: "Guide not found" });
        }
        return res.status(200).send(guide);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const guide = await Guide.findByIdAndDelete(req.params.id);
        if (!guide) {
            return res.status(404).send({ message: "Guide not found" });
        }
        return res.status(200).send({ message: "Guide deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
export default router;

import express from 'express';
import { packages } from '../models/packageModel.js'; // Importing the Package model
const router = express.Router();

// Save a new package
router.post('/', async (req, res) => {
    try {
        // Check if all required fields are provided
        if (
            !req.body.name ||
            !req.body.description ||
            !req.body.price ||
            !req.body.duration ||
            !req.body.location ||
            !req.body.itinerary ||
            !req.body.highlights ||
            !req.body.availableDates ||
            !req.body.maxGroupSize
        ) {
            return res.status(400).send({
                message: "Please provide all required fields"
            });
        }

        // Create a new package object with the data from the request
        const newPackage = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            duration: req.body.duration,
            location: req.body.location,
            itinerary: req.body.itinerary,
            highlights: req.body.highlights,
            availableDates: req.body.availableDates,
            maxGroupSize: req.body.maxGroupSize,
            reviews: req.body.reviews || [],
            images: req.body.images || [],
            totalBookings: req.body.totalBookings || 0,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        };

        // Save the new package in the database
        const savedPackage = await packages.create(newPackage);

        // Send the response with the saved package
        return res.status(201).send(savedPackage);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Internal Server Error"
        });
    }
});

export default router;

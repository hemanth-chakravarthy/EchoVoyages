import express from 'express';
import { reviews } from '../models/customerReviewModel.js';
const router = express.Router();

// Save a review
router.post('/', async (req, res) => {
    try {
        const { userId, packageId, rating, comment } = req.body;
        
        // Validate required fields
        if (!userId || !packageId || !rating || !comment) {
            return res.status(400).send({
                message: "Send all required fields"
            });
        }

        // Create new review
        const newReview = {
            userId,
            packageId,
            rating,
            comment
        };

        const review = await reviews.create(newReview);
        return res.status(201).send(review);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get all reviews (for admin panel or other purposes)
router.get('/', async (req, res) => {
    try {
        const reviews = await reviews.find().populate('userId').populate('packageId');
        return res.status(200).send(reviews);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get a specific review by ID
router.get('/:id', async (req, res) => {
    try {
        const review = await reviews.findById(req.params.id).populate('userId').populate('packageId');
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        return res.status(200).send(review);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Update a review by ID
router.put('/:id', async (req, res) => {
    try {
        const { rating, comment, status } = req.body;

        // Update review fields
        const review = await reviews.findByIdAndUpdate(
            req.params.id,
            { rating, comment, status },
            { new: true }
        );
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        return res.status(200).send(review);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Delete a review by ID
router.delete('/:id', async (req, res) => {
    try {
        const review = await reviews.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        return res.status(200).send({ message: "Review deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export default router;

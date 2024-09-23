import express from 'express';
import { reviews } from '../models/customerReviewModel.js';
import { packages } from '../models/packageModel.js';
import { customers } from '../models/customerModel.js';
const router = express.Router();

// Save a review
router.post('/', async (req, res) => {
    try {
        const { customerId, packageId, rating, comment } = req.body;
        
        // Validate required fields
        if (!customerId || !packageId || !rating || !comment) {
            return res.status(400).send({
                message: "Send all required fields"
            });
        }
        const packageData = await packages.findById(packageId);
        if (!packageData) {
            return res.status(404).send({ message: 'Package not found' });
        }
        const customerData = await customers.findById(customerId)
        if(!customerData){
            return res.status(404).send({ message: 'Customer not found' });
        }
        const packageName = packageData.name;
        const customerName = customerData.username;

        // Create new review
        const newReview = {
            customerName,
            customerId,
            packageId,
            packageName,
            rating,
            comment,
            status: "approved"
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
        const revs = await reviews.find().populate('customerId').populate('packageId');
        return res.status(200).send(revs);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
router.get('/:packageId', async (req, res) => {
    const { packageId } = req.params;  // Extract the packageId properly

    if (!packageId) {
        return res.status(400).json({ message: 'Package ID is required' });
    }

    try {
        // Find reviews associated with the specific packageId
        const revs = await reviews.find({ packageId });

        // If no reviews are found
        if (revs.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this package' });
        }

        // Send the found reviews as a response
        res.status(200).json(revs);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});


// Get a specific review by ID
router.get('/:id', async (req, res) => {
    try {
        const review = await reviews.findById(req.params.id).populate('customerId').populate('packageId');
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
router.get('/', (req, res) => {
    reviews.find()
      .populate('customerId', 'username')
      .populate('packageId', 'name')
      .exec((err, reviewData) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(200).json(reviewData);
      });
  });

export default router;

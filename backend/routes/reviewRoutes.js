import express from 'express';
import { reviews } from '../models/customerReviewModel.js';
import { packages } from '../models/packageModel.js';
import { customers } from '../models/customerModel.js';
import { Guide } from '../models/guideModel.js';
const router = express.Router();

// Save a review
router.post('/', async (req, res) => {
    try {
        const { customerId, packageId, guideId, rating, comment } = req.body;

        // Validate required fields
        if (!customerId || !rating || !comment) {
            return res.status(400).send({
                message: "Send all required fields"
            });
        }

        // Check for the package if packageId is provided
        let packageData;
        if (packageId) {
            packageData = await packages.findById(packageId);
            if (!packageData) {
                return res.status(404).send({ message: 'Package not found' });
            }
        }

        // Check for the customer
        const customerData = await customers.findById(customerId);
        if (!customerData) {
            return res.status(404).send({ message: 'Customer not found' });
        }

        // Check for the guide if guideId is provided
        let guideData;
        if (guideId) {
            guideData = await Guide.findById(guideId);
            if (!guideData) {
                return res.status(404).send({ message: 'Guide not found' });
            }
        }

        // Create new review data
        const newReview = {
            customerName: customerData.username,
            customerId,
            packageId,
            packageName: packageData ? packageData.name : undefined,  // Optional if package is not provided
            guideId,
            guideName: guideData ? guideData.name : undefined,  // Optional if guide is not provided
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

router.post('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
  
    try {
      // Find the review by its ID and increment the reports field by 1
      const review = await reviews.findByIdAndUpdate(
        reviewId,
        { $inc: { reports: 1 } },  // Increment the "reports" field by 1
        { new: true } // Return the updated document
      );
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      res.status(200).json({ message: 'Review has been reported', review });
    } catch (error) {
      console.error('Error reporting review:', error);
      res.status(500).json({ message: 'Server error' });
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
router.get('/guides/:guideID', async (req, res) => {
    const { guideID } = req.params;

    try {
        // Find the guide by ID
        const guide = await Guide.findById(guideID);

        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        // Fetch reviews for the guide separately based on guideId
        const review = await reviews.find({ guideId: guideID });

        // Return the guide and its reviews
        return res.status(200).json({ guide, review });
    } catch (error) {
        console.error('Error fetching guide details:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});



export default router;

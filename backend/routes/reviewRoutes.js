/** @format */

import express from "express";
import { reviews } from "../models/customerReviewModel.js";
import { packages } from "../models/packageModel.js";
import { customers } from "../models/customerModel.js";
import { Guide } from "../models/guideModel.js";
import { bookings } from "../models/bookingModel.js";
import {
  cacheMiddleware,
  clearCacheMiddleware,
} from "../middleware/cacheMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - customerName
 *         - customerId
 *         - rating
 *         - comment
 *         - bookingId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the review
 *         customerName:
 *           type: string
 *           description: Name of the customer who submitted the review
 *         customerId:
 *           type: string
 *           description: ID of the customer who submitted the review
 *         packageId:
 *           type: string
 *           description: ID of the package being reviewed (optional)
 *         packageName:
 *           type: string
 *           description: Name of the package being reviewed (optional)
 *         guideId:
 *           type: string
 *           description: ID of the guide being reviewed (optional)
 *         guideName:
 *           type: string
 *           description: Name of the guide being reviewed (optional)
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *         comment:
 *           type: string
 *           description: Review comment
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: approved
 *           description: Status of the review
 *         bookingId:
 *           type: string
 *           description: ID of the booking associated with this review
 *         reports:
 *           type: number
 *           default: 0
 *           description: Number of times this review has been reported
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the review was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the review was last updated
 *       example:
 *         _id: "60d21b4667d0d8992e610c97"
 *         customerName: "John Doe"
 *         customerId: "60d21b4667d0d8992e610c91"
 *         packageId: "60d21b4667d0d8992e610c85"
 *         packageName: "Adventure in the Alps"
 *         guideId: "60d21b4667d0d8992e610c93"
 *         guideName: "Jane Smith"
 *         rating: 4.5
 *         comment: "Great experience! The guide was very knowledgeable and the views were amazing."
 *         status: "approved"
 *         bookingId: "60d21b4667d0d8992e610c90"
 *         reports: 0
 *         createdAt: "2023-05-15T10:30:00Z"
 *         updatedAt: "2023-05-15T10:30:00Z"
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     description: Submit a review for a package, guide, or both
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - rating
 *               - comment
 *               - bookingId
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID of the customer submitting the review
 *               packageId:
 *                 type: string
 *                 description: ID of the package being reviewed (optional)
 *               guideId:
 *                 type: string
 *                 description: ID of the guide being reviewed (optional)
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 description: Review comment
 *               bookingId:
 *                 type: string
 *                 description: ID of the booking associated with this review
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review submitted successfully
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: You can only review items that you have booked
 *       404:
 *         description: Customer, package, guide, or booking not found
 *       500:
 *         description: Server error
 */
router.post("/", clearCacheMiddleware("reviews"), async (req, res, next) => {
  try {
    const { customerId, packageId, guideId, rating, comment, bookingId } =
      req.body;

    // Validate required fields
    if (!customerId || !rating || !comment || !bookingId) {
      return res.status(400).send({
        message:
          "Please provide all required fields: customerId, rating, comment, and bookingId",
      });
    }

    // Check for the customer
    const customerData = await customers.findById(customerId);
    if (!customerData) {
      return res.status(404).send({ message: "Customer not found" });
    }

    // Check if the booking is valid
    const bookingData = await bookings.findById(bookingId);
    if (!bookingData) {
      return res.status(404).send({
        message:
          "Invalid booking ID. Please provide a valid booking for this package.",
      });
    }

    // Ensure that the booking matches the customer ID
    if (bookingData.customerId.toString() !== customerId) {
      return res.status(403).send({
        message: "You can only review items that you have booked.",
      });
    }

    // Check for the package if packageId is provided
    let packageData;
    if (packageId) {
      packageData = await packages.findById(packageId);
      if (!packageData) {
        return res.status(404).send({ message: "Package not found" });
      }

      // Ensure the booking matches the package ID
      if (
        bookingData.packageId &&
        bookingData.packageId.toString() !== packageId
      ) {
        return res.status(403).send({
          message: "You can only review packages that you have booked.",
        });
      }
    }

    // Check for the guide if guideId is provided (optional)
    let guideData;
    if (guideId) {
      guideData = await Guide.findById(guideId);
      if (!guideData) {
        return res.status(404).send({ message: "Guide not found" });
      }

      // Ensure the booking matches the guide ID
      if (bookingData.guideId && bookingData.guideId.toString() !== guideId) {
        return res.status(403).send({
          message: "You can only review guides that you have booked.",
        });
      }
    }

    // Create new review data
    const newReview = {
      customerName: customerData.username,
      customerId,
      packageId,
      packageName: packageData ? packageData.name : undefined, // Optional if package is not provided
      guideId,
      guideName: guideData ? guideData.name : undefined, // Optional if guide is not provided
      rating,
      comment,
      status: "approved",
      bookingId, // Store the booking ID in the review for future reference
    };

    // Create the review in the reviews collection
    const review = await reviews.create(newReview);

    // If this is a package review, also add it to the package's reviews array
    if (packageId && packageData) {
      // Add the review to the package's reviews array
      await packages.findByIdAndUpdate(
        packageId,
        {
          $push: {
            reviews: {
              customer: customerId,
              rating: rating,
              comment: comment,
              date: new Date(),
            },
          },
        },
        { new: true }
      );
      console.log(`Review added to package ${packageId}`);
    }

    // If this is a guide review, also add it to the guide's reviews array
    if (guideId && guideData) {
      // Add the review to the guide's reviews array
      await Guide.findByIdAndUpdate(
        guideId,
        {
          $push: {
            reviews: {
              customer: customerId,
              rating: rating,
              comment: comment,
              date: new Date(),
            },
          },
          $set: {
            "ratings.averageRating":
              (guideData.ratings.averageRating *
                guideData.ratings.numberOfReviews +
                rating) /
              (guideData.ratings.numberOfReviews + 1),
            "ratings.numberOfReviews": guideData.ratings.numberOfReviews + 1,
          },
        },
        { new: true }
      );
      console.log(`Review added to guide ${guideId}`);
    }

    return res
      .status(201)
      .send({ message: "Review submitted successfully", review });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /reviews/{reviewId}:
 *   post:
 *     summary: Report a review
 *     tags: [Reviews]
 *     description: Report an inappropriate review
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         description: ID of the review to report
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review has been reported
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review has been reported
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.post("/:reviewId", async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    // Find the review by its ID and increment the reports field by 1
    const review = await reviews.findByIdAndUpdate(
      reviewId,
      { $inc: { reports: 1 } }, // Increment the "reports" field by 1
      { new: true } // Return the updated document
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review has been reported", review });
  } catch (error) {
    console.error("Error reporting review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     description: Retrieve all reviews with populated customer and package details
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res, next) => {
  try {
    const revs = await reviews
      .find()
      .populate("customerId")
      .populate("packageId");
    return res.status(200).send(revs);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
/**
 * @swagger
 * /reviews/package/{packageId}:
 *   get:
 *     summary: Get reviews for a package
 *     tags: [Reviews]
 *     description: Retrieve all reviews for a specific package
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         description: ID of the package to get reviews for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the package
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       400:
 *         description: Package ID is required
 *       404:
 *         description: No reviews found for this package
 *       500:
 *         description: Server error
 */
router.get("/package/:packageId", async (req, res, next) => {
  const { packageId } = req.params; // Extract the packageId properly

  if (!packageId) {
    return res.status(400).json({ message: "Package ID is required" });
  }

  try {
    // Find reviews associated with the specific packageId
    const revs = await reviews.find({ packageId });
    console.log(revs.length);
    // If no reviews are found
    if (revs.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this package" });
    }

    // Send the found reviews as a response
    res.status(200).json(revs);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    next(error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});
/**
 * @swagger
 * /reviews/guides/{guideId}/reviews:
 *   get:
 *     summary: Get reviews for a guide
 *     tags: [Reviews]
 *     description: Retrieve all reviews for a specific guide
 *     parameters:
 *       - in: path
 *         name: guideId
 *         required: true
 *         description: ID of the guide to get reviews for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the guide
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       400:
 *         description: Guide ID is required
 *       500:
 *         description: Server error
 */
router.get("/guides/:guideId/reviews", async (req, res, next) => {
  const { guideId } = req.params; // Extract the guideId properly

  if (!guideId) {
    return res.status(400).json({ message: "Guide ID is required" });
  }

  try {
    // Find reviews associated with the specific guideId
    const revs = await reviews.find({ guideId });

    // If no reviews are found
    if (revs.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404 for easier frontend handling
    }

    // Send the found reviews as a response
    res.status(200).json(revs);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    next(error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     description: Retrieve a specific review by ID with populated customer and package details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res, next) => {
  try {
    const review = await reviews
      .findById(req.params.id)
      .populate("customerId")
      .populate("packageId");
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }
    return res.status(200).send(review);
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     description: Update a specific review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Updated rating from 1 to 5
 *               comment:
 *                 type: string
 *                 description: Updated review comment
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: Updated status of the review
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put("/:id", clearCacheMiddleware("reviews"), async (req, res, next) => {
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
    next(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     description: Delete a specific review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  clearCacheMiddleware("reviews"),
  async (req, res, next) => {
    try {
      const review = await reviews.findByIdAndDelete(req.params.id);
      if (!review) {
        return res.status(404).send({ message: "Review not found" });
      }
      return res.status(200).send({ message: "Review deleted successfully" });
    } catch (error) {
      console.log(error);
      next(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);
/**
 * @swagger
 * /reviews/guides/{guideId}/details:
 *   get:
 *     summary: Get guide details with reviews
 *     tags: [Reviews]
 *     description: Retrieve guide details along with their reviews and update the guide's average rating
 *     parameters:
 *       - in: path
 *         name: guideId
 *         required: true
 *         description: ID of the guide to get details for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guide details with reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guide:
 *                   $ref: '#/components/schemas/Guide'
 *                 review:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.get("/guides/:guideId/details", async (req, res, next) => {
  const { guideId } = req.params;

  try {
    // Find the guide by ID
    const guide = await Guide.findById(guideId);

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    // Fetch reviews for the guide separately based on guideId
    const review = await reviews.find({ guideId });

    // Calculate average rating
    let averageRating = 0;
    if (review && review.length > 0) {
      const totalRating = review.reduce((sum, r) => sum + r.rating, 0);
      averageRating = totalRating / review.length;

      // Update guide's ratings in the database
      await Guide.findByIdAndUpdate(guideId, {
        "ratings.averageRating": averageRating,
        "ratings.numberOfReviews": review.length,
      });

      // Update the guide object for the response
      guide.ratings = {
        averageRating,
        numberOfReviews: review.length,
      };
    }

    // Return the guide and its reviews
    return res.status(200).json({ guide, review });
  } catch (error) {
    console.error("Error fetching guide details:", error);
    next(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

export default router;
/**
 * @swagger
 * /reviews/package/{packageId}/summary:
 * get:
 *   summary: Get rating summary for a package
 *   tags: [Reviews]
 *   description: Retrieve aggregated rating data for a specific package
 *   parameters:
 *     - in: path
 *       name: packageId
 *       required: true
 *       description: ID of the package to get rating summary for
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: Package rating summary
 */
router.get(
  "/package/:packageId/summary",
  cacheMiddleware(600),
  async (req, res, next) => {
    const { packageId } = req.params;

    try {
      // Use aggregation pipeline for efficient calculation
      const summary = await reviews.aggregate([
        {
          $match: {
            packageId: new mongoose.Types.ObjectId(packageId),
            status: "approved",
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
            ratings: {
              $push: "$rating",
            },
          },
        },
        {
          $project: {
            _id: 0,
            averageRating: { $round: ["$averageRating", 1] },
            totalReviews: 1,
            ratingDistribution: {
              5: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r", 5] },
                  },
                },
              },
              4: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r", 4] },
                  },
                },
              },
              3: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r", 3] },
                  },
                },
              },
              2: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r", 2] },
                  },
                },
              },
              1: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r", 1] },
                  },
                },
              },
            },
          },
        },
      ]);

      // If no reviews found, return default structure
      if (summary.length === 0) {
        return res.status(200).json({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      }

      res.status(200).json(summary[0]);
    } catch (error) {
      console.error("Error fetching package rating summary:", error);
      next(error);
      res.status(500).json({ message: "Error fetching rating summary" });
    }
  }
);

/**
 * @swagger
 * /reviews/guide/{guideId}/summary:
 * get:
 *   summary: Get rating summary for a guide
 *   tags: [Reviews]
 *   description: Retrieve aggregated rating data for a specific guide
 *   parameters:
 *     - in: path
 *       name: guideId
 *       required: true
 *       description: ID of the guide to get rating summary for
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: Guide rating summary
 */
router.get(
  "/guide/:guideId/summary",
  cacheMiddleware(600),
  async (req, res, next) => {
    const { guideId } = req.params;

    try {
      // Use aggregation pipeline for efficient calculation
      const summary = await reviews.aggregate([
        {
          $match: {
            guideId: new mongoose.Types.ObjectId(guideId),
            status: "approved",
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
            ratings: {
              $push: "$rating",
            },
          },
        },
        {
          $project: {
            _id: 0,
            averageRating: { $round: ["$averageRating", 1] },
            totalReviews: 1,
            ratingDistribution: {
              5: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r", 5] },
                  },
                },
              },
              4: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r", 4] },
                  },
                },
              },
              3: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r", 3] },
                  },
                },
              },
              2: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r", 2] },
                  },
                },
              },
              1: {
                $size: {
                  $filter: {
                    input: "$ratings",
                    as: "r",
                    cond: { $eq: ["$$r", 1] },
                  },
                },
              },
            },
          },
        },
      ]);

      // If no reviews found, return default structure
      if (summary.length === 0) {
        return res.status(200).json({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      }

      res.status(200).json(summary[0]);
    } catch (error) {
      console.error("Error fetching guide rating summary:", error);
      next(error);
      res.status(500).json({ message: "Error fetching rating summary" });
    }
  }
);

/** @format */

import express from "express";
import { Guide } from "../models/guideModel.js";
import { packages } from "../models/packageModel.js";
import moment from "moment";
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: API endpoints for searching guides and packages
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for guides or packages
 *     tags: [Search]
 *     description: Search for guides or packages with various filters
 *     parameters:
 *       - in: query
 *         name: entityType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Guide, Package]
 *         description: Type of entity to search for (Guide or Package)
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Text to search for in names, descriptions, etc.
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location to filter by
 *       - in: query
 *         name: availability
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter guides by availability (true/false)
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter guides by language
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: integer
 *         description: Minimum duration for packages (in days)
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *         description: Maximum duration for packages (in days)
 *       - in: query
 *         name: minGroupSize
 *         schema:
 *           type: integer
 *         description: Minimum group size for packages
 *       - in: query
 *         name: maxGroupSize
 *         schema:
 *           type: integer
 *         description: Maximum group size for packages
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price for packages
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price for packages
 *       - in: query
 *         name: availableDates
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *         description: Available dates for packages (can be multiple)
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/Guide'
 *                   - $ref: '#/components/schemas/Package'
 *       400:
 *         description: Invalid entity type or missing required parameters
 *       500:
 *         description: Server error
 */
router.get("/", cacheMiddleware(120), async (req, res) => {
  try {
    const {
      location,
      entityType,
      availability,
      language,
      minDuration,
      maxDuration,
      minGroupSize,
      maxGroupSize,
      minPrice,
      maxPrice,
      availableDates,
      searchTerm,
      sortBy,
      sortOrder,
    } = req.query;

    if (!entityType) {
      return res.status(400).json({ message: "Entity type is required" });
    }

    let results;
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    if (entityType === "Guide") {
      // Optimize Guide search
      const query = {};

      // Text search optimization
      if (searchTerm && searchTerm.trim() !== "") {
        const searchRegex = { $regex: searchTerm, $options: "i" };
        query.$or = [
          { username: searchRegex },
          { name: searchRegex },
          { specialization: searchRegex },
        ];
      }

      // Location filter optimization
      if (location && location !== "") {
        query.location = { $regex: location, $options: "i" };
      }

      // Availability filter
      if (availability === "true") {
        query.availability = true;
      }

      // Language filter optimization
      if (language) {
        query.languages = { $regex: language, $options: "i" };
      }

      // Create a base query
      let guideQuery = Guide.find(query);

      // Apply sorting based on user preference
      if (sortBy) {
        const sortOptions = {};

        switch (sortBy) {
          case "rating":
            sortOptions["ratings.averageRating"] = sortDirection;
            break;
          case "experience":
            sortOptions.experience = sortDirection;
            break;
          default:
            sortOptions["ratings.averageRating"] = -1; // Default sort by rating
        }

        guideQuery = guideQuery.sort(sortOptions);
      } else {
        // Default sorting by rating
        guideQuery = guideQuery.sort({ "ratings.averageRating": -1 });
      }

      // Execute the optimized query
      results = await guideQuery.exec();
    } else if (entityType === "Package") {
      // Optimize Package search
      const query = {};

      // Text search optimization
      if (searchTerm && searchTerm.trim() !== "") {
        const searchRegex = { $regex: searchTerm, $options: "i" };
        query.$or = [
          { name: searchRegex },
          { description: searchRegex },
          { highlights: searchRegex },
          { location: searchRegex },
        ];
      }

      // Location filter optimization
      if (location && location !== "") {
        query.location = { $regex: location, $options: "i" };
      }

      // Duration filter optimization
      if (minDuration || maxDuration) {
        query.duration = {};
        if (minDuration) query.duration.$gte = parseInt(minDuration);
        if (maxDuration) query.duration.$lte = parseInt(maxDuration);
      }

      // Group size filter optimization
      if (minGroupSize || maxGroupSize) {
        query.maxGroupSize = {};
        if (minGroupSize) query.maxGroupSize.$gte = parseInt(minGroupSize);
        if (maxGroupSize) query.maxGroupSize.$lte = parseInt(maxGroupSize);
      }

      // Price filter optimization
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      // Available dates filter optimization
      if (availableDates) {
        const dateArray = Array.isArray(availableDates)
          ? availableDates
          : [availableDates];
        query.availableDates = {
          $in: dateArray.map((date) => moment(date).toDate()),
        };
      }

      // Create a base query
      let packageQuery = packages.find(query);

      // Apply sorting based on user preference
      if (sortBy) {
        const sortOptions = {};

        switch (sortBy) {
          case "price":
            sortOptions.price = sortDirection;
            break;
          case "duration":
            sortOptions.duration = sortDirection;
            break;
          case "popularity":
            sortOptions.totalBookings = sortDirection;
            break;
          default:
            sortOptions.price = 1; // Default sort by price low to high
        }

        packageQuery = packageQuery.sort(sortOptions);
      } else {
        // Default sorting by price
        packageQuery = packageQuery.sort({ price: 1 });
      }

      // Execute the optimized query
      results = await packageQuery.exec();
    } else {
      return res.status(400).json({ message: "Invalid entity type" });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error searching", error: error.message });
  }
});

/**
 * @swagger
 * /search/guide-languages:
 *   get:
 *     summary: Get all unique guide languages
 *     tags: [Search]
 *     description: Retrieve a list of all unique languages spoken by guides
 *     responses:
 *       200:
 *         description: List of unique languages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["English", "Spanish", "French", "German"]
 *       500:
 *         description: Server error
 */
router.get("/guide-languages", cacheMiddleware(3600), async (req, res) => {
  try {
    const languages = await Guide.distinct("languages");
    res.json(languages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching languages", error: error.message });
  }
});
/**
 * @swagger
 * /search/guide-locations:
 *   get:
 *     summary: Get all unique guide locations
 *     tags: [Search]
 *     description: Retrieve a list of all unique locations where guides are available
 *     responses:
 *       200:
 *         description: List of unique guide locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 locations:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["New York", "Paris", "Tokyo", "Sydney"]
 *       500:
 *         description: Server error
 */
router.get("/guide-locations", cacheMiddleware(3600), async (req, res) => {
  try {
    const locations = await Guide.distinct("location");
    res.json({ locations: locations });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching guide locations",
        error: error.message,
      });
  }
});

/**
 * @swagger
 * /search/package-locations:
 *   get:
 *     summary: Get all unique package locations
 *     tags: [Search]
 *     description: Retrieve a list of all unique locations where packages are available
 *     responses:
 *       200:
 *         description: List of unique package locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Bali", "Switzerland", "Costa Rica", "Thailand"]
 *       500:
 *         description: Server error
 */
router.get("/package-locations", cacheMiddleware(3600), async (req, res) => {
  try {
    const locations = await packages.distinct("location");
    res.json(locations);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching package locations",
        error: error.message,
      });
  }
});

export default router;

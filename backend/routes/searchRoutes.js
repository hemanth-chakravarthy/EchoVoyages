import express from 'express';
import { Guide } from '../models/guideModel.js';
import { packages } from '../models/packageModel.js';
import moment from 'moment';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Update the main search route to handle filtering by availability, languages, and text search
router.get('/', cacheMiddleware(120), async (req, res) => {
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
            searchTerm
        } = req.query;

        if (!entityType) {
            return res.status(400).json({ message: 'Entity type is required' });
        }

        let results;

        if (entityType === 'Guide') {
            const query = {};

            // Add text search if searchTerm is provided
            if (searchTerm && searchTerm.trim() !== '') {
                const searchRegex = { $regex: searchTerm, $options: 'i' };
                query.$or = [
                    { username: searchRegex },
                    { name: searchRegex },
                    { specialization: searchRegex }
                ];
            }

            // Add location filter if provided
            if (location && location !== '') {
                query.location = { $regex: location, $options: 'i' };
            }

            // Only add the availability filter when explicitly set to true or false.
            if (availability === 'true') {
                query.availability = true;
            }

            if (language) {
                query.languages = { $regex: language, $options: 'i' };
            }

            results = await Guide.find(query);
        } else if (entityType === 'Package') {
            const query = {};

            // Add text search if searchTerm is provided
            if (searchTerm && searchTerm.trim() !== '') {
                const searchRegex = { $regex: searchTerm, $options: 'i' };
                query.$or = [
                    { name: searchRegex },
                    { description: searchRegex },
                    { highlights: searchRegex },
                    { location: searchRegex }
                ];
            }

            // Add location filter if provided
            if (location && location !== '') {
                query.location = { $regex: location, $options: 'i' };
            }

            // Apply filters for packages as per the existing code
            if (minDuration || maxDuration) {
                query.duration = {};
                if (minDuration) query.duration.$gte = parseInt(minDuration);
                if (maxDuration) query.duration.$lte = parseInt(maxDuration);
            }
            if (minGroupSize || maxGroupSize) {
                query.maxGroupSize = {};
                if (minGroupSize) query.maxGroupSize.$gte = parseInt(minGroupSize);
                if (maxGroupSize) query.maxGroupSize.$lte = parseInt(maxGroupSize);
            }
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = parseFloat(minPrice);
                if (maxPrice) query.price.$lte = parseFloat(maxPrice);
            }
            if (availableDates) {
                const dateArray = Array.isArray(availableDates) ? availableDates : [availableDates];
                query.availableDates = { $in: dateArray.map(date => moment(date).toDate()) };
            }

            results = await packages.find(query);
        } else {
            return res.status(400).json({ message: 'Invalid entity type' });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error searching', error: error.message });
    }
});

// Endpoint to fetch all unique languages
router.get('/guide-languages', cacheMiddleware(3600), async (req, res) => {
    try {
        const languages = await Guide.distinct('languages');
        res.json(languages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching languages', error: error.message });
    }
});
// Fetch unique guide locations
router.get('/guide-locations', cacheMiddleware(3600), async (req, res) => {
    try {
        const locations = await Guide.distinct('location');
        res.json({ locations: locations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guide locations', error: error.message });
    }
});

// Fetch unique package locations
router.get('/package-locations', cacheMiddleware(3600), async (req, res) => {
    try {
        const locations = await packages.distinct('location');
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching package locations', error: error.message });
    }
});

export default router;

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
// view all packages
router.get('/',async (req,res) => {
    try {
        const packs = await packages.find({});
        return res.status(200).json({
            count: packs.length,
            data: packs
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})
// view a single package
router.get('/:id',async (req,res) => {
    try {
        let {id} = req.params
        id = id.toString()
        const packs = await packages.findOne({ _id: id });
        return res.status(200).json(packs)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// update package
router.put('/:id',async (req,res) => {
    try {
        const {id} = req.params;
        const result = await packages.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message:" Package not found"})
        }
        return res.status(200).json({message:" package updated"})

    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// delete a package
router.delete('/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const result = await packages.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" package not found"})
        }
        return res.status(200).json({message:" package deleted"})


    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})

export default router;

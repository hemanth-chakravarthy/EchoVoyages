// routes/wishlistRoutes.js
import express from 'express';
import Wishlist from '../models/wishlistModel.js';
import {packages} from '../models/packageModel.js'

const router = express.Router();

// Add to wishlist
router.post('/', async (req, res) => {
    const { customerId, packageId } = req.body;

    try {
        // Check if wishlist entry already exists for this customer and package
        const existingWishlist = await Wishlist.findOne({ customerId, packageId });
        if (existingWishlist) {
            return res.status(400).json({ message: 'Package is already in wishlist.' });
        }

        const newWishlist = new Wishlist({ customerId, packageId });
        const savedWishlist = await newWishlist.save();
        res.status(201).json(savedWishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to wishlist' });
    }
});

// Get wishlist for a specific customer
// In your wishlist route (assuming you're using Express and Mongoose)
router.get('/customer/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const wishlist = await Wishlist.find({ customerId }).populate('packageId');

        if (!wishlist) {
            return res.status(404).json({ message: 'No wishlist found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});



// Remove from wishlist
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Wishlist.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }
        res.status(200).json({ message: 'Wishlist item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing from wishlist' });
    }
});

router.get('/',async (req,res) => {
    try {
        const guides = await Wishlist.find({});
        return res.status(200).json({
            count: guides.length,
            data: guides
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})

export default router;

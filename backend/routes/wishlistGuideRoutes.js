import express from 'express'
import { wishlistGuide } from '../models/wishlistGuideModel.js'

const router = express.Router();

// Add to wishlist
router.post('/', async (req, res,next) => {
    const { customerId, guideId } = req.body;

    try {
        // Check if wishlist entry already exists for this customer and Guide
        const existingWishlist = await wishlistGuide.findOne({ customerId, guideId });
        if (existingWishlist) {
            return res.status(400).json({ message: 'Guide is already in wishlist.' });
        }

        const newWishlist = new wishlistGuide({ customerId, guideId });
        const savedWishlist = await newWishlist.save();
        res.status(201).json(savedWishlist);
    } catch (error) {
        console.error(error);
        next(error);
        res.status(500).json({ message: 'Error adding to wishlist' });
    }
});
router.get('/cust/:customerId', async (req, res,next) => {
    const { customerId } = req.params;
    try {


        // Fetch wishlist for the customer and populate guide details
        const wishlist = await wishlistGuide.find({ customerId }).populate('guideId');

        if (!wishlist || wishlist.length === 0) {
            return res.status(404).json({ message: 'No wishlist found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        next(error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});




// Remove from wishlist
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await wishlistGuide.findByIdAndDelete(id);
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
        const guides = await wishlistGuide.find({});
        return res.status(200).json({
            count: guides.length,
            data: guides
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})

export default router
// routes/wishlistRoutes.js
import express from 'express';
import { Wishlist } from '../models/wishlistModel.js';
import { packages } from '../models/packageModel.js';

const router = express.Router();

// Add package to wishlist
router.post('/add', async (req, res) => {
    try {
        const { customerId, packageId } = req.body;

        let wishlist = await Wishlist.findOne({ customerId });

        // If no wishlist exists for the customer, create one
        if (!wishlist) {
            wishlist = new Wishlist({ customerId, packages: [] });
        }

        // Check if package is already in the wishlist
        if (wishlist.packages.includes(packageId)) {
            return res.status(400).json({ message: 'Package is already in the wishlist' });
        }

        wishlist.packages.push(packageId);
        await wishlist.save();

        res.status(200).json({ message: 'Package added to wishlist', wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding package to wishlist' });
    }
});

// View wishlist
router.get('/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        const wishlist = await Wishlist.findOne({ customerId }).populate('packages');

        if (!wishlist) {
            return res.status(404).json({ message: 'No wishlist found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});

// Remove package from wishlist
router.delete('/remove', async (req, res) => {
    try {
        const { customerId, packageId } = req.body;

        let wishlist = await Wishlist.findOne({ customerId });

        if (!wishlist) {
            return res.status(404).json({ message: 'No wishlist found' });
        }

        wishlist.packages = wishlist.packages.filter((pkg) => pkg.toString() !== packageId);

        await wishlist.save();

        res.status(200).json({ message: 'Package removed from wishlist', wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing package from wishlist' });
    }
});

export default router;

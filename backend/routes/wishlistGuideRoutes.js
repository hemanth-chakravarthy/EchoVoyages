import express from 'express'
import { wishlistGuide } from '../models/wishlistGuideModel.js'

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistGuide:
 *       type: object
 *       required:
 *         - customerId
 *         - guideId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the wishlist item
 *         customerId:
 *           type: string
 *           description: ID of the customer who added the guide to wishlist
 *         guideId:
 *           type: string
 *           description: ID of the guide added to wishlist
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the wishlist item was created
 *       example:
 *         _id: "60d21b4667d0d8992e610c96"
 *         customerId: "60d21b4667d0d8992e610c91"
 *         guideId: "60d21b4667d0d8992e610c93"
 *         createdAt: "2023-05-15T10:30:00Z"
 */

/**
 * @swagger
 * /wishlistGuide:
 *   post:
 *     summary: Add a guide to wishlist
 *     tags: [WishlistGuide]
 *     description: Add a guide to a customer's wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - guideId
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID of the customer
 *               guideId:
 *                 type: string
 *                 description: ID of the guide to add to wishlist
 *     responses:
 *       201:
 *         description: Guide added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistGuide'
 *       400:
 *         description: Guide is already in wishlist
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /wishlistGuide/cust/{customerId}:
 *   get:
 *     summary: Get customer's guide wishlist
 *     tags: [WishlistGuide]
 *     description: Retrieve all guides in a customer's wishlist
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         description: ID of the customer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of wishlist items with populated guide details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the wishlist item
 *                   customerId:
 *                     type: string
 *                     description: ID of the customer
 *                   guideId:
 *                     type: object
 *                     description: Populated guide details
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the guide
 *                       name:
 *                         type: string
 *                         description: Name of the guide
 *                       experience:
 *                         type: number
 *                         description: Years of experience
 *                       languages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Languages spoken by the guide
 *                       profilePicture:
 *                         type: string
 *                         description: Profile picture of the guide
 *       500:
 *         description: Server error
 */
router.get('/cust/:customerId', async (req, res,next) => {
    const { customerId } = req.params;
    try {


        // Fetch wishlist for the customer and populate guide details
        const wishlist = await wishlistGuide.find({ customerId }).populate('guideId');

        // Return empty array instead of 404 when no wishlist is found
        if (!wishlist || wishlist.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        next(error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});




/**
 * @swagger
 * /wishlistGuide/{id}:
 *   delete:
 *     summary: Remove guide from wishlist
 *     tags: [WishlistGuide]
 *     description: Remove a guide from a customer's wishlist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the wishlist item to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wishlist item removed
 *       404:
 *         description: Wishlist item not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /wishlistGuide:
 *   get:
 *     summary: Get all guide wishlist items
 *     tags: [WishlistGuide]
 *     description: Retrieve all guide wishlist items across all customers
 *     responses:
 *       200:
 *         description: List of all guide wishlist items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of wishlist items returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WishlistGuide'
 *       500:
 *         description: Server error
 */
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
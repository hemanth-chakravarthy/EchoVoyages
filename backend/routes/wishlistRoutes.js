// routes/wishlistRoutes.js
import express from 'express';
import Wishlist from '../models/wishlistModel.js';
import {packages} from '../models/packageModel.js'

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Wishlist:
 *       type: object
 *       required:
 *         - customerId
 *         - packageId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the wishlist item
 *         customerId:
 *           type: string
 *           description: ID of the customer who added the package to wishlist
 *         packageId:
 *           type: string
 *           description: ID of the package added to wishlist
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the wishlist item was created
 *       example:
 *         _id: "60d21b4667d0d8992e610c95"
 *         customerId: "60d21b4667d0d8992e610c91"
 *         packageId: "60d21b4667d0d8992e610c85"
 *         createdAt: "2023-05-15T10:30:00Z"
 */

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add a package to wishlist
 *     tags: [Wishlist]
 *     description: Add a package to a customer's wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - packageId
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID of the customer
 *               packageId:
 *                 type: string
 *                 description: ID of the package to add to wishlist
 *     responses:
 *       201:
 *         description: Package added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wishlist'
 *       400:
 *         description: Package is already in wishlist
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /wishlist/customer/{customerId}:
 *   get:
 *     summary: Get customer's wishlist
 *     tags: [Wishlist]
 *     description: Retrieve all packages in a customer's wishlist
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         description: ID of the customer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of wishlist items with populated package details
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
 *                   packageId:
 *                     type: object
 *                     description: Populated package details
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the package
 *                       name:
 *                         type: string
 *                         description: Name of the package
 *                       description:
 *                         type: string
 *                         description: Description of the package
 *                       price:
 *                         type: number
 *                         description: Price of the package
 *                       image:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Images of the package
 *       500:
 *         description: Server error
 */
router.get('/customer/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const wishlist = await Wishlist.find({ customerId }).populate('packageId');

        // Return empty array instead of 404 when no wishlist is found
        if (!wishlist || wishlist.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});



/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     summary: Remove from wishlist
 *     tags: [Wishlist]
 *     description: Remove a package from a customer's wishlist
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

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get all wishlist items
 *     tags: [Wishlist]
 *     description: Retrieve all wishlist items across all customers
 *     responses:
 *       200:
 *         description: List of all wishlist items
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
 *                     $ref: '#/components/schemas/Wishlist'
 *       500:
 *         description: Server error
 */
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

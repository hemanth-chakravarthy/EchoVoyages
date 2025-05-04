import express from 'express'
import { customers } from '../models/customerModel.js';
import { packages } from '../models/packageModel.js';
import { reviews } from '../models/customerReviewModel.js';
import { Guide} from '../models/guideModel.js'
import { bookings } from '../models/bookingModel.js';
import {Agency} from '../models/agencyModel.js'
const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the admin
 *         username:
 *           type: string
 *           description: Username of the admin
 *         password:
 *           type: string
 *           description: Password of the admin
 *         role:
 *           type: string
 *           default: admin
 *           description: Role of the user
 *       example:
 *         _id: "60d21b4667d0d8992e610c99"
 *         username: "admin"
 *         password: "admin123"
 *         role: "admin"
 */
/**
 * @swagger
 * /admin/customers:
 *   get:
 *     summary: Get all customers (Admin)
 *     tags: [Admin]
 *     description: Retrieve a list of all customers (Admin access only)
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of customers returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Server error
 */
router.get('/customers',async (req,res,next) => {
    try {
        const custs = await customers.find({});
        return res.status(200).json({
            count: custs.length,
            data: custs
        })
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
})

/**
 * @swagger
 * /admin/customers/{id}:
 *   delete:
 *     summary: Delete a customer (Admin)
 *     tags: [Admin]
 *     description: Delete a specific customer by ID (Admin access only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the customer to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.delete('/customers/:id', async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await customers.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" User not found"})
        }
        return res.status(200).json({message:" User deleted"})


    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
/**
 * @swagger
 * /admin/customers/{id}:
 *   put:
 *     summary: Update a customer (Admin)
 *     tags: [Admin]
 *     description: Update a specific customer by ID (Admin access only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the customer to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the customer
 *               Name:
 *                 type: string
 *                 description: Full name of the customer
 *               phno:
 *                 type: string
 *                 description: Phone number of the customer
 *               gmail:
 *                 type: string
 *                 description: Email address of the customer
 *               specialization:
 *                 type: string
 *                 description: Travel preference of the customer
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user updated
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.put('/customers/:id',async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await customers.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message:" User not found"})
        }
        return res.status(200).json({message:" user updated"})

    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
/**
 * @swagger
 * /admin/customers/{id}:
 *   get:
 *     summary: Get a customer by ID (Admin)
 *     tags: [Admin]
 *     description: Retrieve a specific customer by ID (Admin access only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the customer to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.get('/customers/:id',async (req,res,next) => {
    try {
        let {id} = req.params
        id = id.toString()
        const custs = await customers.findOne({ _id: id });
        return res.status(200).json(custs)
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})

/**
 * @swagger
 * /admin/packages:
 *   get:
 *     summary: Get all packages (Admin)
 *     tags: [Admin]
 *     description: Retrieve a list of all travel packages (Admin access only)
 *     responses:
 *       200:
 *         description: A list of packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of packages returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
 *       500:
 *         description: Server error
 */
router.get('/packages',async (req,res,next) => {
    try {
        const packs = await packages.find({});
        return res.status(200).json({
            count: packs.length,
            data: packs
        })
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
})
/**
 * @swagger
 * /admin/packages/{id}:
 *   get:
 *     summary: Get a package by ID (Admin)
 *     tags: [Admin]
 *     description: Retrieve a specific travel package by ID (Admin access only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the package to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.get('/packages/:id',async (req,res,next) => {
    try {
        let {id} = req.params
        id = id.toString()
        const packs = await packages.findOne({ _id: id });
        return res.status(200).json(packs)
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
/**
 * @swagger
 * /admin/packages/{id}:
 *   put:
 *     summary: Update a package (Admin)
 *     tags: [Admin]
 *     description: Update a specific travel package by ID (Admin access only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the package to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the travel package
 *               description:
 *                 type: string
 *                 description: Detailed description of the package
 *               price:
 *                 type: number
 *                 description: Price of the package
 *               duration:
 *                 type: number
 *                 description: Duration of the package in days
 *               location:
 *                 type: string
 *                 description: Location of the package
 *               itinerary:
 *                 type: string
 *                 description: Detailed itinerary of the package
 *               highlights:
 *                 type: string
 *                 description: Highlights of the package
 *               maxGroupSize:
 *                 type: number
 *                 description: Maximum group size for the package
 *               guides:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of guide IDs assigned to the package
 *               isActive:
 *                 type: string
 *                 enum: [pending, confirmed, canceled]
 *                 description: Status of the package
 *     responses:
 *       200:
 *         description: Package updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: package updated
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.put('/packages/:id',async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await packages.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message:" Package not found"})
        }
        return res.status(200).json({message:" package updated"})

    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
/**
 * @swagger
 * /admin/packages/{id}:
 *   delete:
 *     summary: Delete a package (Admin)
 *     tags: [Admin]
 *     description: Delete a specific travel package by ID (Admin access only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the package to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: package deleted
 *       404:
 *         description: Package not found
 *       500:
 *         description: Server error
 */
router.delete('/packages/:id', async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await packages.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" package not found"})
        }
        return res.status(200).json({message:" package deleted"})


    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
/**
 * @swagger
 * /admin/reviews:
 *   get:
 *     summary: Get all reviews (Admin)
 *     tags: [Admin]
 *     description: Retrieve a list of all reviews (Admin access only)
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of reviews returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 */
router.get('/reviews',async (req,res,next) => {
    try {
        const revs = await reviews.find({});
        return res.status(200).json({
            count: revs.length,
            data: revs
        })
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
})
/**
 * @swagger
 * /admin/reviews/{id}:
 *   get:
 *     summary: Get a review by ID (Admin)
 *     tags: [Admin]
 *     description: Retrieve a specific review by ID (Admin access only)
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
router.get('/reviews/:id', async (req, res) => {
    try {
        const review = await reviews.findById(req.params.id)
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
 * /admin/reviews/{id}:
 *   put:
 *     summary: Update a review (Admin)
 *     tags: [Admin]
 *     description: Update a specific review by ID (Admin access only)
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
router.put('/reviews/:id', async (req, res) => {
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
 * /admin/reviews/{id}:
 *   delete:
 *     summary: Delete a review (Admin)
 *     tags: [Admin]
 *     description: Delete a specific review by ID (Admin access only)
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
router.delete('/reviews/:id', async (req, res) => {
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
});
/**
 * @swagger
 * /admin/guides:
 *   get:
 *     summary: Get all guides (Admin)
 *     tags: [Admin]
 *     description: Retrieve a list of all guides (Admin access only)
 *     responses:
 *       200:
 *         description: A list of guides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of guides returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Guide'
 *       500:
 *         description: Server error
 */
router.get('/guides',async (req,res,next) => {
    try {
        const guides = await Guide.find({});
        return res.status(200).json({
            count: guides.length,
            data: guides
        })
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
})
/**
 * @swagger
 * /admin/guides/{id}:
 *   put:
 *     summary: Update a guide (Admin)
 *     tags: [Admin]
 *     description: Update a specific guide by ID (Admin access only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guide to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the guide
 *               experience:
 *                 type: number
 *                 description: Years of experience
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Languages spoken by the guide
 *               location:
 *                 type: string
 *                 description: Location of the guide
 *               contact:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     description: Phone number of the guide
 *                   email:
 *                     type: string
 *                     description: Email address of the guide
 *               availability:
 *                 type: boolean
 *                 description: Whether the guide is available
 *               specializations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Specializations of the guide
 *               pricing:
 *                 type: object
 *                 description: Pricing information
 *               bio:
 *                 type: string
 *                 description: Biography of the guide
 *     responses:
 *       200:
 *         description: Guide updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.put('/guides/:id', async (req, res) => {
    try {
        const { name, experience, languages, location, contact, availability, specializations, pricing, bio } = req.body;

        // Update guide fields
        const guide = await Guide.findByIdAndUpdate(
            req.params.id,
            {
                name,
                experience,
                languages,
                location,
                contact,
                availability,
                specializations,
                pricing,
                bio
            },
            { new: true }
        );
        if (!guide) {
            return res.status(404).send({ message: "Guide not found" });
        }
        return res.status(200).send(guide);
    } catch (error) {
        console.log(error);
        next(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /admin/guides/{id}:
 *   get:
 *     summary: Get a guide by ID (Admin)
 *     tags: [Admin]
 *     description: Retrieve a specific guide by ID (Admin access only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guide to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guide details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.get('/guides/:id', async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id)
        if (!guide) {
            return res.status(404).send({ message: "Guide not found" });
        }
        return res.status(200).send(guide);
    } catch (error) {
        console.log(error);
        next(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /admin/guides/{id}:
 *   delete:
 *     summary: Delete a guide (Admin)
 *     tags: [Admin]
 *     description: Delete a specific guide by ID (Admin access only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guide to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guide deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guide deleted successfully
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */
router.delete('/guides/:id', async (req, res) => {
    try {
        const guide = await Guide.findByIdAndDelete(req.params.id);
        if (!guide) {
            return res.status(404).send({ message: "Guide not found" });
        }
        return res.status(200).send({ message: "Guide deleted successfully" });
    } catch (error) {
        console.log(error);
        next(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
/**
 * @swagger
 * /admin/bookings:
 *   get:
 *     summary: Get all bookings (Admin)
 *     tags: [Admin]
 *     description: Retrieve a list of all bookings (Admin access only)
 *     responses:
 *       200:
 *         description: A list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of bookings returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Server error
 */
router.get('/bookings',async (req,res,next) => {
    try {
        const book = await bookings.find({});
        return res.status(200).json({
            count: book.length,
            data: book
        })
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
})

// delete a booking
router.delete('/bookings/:id', async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await bookings.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" Bokking not found"})
        }
        return res.status(200).json({message:" Booking deleted"})


    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
// update booking
router.put('/bookings/:id',async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await bookings.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message:" Booking not found"})
        }
        return res.status(200).json({message:" Booking updated"})

    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
// view a singlebooking
router.get('/bookings/:id',async (req,res,next) => {
    try {
        let {id} = req.params
        id = id.toString()
        const book = await bookings.findOne({ _id: id });
        return res.status(200).json(book)
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }

})
/**
 * @swagger
 * /admin/agency:
 *   get:
 *     summary: Get all agencies (Admin)
 *     tags: [Admin]
 *     description: Retrieve a list of all agencies (Admin access only)
 *     responses:
 *       200:
 *         description: A list of agencies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of agencies returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Agency'
 *       500:
 *         description: Server error
 */
router.get('/agency', async (req, res) => {
    try {
        const agencies = await Agency.find({});
        return res.status(200).json({
            count: agencies.length,
            data: agencies
        });
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({ message: error.message });
    }
});

// Delete an agency
router.delete('/agency/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Agency.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Agency not found" });
        }
        return res.status(200).json({ message: "Agency deleted" });
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({ message: error.message });
    }
});

// Update an agency
router.put('/agency/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Agency.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ message: "Agency not found" });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({ message: error.message });
    }
});

// View a single agency
router.get('/agency/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const agency = await Agency.findById(id);
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }
        return res.status(200).json(agency);
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({ message: error.message });
    }
});

export default router
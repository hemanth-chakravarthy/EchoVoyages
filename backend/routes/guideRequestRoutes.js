import express from 'express';
import { GuideRequest } from '../models/guideRequestModel.js';
import { Guide } from '../models/guideModel.js';
import { packages as Package } from '../models/packageModel.js';
import { Agency } from '../models/agencyModel.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GuideRequest:
 *       type: object
 *       required:
 *         - guideId
 *         - guideName
 *         - initiator
 *         - type
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the guide request
 *         guideId:
 *           type: string
 *           description: ID of the guide
 *         guideName:
 *           type: string
 *           description: Name of the guide
 *         packageId:
 *           type: string
 *           description: ID of the package (for package assignment requests)
 *         packageName:
 *           type: string
 *           description: Name of the package (for package assignment requests)
 *         agencyId:
 *           type: string
 *           description: ID of the agency
 *         agencyName:
 *           type: string
 *           description: Name of the agency
 *         message:
 *           type: string
 *           description: Message included with the request
 *         initiator:
 *           type: string
 *           enum: [guide, agency]
 *           description: Who initiated the request
 *         type:
 *           type: string
 *           enum: [package_assignment, general_collaboration]
 *           description: Type of request
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *           description: Status of the request
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the request was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the request was last updated
 *       example:
 *         _id: "60d21b4667d0d8992e610c98"
 *         guideId: "60d21b4667d0d8992e610c93"
 *         guideName: "Jane Smith"
 *         packageId: "60d21b4667d0d8992e610c85"
 *         packageName: "Adventure in the Alps"
 *         agencyId: "60d21b4667d0d8992e610c88"
 *         agencyName: "Alpine Adventures"
 *         message: "I'm interested in guiding this package"
 *         initiator: "guide"
 *         type: "package_assignment"
 *         status: "pending"
 *         createdAt: "2023-05-15T10:30:00Z"
 *         updatedAt: "2023-05-15T10:30:00Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GuideRequest:
 *       type: object
 *       required:
 *         - guideId
 *         - guideName
 *         - initiator
 *         - type
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the guide request
 *         guideId:
 *           type: string
 *           description: ID of the guide
 *         guideName:
 *           type: string
 *           description: Name of the guide
 *         packageId:
 *           type: string
 *           description: ID of the package (for package assignment requests)
 *         packageName:
 *           type: string
 *           description: Name of the package (for package assignment requests)
 *         agencyId:
 *           type: string
 *           description: ID of the agency
 *         agencyName:
 *           type: string
 *           description: Name of the agency
 *         message:
 *           type: string
 *           description: Message included with the request
 *         initiator:
 *           type: string
 *           enum: [guide, agency]
 *           description: Who initiated the request
 *         type:
 *           type: string
 *           enum: [package_assignment, general_collaboration]
 *           description: Type of request
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *           description: Status of the request
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the request was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the request was last updated
 *       example:
 *         _id: "60d21b4667d0d8992e610c98"
 *         guideId: "60d21b4667d0d8992e610c93"
 *         guideName: "Jane Smith"
 *         packageId: "60d21b4667d0d8992e610c85"
 *         packageName: "Adventure in the Alps"
 *         agencyId: "60d21b4667d0d8992e610c88"
 *         agencyName: "Alpine Adventures"
 *         message: "I'm interested in guiding this package"
 *         initiator: "guide"
 *         type: "package_assignment"
 *         status: "pending"
 *         createdAt: "2023-05-15T10:30:00Z"
 *         updatedAt: "2023-05-15T10:30:00Z"
 */

/**
 * @swagger
 * /guide-requests/guide-to-package:
 *   post:
 *     summary: Create a new guide request (Guide to Package)
 *     tags: [GuideRequests]
 *     description: Submit a request from a guide to be assigned to a specific package
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guideId
 *               - packageId
 *             properties:
 *               guideId:
 *                 type: string
 *                 description: ID of the guide submitting the request
 *               packageId:
 *                 type: string
 *                 description: ID of the package the guide wants to be assigned to
 *               message:
 *                 type: string
 *                 description: Optional message from the guide
 *     responses:
 *       201:
 *         description: Guide request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guide request submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/GuideRequest'
 *       400:
 *         description: Bad request - missing fields, guide already assigned, or duplicate request
 *       404:
 *         description: Guide or package not found
 *       500:
 *         description: Server error
 */
router.post('/guide-to-package', async (req, res) => {
    try {
        const { guideId, packageId, message } = req.body;

        if (!guideId || !packageId) {
            return res.status(400).json({ message: 'Guide ID and Package ID are required' });
        }

        const guide = await Guide.findById(guideId);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        const packageData = await Package.findById(packageId);
        if (!packageData) {
            return res.status(404).json({ message: 'Package not found' });
        }

        const isAssigned = packageData.guides?.some(g => g.toString() === guideId);
        if (isAssigned) {
            return res.status(400).json({ message: 'Guide is already assigned to this package' });
        }

        const existingRequest = await GuideRequest.findOne({
            guideId,
            packageId,
            type: 'package_assignment',
            status: 'pending',
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'A pending request already exists for this guide and package' });
        }

        const newRequest = new GuideRequest({
            guideId,
            guideName: guide.name,
            packageId,
            packageName: packageData.name,
            agencyId: packageData.AgentID, // using the correct field name
            message: message || 'Interested in guiding this package',
            initiator: 'guide',
            type: 'package_assignment',
            status: 'pending',
        });

        const savedRequest = await newRequest.save();

        return res.status(201).json({ message: 'Guide request submitted successfully', data: savedRequest });
    } catch (error) {
        console.error('Error creating guide-to-package request:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /guide-requests/agency-to-guide:
 *   post:
 *     summary: Create a new agency request (Agency to Guide)
 *     tags: [GuideRequests]
 *     description: Submit a request from an agency to a guide for package assignment or general collaboration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agencyId
 *               - guideId
 *             properties:
 *               agencyId:
 *                 type: string
 *                 description: ID of the agency submitting the request
 *               guideId:
 *                 type: string
 *                 description: ID of the guide the agency wants to work with
 *               packageId:
 *                 type: string
 *                 description: ID of the package (required for package_assignment type)
 *               message:
 *                 type: string
 *                 description: Optional message from the agency
 *               type:
 *                 type: string
 *                 enum: [package_assignment, general_collaboration]
 *                 default: package_assignment
 *                 description: Type of request
 *     responses:
 *       201:
 *         description: Agency request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agency request submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/GuideRequest'
 *       400:
 *         description: Bad request - missing fields, guide already assigned, or duplicate request
 *       403:
 *         description: Package does not belong to the agency
 *       404:
 *         description: Agency, guide, or package not found
 *       500:
 *         description: Server error
 */
router.post('/agency-to-guide', async (req, res) => {
    try {
        console.log('Received agency-to-guide request:', req.body);
        const { agencyId, guideId, packageId, message, type } = req.body;
        const requestType = type || 'package_assignment';

        if (!agencyId || !guideId) {
            return res.status(400).json({ message: 'Agency ID and Guide ID are required' });
        }

        if (requestType === 'package_assignment' && !packageId) {
            return res.status(400).json({ message: 'Package ID is required for package assignments' });
        }

        const agency = await Agency.findById(agencyId);
        if (!agency) {
            return res.status(404).json({ message: 'Agency not found' });
        }

        const guide = await Guide.findById(guideId);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        let packageData = null;
        if (requestType === 'package_assignment') {
            if (!packageId) {
                return res.status(400).json({ message: 'Package ID is required for package assignments' });
            }

            try {
                packageData = await Package.findById(packageId);
                if (!packageData) {
                    return res.status(404).json({ message: 'Package not found' });
                }

                console.log('Package data:', packageData);
                console.log('Agency ID:', agencyId);
                console.log('Package AgentID:', packageData.AgentID);

                // Convert ObjectId to string for comparison
                if (packageData.AgentID.toString() !== agencyId) {
                    return res.status(403).json({ message: 'This package does not belong to your agency' });
                }

                // Check if guides array exists
                if (!packageData.guides) {
                    packageData.guides = [];
                }

                const isAssigned = packageData.guides.some(g => g.toString() === guideId);
                if (isAssigned) {
                    return res.status(400).json({ message: 'Guide is already assigned to this package' });
                }
            } catch (packageError) {
                console.error('Error finding package:', packageError);
                return res.status(500).json({ message: 'Error finding package', error: packageError.message });
            }
        }

        const existingRequestQuery = {
            guideId,
            agencyId,
            initiator: 'agency',
            status: 'pending',
            type: requestType,
        };
        if (requestType === 'package_assignment') existingRequestQuery.packageId = packageId;

        const existingRequest = await GuideRequest.findOne(existingRequestQuery);

        if (existingRequest) {
            return res.status(400).json({ message: 'A pending request already exists for this guide' });
        }

        const newRequest = new GuideRequest({
            guideId,
            guideName: guide.name,
            agencyId,
            agencyName: agency.username || agency.name,
            message: message || 'We would like to work with you',
            initiator: 'agency',
            type: requestType,
            status: 'pending',
        });

        if (requestType === 'package_assignment' && packageData) {
            newRequest.packageId = packageId;
            newRequest.packageName = packageData.name;
        }

        const savedRequest = await newRequest.save();

        return res.status(201).json({ message: 'Agency request submitted successfully', data: savedRequest });
    } catch (error) {
        console.error('Error creating agency-to-guide request:', error);
        console.error('Request data:', req.body);

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate request detected' });
        }

        return res.status(500).json({
            message: 'Server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * @swagger
 * /guide-requests:
 *   get:
 *     summary: Get all guide requests
 *     tags: [GuideRequests]
 *     description: Retrieve all guide requests with optional filtering
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by request status
 *       - in: query
 *         name: guideId
 *         schema:
 *           type: string
 *         description: Filter by guide ID
 *       - in: query
 *         name: packageId
 *         schema:
 *           type: string
 *         description: Filter by package ID
 *       - in: query
 *         name: agencyId
 *         schema:
 *           type: string
 *         description: Filter by agency ID
 *       - in: query
 *         name: initiator
 *         schema:
 *           type: string
 *           enum: [guide, agency]
 *         description: Filter by who initiated the request
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [package_assignment, general_collaboration]
 *         description: Filter by request type
 *     responses:
 *       200:
 *         description: List of guide requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of requests returned
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GuideRequest'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const { status, guideId, packageId, agencyId, initiator, type } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (guideId) filter.guideId = guideId;
        if (packageId) filter.packageId = packageId;
        if (agencyId) filter.agencyId = agencyId;
        if (initiator) filter.initiator = initiator;
        if (type) filter.type = type;

        const requests = await GuideRequest.find(filter)
            .populate('guideId', 'name experience languages ratings')
            .populate('packageId', 'name price duration location')
            .sort({ createdAt: -1 });

        return res.status(200).json({ count: requests.length, data: requests });
    } catch (error) {
        console.error('Error fetching guide requests:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /guide-requests/{id}:
 *   get:
 *     summary: Get a guide request by ID
 *     tags: [GuideRequests]
 *     description: Retrieve a specific guide request by ID with populated guide, package, and agency details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guide request to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guide request details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuideRequest'
 *       404:
 *         description: Guide request not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const request = await GuideRequest.findById(id)
            .populate('guideId', 'name experience languages ratings')
            .populate('packageId', 'name price duration location')
            .populate('agencyId', 'username email');

        if (!request) {
            return res.status(404).json({ message: 'Guide request not found' });
        }

        return res.status(200).json(request);
    } catch (error) {
        console.error('Error fetching specific guide request:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /guide-requests/{id}:
 *   put:
 *     summary: Update a guide request status
 *     tags: [GuideRequests]
 *     description: Update the status of a guide request and handle package and guide assignments if approved
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guide request to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: New status for the request
 *     responses:
 *       200:
 *         description: Guide request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request approved successfully
 *                 data:
 *                   $ref: '#/components/schemas/GuideRequest'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Guide request not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Valid status (pending, approved, rejected) is required' });
        }

        const request = await GuideRequest.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Guide request not found' });
        }

        if (request.status === status) {
            return res.status(200).json({ message: `Request is already ${status}`, data: request });
        }

        request.status = status;
        await request.save();

        if (status === 'approved') {
            const packageData = await Package.findById(request.packageId);
            if (packageData && !packageData.guides.includes(request.guideId)) {
                packageData.guides.push(request.guideId);
                await packageData.save();
            }

            const guide = await Guide.findById(request.guideId);
            if (guide) {
                const packageExists = guide.assignedPackages?.some(pkg => pkg.packageId.toString() === request.packageId.toString());
                if (!packageExists) {
                    guide.assignedPackages.push({
                        packageId: request.packageId,
                        packageName: packageData.name,
                        price: packageData.price,
                        status: 'confirmed',
                    });
                    await guide.save();
                }
            }
        }

        return res.status(200).json({ message: `Request ${status} successfully`, data: request });
    } catch (error) {
        console.error('Error updating guide request:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /guide-requests/{id}:
 *   delete:
 *     summary: Delete a guide request
 *     tags: [GuideRequests]
 *     description: Delete a specific guide request by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the guide request to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guide request deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guide request deleted successfully
 *       404:
 *         description: Guide request not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const request = await GuideRequest.findByIdAndDelete(id);

        if (!request) {
            return res.status(404).json({ message: 'Guide request not found' });
        }

        return res.status(200).json({ message: 'Guide request deleted successfully' });
    } catch (error) {
        console.error('Error deleting guide request:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

export default router;

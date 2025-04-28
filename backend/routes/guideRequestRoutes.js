import express from 'express';
import { GuideRequest } from '../models/guideRequestModel.js';
import { Guide } from '../models/guideModel.js';
import { packages as Package } from '../models/packageModel.js';
import { Agency } from '../models/agencyModel.js';

const router = express.Router();

// Create a new guide request (Guide to Package)
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

// Create a new agency request (Agency to Guide)
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

// Get all guide requests (Filterable)
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

// Get specific guide request by ID
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

// Update a guide request status
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

// Delete a guide request
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

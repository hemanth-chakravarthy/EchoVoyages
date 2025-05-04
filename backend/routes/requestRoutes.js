import express from "express";
import { requests } from "../models/requestModel.js";
import { packages } from "../models/packageModel.js";
import { customers } from "../models/customerModel.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       required:
 *         - customerId
 *         - packageId
 *         - price
 *         - duration
 *         - itinerary
 *         - availableDates
 *         - maxGroupSize
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the request
 *         customerId:
 *           type: string
 *           description: ID of the customer making the request
 *         customerName:
 *           type: string
 *           description: Name of the customer making the request
 *         packageId:
 *           type: string
 *           description: ID of the package being requested
 *         packageName:
 *           type: string
 *           description: Name of the package being requested
 *         price:
 *           type: number
 *           description: Requested price for the package
 *         requestType:
 *           type: string
 *           enum: [customization, booking]
 *           description: Type of request (customization or booking)
 *         duration:
 *           type: number
 *           description: Requested duration in days
 *         itinerary:
 *           type: string
 *           description: Requested itinerary details
 *         availableDates:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *           description: Requested available dates
 *         maxGroupSize:
 *           type: number
 *           description: Requested maximum group size
 *         AgentID:
 *           type: string
 *           description: ID of the agency handling the request
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
 *         _id: "60d21b4667d0d8992e610c94"
 *         customerId: "60d21b4667d0d8992e610c91"
 *         customerName: "John Doe"
 *         packageId: "60d21b4667d0d8992e610c85"
 *         packageName: "Adventure in the Alps"
 *         price: 1200
 *         requestType: "customization"
 *         duration: 7
 *         itinerary: "Day 1: Arrival, Day 2: Hiking, Day 3: Skiing..."
 *         availableDates: ["2023-06-15", "2023-06-22"]
 *         maxGroupSize: 5
 *         AgentID: "60d21b4667d0d8992e610c88"
 *         status: "pending"
 *         createdAt: "2023-05-15T10:30:00Z"
 *         updatedAt: "2023-05-15T10:30:00Z"
 */

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a new customization or booking request
 *     tags: [Requests]
 *     description: Submit a new request for package customization or booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - price
 *               - duration
 *               - itinerary
 *               - availableDates
 *               - maxGroupSize
 *               - packageId
 *               - customerId
 *             properties:
 *               price:
 *                 type: number
 *                 description: Requested price for the package
 *               duration:
 *                 type: number
 *                 description: Requested duration in days
 *               itinerary:
 *                 type: string
 *                 description: Requested itinerary details
 *               availableDates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *                 description: Requested available dates
 *               maxGroupSize:
 *                 type: number
 *                 description: Requested maximum group size
 *               packageId:
 *                 type: string
 *                 description: ID of the package being requested
 *               customerId:
 *                 type: string
 *                 description: ID of the customer making the request
 *               requestType:
 *                 type: string
 *                 enum: [customization, booking]
 *                 description: Type of request
 *     responses:
 *       201:
 *         description: Request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Package or customer not found
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res,next) => {
  try {
    // Extract request body fields
    const {
      price,
      duration,
      itinerary,
      availableDates,
      maxGroupSize,
      packageId,
      customerId,
      requestType,
    } = req.body;

    // Check if all required fields are provided
    if (
      !price ||
      !duration ||
      !itinerary ||
      !availableDates ||
      !maxGroupSize ||
      !packageId ||
      !customerId
    ) {
      return res.status(400).send({
        message: "Please provide all required fields",
      });
    }

    // Find the package to get the AgentID
    const packageData = await packages.findById(packageId);
    if (!packageData) {
      return res.status(404).send({
        message: "Package not found",
      });
    }
    const { AgentID } = packageData.AgentID;
    const customerData = await customers.findById(customerId);
    if (!customerData) {
        return res.status(404).send({ message: 'Customer not found' });
    }
    const customerName = customerData.username;
    const packageName = packageData.name;
    // Create a new request object
    const newReq = {
      customerId,
      packageId,
      packageName,
      customerName,
      price,
      requestType,
      duration,
      itinerary,
      availableDates, // Split string into an array
      maxGroupSize,
      AgentID,
      status: "pending",
    };

    // Save the new request in the database
    const savedRequest = await requests.create(newReq);

    // Send the response with the saved request
    return res.status(201).send(savedRequest);
  } catch (error) {
    console.error("Error processing request:", error);
    next(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
});
/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all requests
 *     tags: [Requests]
 *     description: Retrieve all customization and booking requests
 *     responses:
 *       200:
 *         description: List of all requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       404:
 *         description: No requests found
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res,next) => {
  try {
    // Fetch all requests from the database
    const req = await requests.find();

    if (!req || req.length === 0) {
      return res.status(404).json({ message: 'No requests found' });
    }

    res.json({ data: req });
  } catch (error) {
    console.error('Error fetching requests:', error);
    next(error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /requests/agen/{agentid}:
 *   get:
 *     summary: Get requests by agent ID
 *     tags: [Requests]
 *     description: Retrieve all requests for a specific agent
 *     parameters:
 *       - in: path
 *         name: agentid
 *         required: true
 *         description: ID of the agent to get requests for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of requests for the agent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       404:
 *         description: No requests found for this agent
 *       500:
 *         description: Server error
 */
router.get('/agen/:agentid', async (req, res,next) => {
  const { agentID } = req.params; // Get the agentID from the URL parameter

  try {
    // Fetch all requests that match the agentID
    const requestsForAgent = await requests.find({ AgentID: agentID });

    if (!requestsForAgent || requestsForAgent.length === 0) {
      return res.status(404).json({ message: 'No requests found for this agent' });
    }

    res.json({ data: requestsForAgent });
  } catch (error) {
    console.error('Error fetching requests:', error);
    next(error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Get a request by ID
 *     tags: [Requests]
 *     description: Retrieve a specific request by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the request to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res,next) => {
  const { id } = req.params; // Get the requestID from the URL parameter

  try {
    // Fetch the request by its ID
    const request = await requests.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ data: request });
  } catch (error) {
    console.error('Error fetching request:', error);
    next(error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     summary: Update a request
 *     tags: [Requests]
 *     description: Update a specific request by ID, including status changes that can trigger booking updates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the request to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: New status for the request
 *               price:
 *                 type: number
 *                 description: Updated price
 *               duration:
 *                 type: number
 *                 description: Updated duration
 *               itinerary:
 *                 type: string
 *                 description: Updated itinerary
 *               availableDates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *                 description: Updated available dates
 *               maxGroupSize:
 *                 type: number
 *                 description: Updated maximum group size
 *     responses:
 *       200:
 *         description: Request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.put('/:id',async (req,res,next) => {
  try {
      const {id} = req.params;
      const { status } = req.body;

      // Find the request first to get details
      const requestData = await requests.findById(id);
      if (!requestData) {
          return res.status(404).json({message: "Request not found"});
      }

      // Update the request
      const result = await requests.findByIdAndUpdate(id, req.body, { new: true });

      // If the request is being approved, update any related bookings and attach guide to package
      if (status === "approved") {
          try {
              // Import the bookings model, Guide model, and Package model
              const { bookings } = await import('../models/bookingModel.js');
              const { Guide } = await import('../models/guideModel.js');
              const { packages } = await import('../models/packageModel.js');

              // Find any bookings for this customer and package
              const relatedBookings = await bookings.find({
                  customerId: requestData.customerId,
                  packageId: requestData.packageId
              });

              // Update all related bookings to confirmed status
              if (relatedBookings && relatedBookings.length > 0) {
                  for (const booking of relatedBookings) {
                      const updatedBooking = await bookings.findByIdAndUpdate(
                          booking._id,
                          {
                              status: "confirmed",
                              totalPrice: requestData.price // Update price if it changed in the request
                          },
                          { new: true }
                      );

                      // If the booking has a guide, update guide earnings and attach guide to package
                      if (updatedBooking.guideId) {
                          try {
                              // Calculate guide's share (70% of package price)
                              const guideShare = updatedBooking.totalPrice * 0.7;

                              // Get current date info for monthly tracking
                              const now = new Date();
                              const month = now.getMonth() + 1; // JavaScript months are 0-indexed
                              const year = now.getFullYear();

                              // Update guide's earnings
                              const guide = await Guide.findById(updatedBooking.guideId);
                              if (guide) {
                                  // Add to total and pending earnings
                                  guide.earnings.total += guideShare;
                                  guide.earnings.pending += guideShare;

                                  // Add to earnings history
                                  guide.earnings.history.push({
                                      bookingId: updatedBooking._id,
                                      packageId: updatedBooking.packageId,
                                      packageName: updatedBooking.packageName,
                                      customerName: updatedBooking.customerName,
                                      amount: guideShare,
                                      date: now,
                                      status: 'pending'
                                  });

                                  // Check if entry for this month exists
                                  const monthlyEntryIndex = guide.earnings.monthly.findIndex(
                                      entry => entry.month === month && entry.year === year
                                  );

                                  if (monthlyEntryIndex !== -1) {
                                      // Update existing monthly entry
                                      guide.earnings.monthly[monthlyEntryIndex].amount += guideShare;
                                  } else {
                                      // Create new monthly entry
                                      guide.earnings.monthly.push({
                                          month,
                                          year,
                                          amount: guideShare
                                      });
                                  }

                                  // Save the updated guide
                                  await guide.save();
                                  console.log(`Updated guide earnings for booking ${updatedBooking._id}`);

                                  // Attach guide to package if not already attached
                                  const packageData = await packages.findById(updatedBooking.packageId);
                                  if (packageData) {
                                      // Check if guide is already in the guides array
                                      const guideExists = packageData.guides.some(
                                          g => g.toString() === updatedBooking.guideId.toString()
                                      );

                                      if (!guideExists) {
                                          // Add guide to the package's guides array
                                          packageData.guides.push(updatedBooking.guideId);
                                          await packageData.save();
                                          console.log(`Attached guide ${updatedBooking.guideId} to package ${updatedBooking.packageId}`);
                                      }

                                      // Check if package is already in guide's assignedPackages
                                      const packageExists = guide.assignedPackages.some(
                                          pkg => pkg.packageId.toString() === updatedBooking.packageId.toString()
                                      );

                                      if (!packageExists) {
                                          // Add package to guide's assignedPackages
                                          guide.assignedPackages.push({
                                              packageId: updatedBooking.packageId,
                                              packageName: packageData.name,
                                              price: packageData.price,
                                              status: 'confirmed'
                                          });
                                          await guide.save();
                                          console.log(`Added package ${updatedBooking.packageId} to guide's assigned packages`);
                                      }
                                  }
                              }
                          } catch (error) {
                              console.error('Error updating guide earnings or attaching guide to package:', error);
                              // Continue with the process even if earnings update fails
                          }
                      }
                  }
                  console.log(`Updated ${relatedBookings.length} bookings to confirmed status`);
              }
          } catch (bookingError) {
              console.error("Error updating related bookings:", bookingError);
              // Continue with the request update even if booking update fails
          }
      }

      return res.status(200).json({
          message: "Request updated successfully",
          data: result
      });

  } catch (error) {
      console.log(error.message);
      next(error);
      res.status(500).send({message: error.message})
  }
})

export default router;
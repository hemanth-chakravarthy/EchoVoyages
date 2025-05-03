import express from "express";
import { requests } from "../models/requestModel.js";
import { packages } from "../models/packageModel.js";
import { customers } from "../models/customerModel.js";

const router = express.Router();

// Endpoint to handle customization or booking request
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
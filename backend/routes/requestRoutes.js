import express from "express";
import { requests } from "../models/requestModel.js";
import { packages } from "../models/packageModel.js";
import { customers } from "../models/customerModel.js";

const router = express.Router();

// Endpoint to handle customization or booking request
router.post("/", async (req, res) => {
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
    const custData = await packages.findById(customerId);
    if (!packageData) {
      return res.status(404).send({
        message: "Package not found",
      });
    }
    const { AgentID } = packageData.AgentID;
    const { packageName} = packageData.name;
    const customerData = await customers.findById(customerId);
    if (!customerData) {
        return res.status(404).send({ message: 'Customer not found' });
    }
    const customerName = customerData.username;
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
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
});
router.get('/', async (req, res) => {
  try {
    // Fetch all requests from the database
    const req = await requests.find();

    if (!req || req.length === 0) {
      return res.status(404).json({ message: 'No requests found' });
    }

    res.json({ data: req });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/agen/:agentid', async (req, res) => {
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
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id', async (req, res) => {
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
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/:id',async (req,res) => {
  try {
      const {id} = req.params;
      const result = await requests.findByIdAndUpdate(id, req.body);

      if(!result){
          return res.status(404).json({message:" Booking not found"})
      }
      return res.status(200).json({message:" Booking updated"})

  } catch (error) {
      console.log(error.message);
      res.status(500).send({message: error.message})
  }
  
})

export default router;
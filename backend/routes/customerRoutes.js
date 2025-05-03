/** @format */

import express from "express";
import mongoose from "mongoose";
import { customers } from "../models/customerModel.js";
import { Agency } from "../models/agencyModel.js";
import { Guide } from "../models/guideModel.js";
import { Admin } from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const JWT_SECRET = "Voyage_secret";

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - username
 *         - Name
 *         - phno
 *         - gmail
 *         - password
 *         - specialization
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the customer
 *         username:
 *           type: string
 *           description: Username of the customer
 *         Name:
 *           type: string
 *           description: Full name of the customer
 *         phno:
 *           type: string
 *           description: Phone number of the customer
 *         gmail:
 *           type: string
 *           description: Email address of the customer
 *         password:
 *           type: string
 *           description: Hashed password of the customer
 *         role:
 *           type: string
 *           default: customer
 *           description: Role of the user
 *         specialization:
 *           type: string
 *           enum: [luxury, adventure, business, family, budget-friendly, other]
 *           description: Travel preference of the customer
 *         profilePicture:
 *           type: string
 *           description: Path to the customer's profile picture
 *         verificationCode:
 *           type: string
 *           description: Code for email verification
 *         isverified:
 *           type: boolean
 *           description: Whether the customer's email is verified
 *       example:
 *         _id: "60d21b4667d0d8992e610c91"
 *         username: "johndoe"
 *         Name: "John Doe"
 *         phno: "+1234567890"
 *         gmail: "john.doe@example.com"
 *         role: "customer"
 *         specialization: "adventure"
 *         profilePicture: "/public/customerProfiles/profile-1624276806-123456.jpg"
 */

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/customerProfiles";

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "profile-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Serve static files from the public directory
router.use("/public", express.static("public"));

/**
 * @swagger
 * /customers/signup:
 *   post:
 *     summary: Register a new user (customer, guide, or agency)
 *     tags: [Customers]
 *     description: Create a new user account based on the role specified
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - Name
 *               - phno
 *               - gmail
 *               - password
 *               - role
 *               - specialization
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the account
 *               Name:
 *                 type: string
 *                 description: Full name of the user
 *               phno:
 *                 type: string
 *                 description: Phone number
 *               gmail:
 *                 type: string
 *                 description: Email address
 *               password:
 *                 type: string
 *                 description: Password (will be hashed)
 *               role:
 *                 type: string
 *                 enum: [customer, guide, agency]
 *                 description: Role of the user
 *               specialization:
 *                 type: string
 *                 enum: [luxury, adventure, business, family, budget-friendly, other]
 *                 description: Specialization or preference
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Customer'
 *                 - $ref: '#/components/schemas/Guide'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/signup", async (req, res, next) => {
  try {
    if (
      !req.body.username ||
      !req.body.Name ||
      !req.body.phno ||
      !req.body.gmail ||
      !req.body.password ||
      !req.body.role ||
      !req.body.specialization
    ) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (req.body.role == "customer") {
      if (await customers.findOne({ username: req.body.username })) {
        return res.status(404).send({ error: "User already Exists" });
      }

      const newCust = {
        username: req.body.username,
        Name: req.body.Name,
        phno: req.body.phno,
        gmail: req.body.gmail,
        password: hashedPassword,
        role: req.body.role,
        specialization: req.body.specialization,
      };

      const customer = await customers.create(newCust);
      return res.status(201).send(customer);
    } else if (req.body.role == "agency") {
      try {
        // Check if username already exists
        if (await Agency.findOne({ username: req.body.username })) {
          return res.status(404).send({ error: "User already Exists" });
        }

        // Check if email already exists
        if (await Agency.findOne({ gmail: req.body.gmail })) {
          return res.status(404).send({ error: "Email already in use" });
        }

        // Create a new agency using the Mongoose model
        const newAgency = new Agency({
          username: req.body.username,
          name: req.body.Name,
          phno: req.body.phno,
          gmail: req.body.gmail,
          password: hashedPassword,
          role: req.body.role,
          specialization: req.body.specialization
          // contactInfo will be set by the pre-save hook
        });

        // Save the agency
        const agency = await newAgency.save();

        // Return the created agency
        return res.status(201).send(agency);
      } catch (error) {
        console.error("Error creating agency:", error);
        return res.status(500).send({
          error: "Failed to create agency account",
          details: error.message,
          code: error.code,
          stack: error.stack
        });
      }
    } else if (req.body.role == "guide") {
      // Guide creation logic (unchanged)
      if (await Guide.findOne({ username: req.body.username })) {
        return res.status(404).send({ error: "User already Exists" });
      }

      const newGuide = {
        username: req.body.username,
        name: req.body.Name,
        phno: req.body.phno,
        gmail: req.body.gmail,
        password: hashedPassword,
        role: req.body.role,
        specialization: req.body.specialization,
      };

      const guide = await Guide.create(newGuide);
      return res.status(201).send(guide);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/**
 * @swagger
 * /customers/login:
 *   post:
 *     summary: Login for customers, guides, and agencies
 *     tags: [Authentication]
 *     description: Authenticate a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 msg:
 *                   type: string
 *                   description: Success message
 *                 role:
 *                   type: string
 *                   description: Role of the authenticated user
 *       400:
 *         description: Invalid credentials or missing fields
 *       500:
 *         description: Server error
 */
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const user =
      (await customers.findOne({ username })) ||
      (await Agency.findOne({ username })) ||
      (await Guide.findOne({ username }));

    if (!user) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      msg: `${user.role} logged in successfully`,
      role: user.role,
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// Admin login route (unchanged)
router.post("/adminlogin", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (password != admin.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Admin login successful", token: "someAuthToken" });
  } catch (error) {
    console.error("Admin login error:", error);
    next(error);
  }
});

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     description: Retrieve a list of all customers
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
router.get("/", async (req, res, next) => {
  try {
    const custs = await customers.find({});
    return res.status(200).json({
      count: custs.length,
      data: custs,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// Delete a customer (unchanged)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await customers.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// Update customer with profile picture support
router.put("/:id", upload.single("profilePicture"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If a file was uploaded, add the path to the update data
    if (req.file) {
      updateData.profilePicture = req.file.path;
    }

    const result = await customers.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: result,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// Update password route (unchanged)
router.put("/customers/:id/update-password", async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
    const customer = await customers.findById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedPassword;
    await customer.save();

    console.log("Password updated successfully");
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    next(error);
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     description: Retrieve a specific customer by ID
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
router.get("/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    id = id.toString();
    const custs = await customers.findOne({ _id: id });
    return res.status(200).json(custs);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

export default router;

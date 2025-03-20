/** @format */

import express from "express";
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads/profile-pictures";

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
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
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

// Serve static files from the uploads directory
router.use("public/uploads", express.static("uploads"));

// save a customer
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
      // Agency creation logic (unchanged)
      if (await Agency.findOne({ username: req.body.username })) {
        return res.status(404).send({ error: "User already Exists" });
      }

      const newAgency = {
        username: req.body.username,
        name: req.body.Name,
        phno: req.body.phno,
        gmail: req.body.gmail,
        password: hashedPassword,
        specialization: req.body.specialization,
      };

      const agency = await Agency.create(newAgency);
      return res.status(201).send(agency);
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

// Login route (unchanged)
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

// Get all customers (unchanged)
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

// View a single customer (unchanged)
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

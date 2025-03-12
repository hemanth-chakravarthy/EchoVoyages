import express from "express";
import { customers } from "../models/customerModel.js";
import { Agency } from "../models/agencyModel.js";
import { Guide } from "../models/guideModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel.js";
const router = express.Router();
const JWT_SECRET = "Voyage_secret";

//save a customer
router.post("/signup", async (req, res,next) => {
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
        message: "Send all required feilds",
      });
    }
    console.log("Inside");
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
      console.log("DON'T KNOW WHWRE I AM");
      const customer = await customers.create(newCust);
      return res.status(201).send(customer);
    } else if (req.body.role == "agency") {
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

router.post("/login", async (req, res,next) => {
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
    }); // Include role in response
  } catch (err) {
    console.error(err.message);
    next(err);
    res.status(500).send("Server error");
  }
});

router.post("/adminlogin", async (req, res,next) => {
  const { username, password } = req.body;

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Compare the entered password with the stored hashed password

    if (password != admin.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // If the credentials are valid, you can generate a token or proceed
    res.json({ message: "Admin login successful", token: "someAuthToken" });
  } catch (error) {
    console.error("Admin login error:", error);
    next(error);
    res.status(500).json({ error: "Server error" });
  }
});

// get all coustomers
router.get("/", async (req, res,next) => {
  try {
    const custs = await customers.find({});
    return res.status(200).json({
      count: custs.length,
      data: custs,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
    res.status(500).send({ message: error.message });
  }
});

// delete a customer
router.delete("/:id", async (req, res,next) => {
  try {
    const { id } = req.params;
    const result = await customers.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: " User not found" });
    }
    return res.status(200).json({ message: " User deleted" });
  } catch (error) {
    console.log(error.message);
    next(error);
    res.status(500).send({ message: error.message });
  }
});
// update customers
router.put("/:id", async (req, res,next) => {
  try {
    const { id } = req.params;
    const result = await customers.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).json({ message: " User not found" });
    }
    return res.status(200).json({ message: " user updated" });
  } catch (error) {
    console.log(error.message);
    next(error);
    res.status(500).send({ message: error.message });
  }
});
// Update password route
router.put("/customers/:id/update-password", async (req, res,next) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
    // Find the customer by ID
    const customer = await customers.findById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedPassword;
    await customer.save();

    console.log("Password updated successfully");
    res.status(200).json({ message: "Password updated successfully" }); // Added success response
  } catch (error) {
    console.error("Error updating password:", error);
    next(error);
    res.status(500).json({ error: "Server error" });
  }
});

// view a single customer
router.get("/:id", async (req, res,next) => {
  try {
    let { id } = req.params;
    id = id.toString();
    const custs = await customers.findOne({ _id: id });
    return res.status(200).json(custs);
  } catch (error) {
    console.log(error.message);
    next(error);
    res.status(500).send({ message: error.message });
  }
});

export default router;
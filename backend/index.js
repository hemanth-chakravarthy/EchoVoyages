/** @format */
import dotenv from "dotenv";
dotenv.config();
import express, { response } from "express";
import bcrypt from "bcrypt";
import connectDB from "./config/database.js";
import adminRoute from "./routes/adminRoutes.js";
import customerRoute from "./routes/customerRoutes.js";
import packageRoute from "./routes/packageRoutes.js";
import reviewRoute from "./routes/reviewRoutes.js";
import bookingRoute from "./routes/bookingRoute.js";
import guideRoute from "./routes/guideRoutes.js";
import agencyRoutes from "./routes/agencyRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import wishlistGuideRoutes from "./routes/wishlistGuideRoutes.js";
import guideRequestRoutes from "./routes/guideRequestRoutes.js";
import { customers } from "./models/customerModel.js";
import { Agency } from "./models/agencyModel.js";
import { Guide } from "./models/guideModel.js";
import cors from "cors";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import searchRoutes from "./routes/searchRoutes.js";
import requests from "./routes/requestRoutes.js";
import cacheRoutes from "./routes/cacheRoutes.js";
import nodemailer from "nodemailer";
import ErrorHandler from "./ErrorHandler.js";
import swaggerDocs from "./swaggerSetup.js";

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://echovoyages-hr0f.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.json({ status: "success", message: "EchoVoyages API is running" });
});

app.use("/admin", adminRoute);
app.use("/customers", customerRoute);
app.use("/packages", packageRoute);
app.use("/reviews", reviewRoute);
app.use("/bookings", bookingRoute);
app.use("/guides", guideRoute);
app.use("/agency", agencyRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/search", searchRoutes);
app.use("/wishlistGuides", wishlistGuideRoutes);
app.use("/requests", requests);
app.use("/guide-requests", guideRequestRoutes);
app.use("/cache", cacheRoutes);
app.use("/public", express.static("public"));
app.use(ErrorHandler);

// forgot password
app.post("/forgot-password", async (req, res) => {
  const { gmail } = req.body;

  try {
    let user = await customers.findOne({ gmail });
    let userType = "Customer";

    if (!user) {
      user = await Agency.findOne({ gmail });
      userType = "Agency";
    }

    if (!user) {
      user = await Guide.findOne({ gmail });
      userType = "Guide";
    }

    if (!user) {
      console.log("User not found in any database");
      return res.send({ status: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, "Voyage_secret1", {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ksaiananya5104@gmail.com",
        pass: "iiqy lxus jqet vbzh",
      },
    });

    const mailOptions = {
      from: "ksaiananya5104@gmail.com",
      to: gmail,
      subject: "Reset Password Link",
      text: `Hello ${userType},\n\nPlease click the link below to reset your password:\n\n${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${user._id}/${token}\n\nThis link will expire in 1 hour.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.send({ status: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        return res.send({ status: "Success", userType });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.send({ status: "Error", message: error.message });
  }
});
app.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  // Check if the password is provided
  if (!password) {
    return res.status(400).json({ status: "Password is required" });
  }

  jwt.verify(token, "Voyage_secret1", (err, decoded) => {
    if (err) {
      return res.json({ status: "Token is invalid or expired" });
    } else {
      bcrypt
        .hash(password, 12)
        .then((hash) => {
          customers
            .findByIdAndUpdate(id, { password: hash })
            .then(() => res.json({ status: "success" }))
            .catch((err) =>
              res.json({ status: "Database error", error: err.message })
            );
        })
        .catch((err) =>
          res.json({ status: "Error hashing password", error: err.message })
        );
    }
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) res.status(401).json({ message: "Token Not Found" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || "Voyage_secret");
    req.id = data.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  // Initialize Swagger
  swaggerDocs(app);
});

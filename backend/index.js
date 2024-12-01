import express, { response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const mongoURL =
  "mongodb+srv://saiananyakatakam:NLnqR9ifdN8qbVft@cluster0.lbvmb.mongodb.net/EchoVoyages2";
import adminRoute from "./routes/adminRoutes.js";
import customerRoute from "./routes/customerRoutes.js";
import packageRoute from "./routes/packageRoutes.js";
import reviewRoute from "./routes/reviewRoutes.js";
import bookingRoute from "./routes/bookingRoute.js";
import guideRoute from "./routes/guideRoutes.js";
import agencyRoutes from "./routes/agencyRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import wishlistGuideRoutes from "./routes/wishlistGuideRoutes.js";
import { customers } from "./models/customerModel.js";
import cors from "cors";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import searchRoutes from "./routes/searchRoutes.js";
import nodemailer from "nodemailer";
mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
  })
);

app.get("/", (req, res) => {
  res.render("");
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
app.use("/public", express.static("public"));

// forgot password
app.post("/forgot-password", (req, res) => {
  const { gmail } = req.body;

  customers
    .findOne({ gmail: gmail }) // Make sure 'email' matches your schema field
    .then((user) => {
      if (!user) {
        console.log("User not found in database");
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
        to: gmail, // Using the email from request body
        subject: "Reset Password Link",
        text: `Please click the link to reset your password: http://localhost:5173/reset-password/${user._id}/${token}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          return res.send({ status: "Error sending email" });
        } else {
          console.log("Email sent:", info.response);
          return res.send({ status: "Success" });
        }
      });
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.send({ status: "Database error", error: err.message });
    });
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
    const data = jwt.verify(token, "Voyage_secret");
    req.id = data.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}

const port = 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

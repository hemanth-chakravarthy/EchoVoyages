/** @format */
import dotenv from "dotenv";
dotenv.config();

const apiUrl = process.env.VITE_API_URL || "http://localhost:5000";

export default apiUrl;

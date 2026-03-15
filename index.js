import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import taxiPackageRoutes from "./routes/taxiPackageRoutes.js";
import fleetRoutes from "./routes/fleetRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import upcomingTripRoutes from "./routes/upcomingTripRoutes.js";
import featuredPackagesRoutes from "./routes/featuredPackagesRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/taxi-packages", taxiPackageRoutes);
app.use("/api/fleet", fleetRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/upcoming-trips", upcomingTripRoutes);
app.use("/api/featured-packages", featuredPackagesRoutes);
app.use("/api/categories", categoryRoutes);

// Basic Route
app.get("/", (req, res) => {
  res.send("Travel Website API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Dew-Ceylon-Backend
import express from "express";
import {
  getAllUpcomingTrips,
  createUpcomingTrip,
  updateUpcomingTrip,
  deleteUpcomingTrip,
  getUpcomingTripsToggle,
  updateUpcomingTripsToggle
} from "../controllers/upcomingTripController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUpcomingTrips);
router.get("/toggle", getUpcomingTripsToggle);
router.post("/", verifyToken, createUpcomingTrip);
router.put("/toggle", verifyToken, updateUpcomingTripsToggle);
router.put("/:id", verifyToken, updateUpcomingTrip);
router.delete("/:id", verifyToken, deleteUpcomingTrip);

export default router;

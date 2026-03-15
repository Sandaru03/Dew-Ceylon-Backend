import express from "express";
import {
  getAllUpcomingTrips,
  createUpcomingTrip,
  updateUpcomingTrip,
  deleteUpcomingTrip,
} from "../controllers/upcomingTripController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUpcomingTrips);
router.post("/", verifyToken, createUpcomingTrip);
router.put("/:id", verifyToken, updateUpcomingTrip);
router.delete("/:id", verifyToken, deleteUpcomingTrip);

export default router;

import express from "express";
import {
  getFeaturedActivities,
  getFeaturedActivityIds,
  saveFeaturedActivities
} from "../controllers/featuredActivitiesController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFeaturedActivities);
router.get("/ids", verifyToken, getFeaturedActivityIds);
router.put("/", verifyToken, saveFeaturedActivities);

export default router;

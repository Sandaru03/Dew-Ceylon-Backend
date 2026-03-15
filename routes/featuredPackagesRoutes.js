import express from "express";
import {
  getFeaturedPackages,
  getFeaturedIds,
  saveFeaturedPackages,
} from "../controllers/featuredPackagesController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFeaturedPackages);          // public - used by homepage
router.get("/ids", verifyToken, getFeaturedIds); // admin - get current selection
router.put("/", verifyToken, saveFeaturedPackages); // admin - save selection

export default router;

import express from "express";
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";

const router = express.Router();

router.get("/", getActivities);
router.get("/:id", getActivityById);
router.post("/", createActivity); // Consider adding auth middleware here later
router.put("/:id", updateActivity); // Consider adding auth middleware here later
router.delete("/:id", deleteActivity); // Consider adding auth middleware here later

export default router;

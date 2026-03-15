import express from "express";
import { 
  getAllPackages, getPackageById, createPackage, updatePackage, deletePackage 
} from "../controllers/packageController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPackages);
router.get("/:id", getPackageById);
router.post("/", verifyToken, createPackage);
router.put("/:id", verifyToken, updatePackage);
router.delete("/:id", verifyToken, deletePackage);

export default router;

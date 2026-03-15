import express from "express";
import { 
  getAllTaxiPackages, searchTaxiPackages, createTaxiPackage, updateTaxiPackage, deleteTaxiPackage, 
  getUniqueLocations, getCapacities, getVehiclesByCapacity
} from "../controllers/taxiPackageController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllTaxiPackages);
router.get("/locations", getUniqueLocations);
router.get("/capacities", getCapacities);
router.get("/vehicles-by-capacity", getVehiclesByCapacity);
router.get("/search", searchTaxiPackages);
router.post("/", verifyToken, createTaxiPackage);
router.put("/:id", verifyToken, updateTaxiPackage);
router.delete("/:id", verifyToken, deleteTaxiPackage);

export default router;

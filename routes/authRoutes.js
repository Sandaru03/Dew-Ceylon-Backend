import express from "express";
import { login, createAdmin, getAllAdmins, deleteAdmin } from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", verifyToken, createAdmin); // Only admin can create another admin
router.get("/", verifyToken, getAllAdmins);
router.delete("/:id", verifyToken, deleteAdmin);

export default router;

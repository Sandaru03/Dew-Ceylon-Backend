import express from "express";
import { sendBookingEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/send", sendBookingEmail);

export default router;

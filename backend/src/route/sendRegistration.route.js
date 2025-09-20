import express from "express";
import { sendRegistrationSMS } from "../controller/sendRegistration.controller.js";
const router = express.Router();
router.post("/send-registration", sendRegistrationSMS);
export default router;

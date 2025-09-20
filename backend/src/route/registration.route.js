import express from "express";
import {
  getSession,
  registerFarmer,
} from "../controller/registration.controller.js";

const router = express.Router();

router.get("/registration-session/:token", getSession);
router.post("/farmers/register", registerFarmer);

export default router;

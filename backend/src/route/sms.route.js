import { Router } from "express";
import { handleIncomingSMS } from "../controller/sms.controller.js";

const router = Router();

router.route("/incoming").post(handleIncomingSMS);

export default router;

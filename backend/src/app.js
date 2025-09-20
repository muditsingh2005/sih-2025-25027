import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// existing routes
import authRouter from "./route/auth.route.js";

// new routes
import sendRegistrationRouter from "./route/sendRegistration.route.js";
import registrationRouter from "./route/registration.route.js";
import smsRouter from "./route/sms.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// serve static files (e.g. public/register.html)
app.use(express.static("public"));

app.use(cookieParser());

// routes will init here
app.use("/api/v1/auth", authRouter);

// new routes for farmer registration
app.use("/api/v1/auth", sendRegistrationRouter);
app.use("/api/v1/auth", registrationRouter);
app.use("/api/v1/sms", smsRouter);

export { app };

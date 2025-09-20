// import registrationsession from "../models/registration.session.js";
import { RegistrationSession } from "../models/registration.session.js";
import { Farmer } from "../models/farmer.model.js";
import { geocodeVillage } from "../utils/geocode.js";
import twilioClient from "../utils/twilio.client.js";

export async function getSession(req, res) {
  try {
    const { token } = req.params;
    const session = await RegistrationSession.findOne({ token });
    if (!session) return res.status(404).json({ error: "invalid token" });
    if (session.status !== "pending")
      return res.status(400).json({ error: "session not pending" });
    if (session.expiresAt < new Date()) {
      session.status = "expired";
      await session.save();
      return res.status(410).json({ error: "token expired" });
    }
    return res.redirect(`/temp/register.html?token=${token}`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function registerFarmer(req, res) {
  try {
    const { token, phone, name, village, district, state, farmType, crops } =
      req.body;
    if (!token) return res.status(400).json({ error: "token required" });

    const session = await RegistrationSession.findOne({ token });
    if (!session) return res.status(400).json({ error: "invalid token" });
    if (session.status !== "pending")
      return res.status(400).json({ error: "session not pending" });
    if (session.expiresAt < new Date()) {
      session.status = "expired";
      await session.save();
      return res.status(410).json({ error: "token expired" });
    }

    // If already registered
    const existing = await Farmer.findOne({ contact: phone });
    if (existing) {
      session.status = "completed";
      session.data = { farmerID: existing.farmerID };
      await session.save();
      return res.json({
        ok: true,
        message: "Already registered",
        farmerID: existing.farmerID,
      });
    }

    const geo = await geocodeVillage(village, district, state).catch(
      () => null
    );

    const farmerID = "FARM" + Date.now().toString().slice(-8);

    const farmerDoc = {
      farmerID,
      name,
      contact: phone,
      location: {
        village,
        district,
        state,
        geo: geo || {},
      },
      farmType,
      crops:
        typeof crops === "string"
          ? crops.split(",").map((s) => s.trim())
          : crops,
      certifications: [],
    };

    const saved = await Farmer.create(farmerDoc);

    session.status = "completed";
    session.data = { farmerID };
    await session.save();

    // confirmation SMS
    try {
      await twilioClient.messages.create({
        body: `Registration complete. Your Farmer ID: ${farmerID}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    } catch (err) {
      console.warn("Confirmation SMS failed:", err.message);
    }

    return res.json({ ok: true, farmerID });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

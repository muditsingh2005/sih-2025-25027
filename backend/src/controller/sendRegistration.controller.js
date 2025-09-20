import twilioClient from "../utils/twilio.client.js";


export async function sendRegistrationSMS(req, res) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "phone required" });

    const body = "Namaste! To register, please reply with your details in this format: Name: [Your Name], Village: [Your Village], District: [Your District], State: [Your State]";

    const msg = await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

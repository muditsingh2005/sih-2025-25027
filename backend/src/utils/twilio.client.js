import Twilio from "twilio";
const client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
export default client;

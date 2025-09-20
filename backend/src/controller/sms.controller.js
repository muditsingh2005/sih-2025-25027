import twilio from "twilio";

export async function handleIncomingSMS(req, res) {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  const incomingMsg = req.body.Body;
  const from = req.body.From;

  console.log(`Incoming message from ${from}: ${incomingMsg}`);

  // Add your logic to parse the message and create a farmer here.
  // For now, we'll just send a simple reply.

  twiml.message(
    "Thank you for your message. We are processing your registration."
  );
  console.log(incomingMsg);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
}

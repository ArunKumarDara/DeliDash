import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`,
      body: "jkxjxfsfkk",
    });

    console.log("WhatsApp message sent:", response.sid);
    return response;
  } catch (error) {
    console.error("WhatsApp send error:", error.message);
  }
};

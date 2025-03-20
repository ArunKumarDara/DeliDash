import twilio from "twilio";
import otpGenerator from "otp-generator";
import sha256 from "crypto-js/sha256";
import hmacSHA512 from "crypto-js/hmac-sha512";
import Base64 from "crypto-js/enc-base64";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    specialChars: false,
    alphabets: false,
  });
};

export const sendOTP = async (mobile) => {
  try {
    const otp = generateOTP();
    const otpHash = sha256(otp).toString(Base64);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const message = await client.messages.create({
      body: `Your OTP is ${otp}, It is valid for 5 minutes`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });

    console.log("OTP Sent Successfully", message.sid);
    return { success: true, otpHash, otpExpiry };
  } catch (error) {
    console.log("Error Sending OTP", error);
    return { success: false, error };
  }
};

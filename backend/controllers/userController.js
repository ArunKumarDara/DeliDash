import { sendOTP } from "../services/otpService.js";

export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ message: "Mobile Number is required" });
    }
    const response = await sendOTP(mobile);
    res.status((response.success ? 200 : 500).json(response));
  } catch (error) {
    console.log(error);
  }
};

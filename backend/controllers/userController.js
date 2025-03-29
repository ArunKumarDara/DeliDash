import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

export const signup = async (req, res) => {
  try {
    const { phoneNumber, userName, mPin } = req.body;
    if (!phoneNumber || !userName || !mPin) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (mPin.length !== 6 || isNaN(mPin)) {
      return res
        .status(400)
        .json({ success: false, message: "MPIN must be a 6-digit number" });
    }

    let user = await User.findOne({ phoneNumber });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedMpin = await bcrypt.hash(mPin.toString(), 10);

    user = new User({ userName, phoneNumber, mPin: hashedMpin });
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(`Error in signup: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  try {
    const { phoneNumber, mPin } = req.body;

    if (!phoneNumber || !mPin) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and MPIN are required",
      });
    }
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(mPin, user.mPin);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid MPIN" });
    }

    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("authToken", token, {
      httpOnly: true, // Prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // Only send in HTTPS (Production)
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(200)
      .json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error(`Error in login: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-mPin");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userName, phoneNumber } = req.body;
    const userId = req.user.id; // From auth middleware

    // Find user and validate existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate phone number if being updated
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use",
        });
      }
    }

    const updates = {
      ...(userName && { userName }),
      ...(phoneNumber && { phoneNumber }),
      // ...(email && { email }),
      // ...(address && { address }),
    };

    // Update user with new data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-mPin"); // Exclude mPin from response

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(`Error in updateUserProfile: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error(`Error in logout: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

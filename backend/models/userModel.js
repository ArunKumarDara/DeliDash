import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpires: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: user,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

import express from "express";
import {
  login,
  signup,
  getUserProfile,
  updateUserProfile,
  logout,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../middleware/uploadAvatar.js";

const userRouter = express.Router();

userRouter.post("/signup", uploadAvatar, signup);
userRouter.post("/login", login);
userRouter.get("/profile", authenticateUser, getUserProfile);
userRouter.post("/update", authenticateUser, updateUserProfile);
userRouter.post("/logout", authenticateUser, logout);

export default userRouter;

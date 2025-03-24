import express from "express";
import {
  login,
  signup,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/profile", authenticateUser, getUserProfile);
userRouter.post("/update", authenticateUser, updateUserProfile);

export default userRouter;

import express from "express";
import {
  codPayment,
  upiPayment,
  updatePaymentStatus,
} from "../controllers/paymentController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/upi", authenticateUser, upiPayment);
paymentRouter.post("/cod", authenticateUser, codPayment);
paymentRouter.post("/status", authenticateUser, updatePaymentStatus);

export default paymentRouter;

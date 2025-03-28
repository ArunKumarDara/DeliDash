import express from "express";
import {
  addOrder,
  getOrderById,
  getOrders,
  getOrdersByUserId,
  updateStatus,
} from "../controllers/orderController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/add", authenticateUser, addOrder);
orderRouter.get("/getById", authenticateUser, getOrderById);
orderRouter.get("/get", authenticateUser, getOrders);
orderRouter.get("/getByUserId", authenticateUser, getOrdersByUserId);
orderRouter.post("/updateStatus", authenticateUser, updateStatus);

export default orderRouter;

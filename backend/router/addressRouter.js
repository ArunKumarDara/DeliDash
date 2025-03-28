import express from "express";
import {
  addAddress,
  deleteAddress,
  getUserAddresses,
  setDefaultAddress,
  updateAddress,
} from "../controllers/addressController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const addressRouter = express.Router();

addressRouter.post("/add", authenticateUser, addAddress);
addressRouter.get("/get", authenticateUser, getUserAddresses);
addressRouter.post("/update", authenticateUser, updateAddress);
addressRouter.delete("/delete", authenticateUser, deleteAddress);
addressRouter.put(
  "/setDefault/:addressId",
  authenticateUser,
  setDefaultAddress
);

export default addressRouter;

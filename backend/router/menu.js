import express from "express";
import { addMenuItem, getMenuItems } from "../controllers/menuController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const menuRouter = express.Router();

menuRouter.post("/add", authenticateUser, addMenuItem);
menuRouter.get("/get", authenticateUser, getMenuItems);

export default menuRouter;

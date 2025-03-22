import express from "express";
import { addMenuItem, getMenuItems } from "../controllers/menuController.js";

const menuRouter = express.Router();

menuRouter.post("/add", addMenuItem);
menuRouter.get("/get", getMenuItems);

export default menuRouter;

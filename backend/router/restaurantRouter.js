import express from "express";
import {
  addRestaurant,
  getRestaurants,
} from "../controllers/restaurantController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const restaurantRouter = express.Router();

restaurantRouter.post("/add", addRestaurant);

restaurantRouter.get("/get", authenticateUser, getRestaurants);

export default restaurantRouter;

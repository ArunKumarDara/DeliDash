import express from "express";
import {
  addRestaurant,
  getRestaurantById,
  getRestaurants,
} from "../controllers/restaurantController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const restaurantRouter = express.Router();

restaurantRouter.post("/add", addRestaurant);

restaurantRouter.get("/get", authenticateUser, getRestaurants);
restaurantRouter.get("/getById", authenticateUser, getRestaurantById);

export default restaurantRouter;

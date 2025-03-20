import express from "express";
import {
  addRestaurant,
  getRestaurants,
} from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

restaurantRouter.post("/add", addRestaurant);

restaurantRouter.get("/get", getRestaurants);

export default restaurantRouter;

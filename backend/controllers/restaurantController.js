import { Restaurant } from "../models/restaurantModel.js";

export const addRestaurant = async (req, res) => {
  try {
    const { name, phoneNumber, cuisineType, rating, location } = req.body;

    if (!name || !phoneNumber || !cuisineType || !location?.coordinates) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingRestaurant = await Restaurant.findOne({ phoneNumber });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already exists with this phone number",
      });
    }

    const restaurant = await Restaurant.create({
      name,
      phoneNumber,
      cuisineType,
      rating: rating || 0, // Default rating if not provided
      location,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant added successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getRestaurants = async (req, res) => {};

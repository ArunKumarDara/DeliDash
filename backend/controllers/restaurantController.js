import Restaurant from "../models/restaurantModel.js";

// || !location?.coordinates

export const addRestaurant = async (req, res) => {
  try {
    const { name, phoneNumber, cuisineType, rating, location, address } =
      req.body;

    if (!name || !phoneNumber || !cuisineType) {
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
      address,
      phoneNumber,
      cuisineType,
      rating: rating || 0,
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

export const getRestaurants = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.longitude && req.query.latitude) {
      const longitude = parseFloat(req.query.longitude);
      const latitude = parseFloat(req.query.latitude);
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 5000,
        },
      };
    }

    const restaurants = await Restaurant.find(query).skip(skip).limit(limit);

    const totalRestaurants = await Restaurant.countDocuments(query);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      total: totalRestaurants,
      page,
      totalPages: Math.ceil(totalRestaurants / limit),
      data: restaurants,
    });
  } catch (error) {
    console.error("❌ Error fetching restaurants:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

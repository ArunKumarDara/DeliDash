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

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" }; // Use the search term to filter by restaurant name
    }

    if (req.query.cuisines) {
      query.cuisineType = { $in: req.query.cuisines.split(",") }; // Support multiple cuisines
    }

    if (req.query.ratings) {
      const ratings = req.query.ratings.split(",").map(Number);
      query.rating = { $in: ratings }; // Support multiple ratings
    }

    if (req.query.priceRange) {
      const [minPrice, maxPrice] = req.query.priceRange.split(",");
      query.price = { $gte: minPrice, $lte: maxPrice }; // Assuming you have a price field in your model
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

export const getRestaurantById = async (req, res) => {
  try {
    const restaurantId = req.query.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error("❌ Error fetching restaurant:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

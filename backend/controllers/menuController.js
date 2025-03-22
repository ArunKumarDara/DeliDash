import MenuItem from "../models/menuItemModel.js";
import Restaurant from "../models/restaurantModel.js"; // Assuming you have a Restaurant model

export const addMenuItem = async (req, res) => {
  const {
    restaurantId,
    name,
    price,
    isVeg,
    available,
    isBestseller,
    isSpicy,
    description,
  } = req.body;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const newMenuItem = new MenuItem({
      restaurantId,
      name,
      price,
      isVeg,
      available,
      isBestseller,
      isSpicy,
      description,
    });

    await newMenuItem.save();

    return res.status(201).json({
      message: "Menu item added successfully",
      menuItem: newMenuItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add menu item", error });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    console.log(restaurantId);
    const { page = 1, limit = 10 } = req.query;

    const menuItems = await MenuItem.find({ restaurantId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const totalItems = await MenuItem.countDocuments({ restaurantId });

    return res.status(200).json({
      success: true,
      message: "Menu items fetched successfully",
      data: menuItems,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch menu items", error });
  }
};

import Order from "../models/orderModel.js";

export const addOrder = async (req, res) => {
  try {
    const {
      addressId,
      deliveryTime,
      deliveryInstructions,
      menuItems,
      totalAmount,
      paymentMethod,
    } = req.body;

    // Validate request body
    if (
      !addressId ||
      !deliveryTime ||
      !menuItems ||
      !totalAmount ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      addressId,
      deliveryTime,
      deliveryInstructions,
      menuItems,
      totalAmount,
      paymentMethod,
    });
    let savedOrder = await newOrder.save();

    savedOrder = await savedOrder.populate([
      { path: "menuItems.item", model: "MenuItem" },
      { path: "menuItems.restaurant", model: "Restaurant" },
      { path: "addressId", model: "Address" },
    ]);

    return res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("menuItems.item")
      .populate("menuItems.restaurant")
      .populate("addressId");
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    console.log(orderId);

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId)
      .populate("menuItems.item")
      .populate("menuItems.restaurant")
      .populate("addressId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await Order.find({ userId })
      .populate("menuItems.item")
      .populate("menuItems.restaurant")
      .populate("addressId");

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

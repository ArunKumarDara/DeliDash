import Order from "../models/orderModel.js";

export const addOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      addressId,
      deliveryTime,
      deliveryInstructions,
      menuItems,
      totalAmount,
      payment,
    } = req.body;

    // Validate request body
    if (!addressId || !deliveryTime || !menuItems || !totalAmount || !payment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log(addressId, deliveryTime, menuItems, totalAmount, payment);

    const data = {
      merchantId: process.env.MERCHANT_ID,
      merchantTransactionId: payment.transactionId,
      amount: totalAmount * 100,
      redirectURL: `http://localhost:5173/order-confirmation?id=${payment.merchantTransactionId}`,
      redirectMode: "POST",
      mobileNumber: "3444",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const keyIndex = 1;
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");

    const string = payloadMain + `/pg/v1/pay` + process.send.SALT_KEY;

    const sha256 = crypto.createHash(sha256).update(string).digest("hex");

    const checksum = sha256 + "###" + process.env.SALT_INDEX;

    // const newOrder = new Order({
    //   addressId,
    //   deliveryTime,
    //   deliveryInstructions,
    //   menuItems,
    //   totalAmount,
    //   paymentMethod,
    //   userId,
    // });
    // let savedOrder = await newOrder.save();

    // savedOrder = await savedOrder.populate([
    //   { path: "menuItems.item", model: "MenuItem" },
    //   { path: "menuItems.restaurant", model: "Restaurant" },
    //   { path: "addressId", model: "Address" },
    // ]);

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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("menuItems.item")
      .populate("menuItems.restaurant")
      .populate("addressId")
      .populate("payment");

    const totalOrders = await Order.countDocuments();
    return res.status(200).json({
      success: true,
      count: orders.length,
      total: totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      page,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.query.orderId;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId)
      .populate("menuItems.item")
      .populate("menuItems.restaurant")
      .populate("addressId")
      .populate("payment");

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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await Order.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("menuItems.item")
      .populate("menuItems.restaurant")
      .populate("addressId");

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json({
      success: true,
      count: orders.length,
      page,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate request body
    if (!orderId || !status) {
      return res
        .status(400)
        .json({ message: "Order ID and status are required" });
    }

    // Check if the status is valid
    const validStatuses = [
      "placed",
      "confirmed",
      "preparing",
      "on the way",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the order and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      { status: status },
      { new: true, runValidators: true }
    )
      .populate("menuItems.item")
      .populate("menuItems.restaurant")
      .populate("addressId");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

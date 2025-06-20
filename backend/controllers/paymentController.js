import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import { sendWhatsAppMessage } from "../utils/twilio.js";
import twilio from "twilio";

dotenv.config();

// Initiate PhonePe payment
export const upiPayment = async (req, res) => {
  const {
    amount,
    MUID,
    addressId,
    deliveryInstructions,
    deliveryTime,
    menuItems,
    paymentMethod,
    transactionId,
  } = req.body;
  const userId = req.user.id;

  const data = {
    merchantUserId: userId,
    merchantId: process.env.MERCHANT_ID,
    merchantTransactionId: transactionId,
    name: "Arun",
    number: "9100401610",
    amount: amount * 100,
    redirectUrl: `http://localhost:5173/order-confirmation?id=${transactionId}`,
    redirectMode: "POST",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payload = JSON.stringify(data);
  const payloadMain = Buffer.from(payload).toString("base64");
  const string = payloadMain + "/pg/v1/pay" + process.env.SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");

  const checkSum = sha256 + "###" + process.env.KEY_INDEX;
  const options = {
    method: "POST",
    url: `${process.env.PHONE_PE_HOST_URL}/pg/v1/pay`,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "X-VERIFY": checkSum,
    },
    data: {
      request: payloadMain,
    },
  };
  try {
    const response = await axios.request(options);
    res.status(200).json({
      msg: "OK",
      url: response.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.log("error in payment", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

export const codPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { addressId, deliveryTime, deliveryInstructions, menuItems, amount } =
      req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found");
    }
    const payment = new Payment({
      userId,
      orderId: new mongoose.Types.ObjectId(),
      paymentMethod: "Cash on Delivery",
      amount,
      status: "pending",
    });

    const order = new Order({
      userId,
      addressId,
      deliveryTime,
      deliveryInstructions,
      menuItems,
      totalAmount: amount,
      status: "placed",
      payment: payment._id,
    });

    payment.orderId = order._id;

    await payment.save({ session });
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    const itemSummary = menuItems
      .map(
        (menuItem) =>
          `${menuItem.item.name} x${menuItem.quantity} (₹${
            menuItem.item.price * menuItem.quantity
          })`
      )
      .join("\n");
    const orderDate = new Date().toLocaleDateString("en-GB");
    const orderTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage = `Hi ${user.userName}, your order of ${itemSummary} totaling ₹${amount} has been placed successfully on ${orderDate} at ${orderTime}.`;
    await sendWhatsAppMessage(
      `+91${user.phoneNumber.replace(/\D/g, "")}`,
      userMessage
    );

    const adminMessage = `New order placed by ${user.userName}: ${itemSummary} totaling ₹${amount} on ${orderDate} at ${orderTime}.`;
    await sendWhatsAppMessage(
      process.env.ADMIN_PHONE.replace(/\D/g, ""),
      adminMessage
    );

    const orderDetailsMessage =
      `✨ *Order Placed!* 🎉\n\n` +
      `🧾 *ORDER #${order._id.toString().slice(-6)}*\n` +
      `───────────────────\n\n` +
      `👨‍🍳 *Customer Details*\n` +
      `Name: ${user.userName}\n` +
      `Phone: +91${user.phoneNumber}\n\n` +
      `🍽️ *Order Summary*\n`;

    // Format items with better spacing and alignment
    const itemDetails = menuItems
      .map(
        (menuItem) =>
          `${menuItem.item.name} x${menuItem.quantity} (₹${
            menuItem.item.price * menuItem.quantity
          })`
      )
      .join("\n");

    const orderFooter =
      `\n───────────────────\n` +
      `💸 *Total Amount:* ₹${amount}\n\n` +
      `⏱️ *Order Details*\n` +
      `📅 Placed: ${orderDate} at ${orderTime}\n` +
      `🕒 Delivery: ${deliveryTime}\n` +
      `💰 Payment: Cash on Delivery\n` +
      `🔄 Status: Order Placed\n\n` +
      `📍 *Delivery Instructions*\n` +
      `${deliveryInstructions || "None provided"}\n\n` +
      `🙏 Thank you for ordering with us! Your delicious food is being prepared. Track your order status in the app.\n\n` +
      `❓ Need help? Reply to this message or call our customer support.`;
    const fullOrderMessage = orderDetailsMessage + itemDetails + orderFooter;
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = twilio(accountSid, authToken);
      await client.messages.create({
        from: "whatsapp:+14155238886",
        to: `whatsapp:+91${user.phoneNumber.replace(/\D/g, "")}`,
        body: fullOrderMessage,
      });
      console.log("Twilio template message sent successfully");
    } catch (twilioError) {
      console.error("Error sending Twilio template message:", twilioError);
      // Continue with response even if Twilio message fails
    }

    res.status(201).json({
      success: true,
      message: "COD order placed successfully",
      orderId: order._id,
      paymentId: payment._id,
      paymentStatus: "pending",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("COD order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create COD order",
      error: error.message,
    });
  }
};

// controllers/paymentController.ts
export const updatePaymentStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { paymentId, status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true, session }
    );

    if (!payment) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    await session.commitTransaction();
    res.json({ success: true, payment });
  } catch (error) {
    await session.abortTransaction();
    console.error("Payment status update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

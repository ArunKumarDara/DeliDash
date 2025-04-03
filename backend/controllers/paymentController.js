import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";

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
  console.log("url", process.env.PHONE_PE_HOST_URL);
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
    console.log(response.data.data.instrumentResponse.redirectInfo.url);
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

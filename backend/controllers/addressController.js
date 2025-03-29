import Address from "../models/addressModel.js";
import mongoose from "mongoose";

export const addAddress = async (req, res) => {
  try {
    const { address, phoneNumber, type, isDefault, receiverName } = req.body;
    const userId = req.user.id; // Extract user ID from authenticated request

    if (!address || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Address and phone number are required",
      });
    }

    // If the new address is set as default, update previous addresses
    if (isDefault) {
      await Address.updateMany(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    // Create a new address
    const newAddress = new Address({
      receiverName,
      userId,
      phoneNumber,
      address,
      type,
      isDefault: isDefault || false, // Default to false if not provided
    });

    await newAddress.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error(`Error in addAddress: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const addresses = await Address.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalItems = await Address.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      page,
      data: addresses,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.error(`Error in getUserAddresses: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.query.addressId;
    const userId = req.user.id;

    const existingAddress = await Address.findOne({ _id: addressId, userId });

    if (!existingAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    await Address.findByIdAndDelete(addressId);

    return res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error(`Error in deleteAddress: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { address, phoneNumber, type, isDefault } = req.body;
    const { addressId } = req.params;
    const userId = req.user.id;

    const existingAddress = await Address.findOne({ _id: addressId, userId });

    if (!existingAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { $set: { address, phoneNumber, type, isDefault } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error(`Error in updateAddress: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    // First verify the address exists and belongs to the user
    const address = await Address.findOne({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found or doesn't belong to user",
      });
    }

    // If the address is already default, no need to proceed
    if (address.isDefault) {
      return res.status(200).json({
        success: true,
        message: "Address is already set as default",
        address,
      });
    }

    // Start a transaction to ensure atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Set all other addresses to non-default
      await Address.updateMany(
        { userId, _id: { $ne: addressId } },
        { $set: { isDefault: false } },
        { session }
      );

      // 2. Set the selected address as default
      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        { $set: { isDefault: true } },
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Address set as default successfully",
        address: updatedAddress,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error(`Error in setDefaultAddress: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

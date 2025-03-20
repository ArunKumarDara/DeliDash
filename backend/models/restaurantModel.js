import { timeStamp } from "console";
import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  cuisineType: {
    type: String,
    enum: ["Indian", "Chinese", "Fast Food", "Other"],
    default: "Other",
    index: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    index: -1,
  },
  createdAt: { type: Date, default: Date.now, index: true },
  location: {
    type: { String, enum: ["point"], default: "point" },
    coordinates: { type: [Number], required: true, index: "2dsphere" },
  },
});

restaurantSchema.index({ name: 1, cuisineType: 1 });

export default mongoose.model("Restaurant", restaurantSchema);

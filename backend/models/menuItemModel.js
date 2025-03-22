import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isBestseller: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  price: { type: Number, required: true },
  isVeg: { type: Boolean, default: true, required: true },
  available: { type: Boolean, default: true },
});

export default mongoose.model("MenuItem", menuItemSchema);

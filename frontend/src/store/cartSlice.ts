import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isSpicy?: boolean;
  isBestseller?: boolean;
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
  cuisineType: string;
  rating: number;
  location?: string;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
  restaurant: Restaurant;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        item: MenuItem;
        restaurant: Restaurant;
      }>
    ) => {
      const { item, restaurant } = action.payload;
      const existingItem = state.items.find((i) => i.item._id === item._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ item, quantity: 1, restaurant });
      }
      state.totalAmount += item.price;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(
        (item) => item.item._id === action.payload
      );
      if (existingItem) {
        state.totalAmount -= existingItem.item.price;
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(
            (item) => item.item._id !== action.payload
          );
        } else {
          existingItem.quantity -= 1;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

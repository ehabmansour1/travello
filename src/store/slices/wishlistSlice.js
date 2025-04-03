import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const tour = action.payload;
      if (!state.items.find((item) => item.id === tour.id)) {
        state.items.push(tour);
      }
    },
    removeFromWishlist: (state, action) => {
      const tourId = action.payload;
      state.items = state.items.filter((item) => item.id !== tourId);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlist = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (state, tourId) =>
  state.wishlist.items.some((item) => item.id === tourId);

export default wishlistSlice.reducer;

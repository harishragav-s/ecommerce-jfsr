import { createSlice } from "@reduxjs/toolkit";

const KEY = "wishlist";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function save(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // storage unavailable (private mode) - wishlist just won't persist
  }
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: load() },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const id = product.id || product._id;
      const exists = state.items.some((p) => (p.id || p._id) === id);
      state.items = exists
        ? state.items.filter((p) => (p.id || p._id) !== id)
        : [
            ...state.items,
            {
              id,
              title: product.title,
              image: product.image,
              brand: product.brand,
              category: product.category,
              price: product.price,
              salePrice: product.salePrice,
              totalStock: product.totalStock,
            },
          ];
      save(state.items);
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

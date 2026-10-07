import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { cartOpen: false },
  reducers: {
    setCartOpen: (state, action) => {
      state.cartOpen = action.payload;
    },
  },
});

export const { setCartOpen } = uiSlice.actions;
export default uiSlice.reducer;

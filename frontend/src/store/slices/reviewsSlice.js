import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewsApi } from "@/api";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk("reviews/add", (formData) =>
  reviewsApi.addReview(formData)
);

export const getReviews = createAsyncThunk("reviews/get", (productId) =>
  reviewsApi.getReviews(productId)
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;

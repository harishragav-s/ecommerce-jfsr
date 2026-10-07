import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { featuresApi } from "@/api";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk("features/get", () =>
  featuresApi.getFeatureImages()
);

export const addFeatureImage = createAsyncThunk("features/add", (image) =>
  featuresApi.addFeatureImage(image)
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      });
  },
});

export default commonSlice.reducer;

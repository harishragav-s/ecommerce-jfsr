import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addressesApi } from "@/api";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk("addresses/add", (formData) =>
  addressesApi.addAddress(formData)
);

export const fetchAllAddresses = createAsyncThunk("addresses/fetchAll", (userId) =>
  addressesApi.getAddresses(userId)
);

export const editaAddress = createAsyncThunk(
  "addresses/edit",
  ({ userId, addressId, formData }) =>
    addressesApi.updateAddress(userId, addressId, formData)
);

export const deleteAddress = createAsyncThunk(
  "addresses/delete",
  ({ userId, addressId }) => addressesApi.deleteAddress(userId, addressId)
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;

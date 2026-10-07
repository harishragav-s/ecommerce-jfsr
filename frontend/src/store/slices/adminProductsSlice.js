import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productsApi } from "@/api";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk("adminProducts/add", (formData) =>
  productsApi.adminAddProduct(formData)
);

export const fetchAllProducts = createAsyncThunk("adminProducts/fetchAll", () =>
  productsApi.adminGetProducts()
);

export const editProduct = createAsyncThunk("adminProducts/edit", ({ id, formData }) =>
  productsApi.adminEditProduct(id, formData)
);

export const deleteProduct = createAsyncThunk("adminProducts/delete", (id) =>
  productsApi.adminDeleteProduct(id)
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;

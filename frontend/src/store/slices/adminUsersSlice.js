import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { usersApi } from "@/api";

const initialState = { isLoading: false, userList: [] };

export const fetchAllUsers = createAsyncThunk("users/fetchAll", () =>
  usersApi.adminGetUsers()
);

export const deleteUser = createAsyncThunk("users/delete", (id) =>
  usersApi.adminDeleteUser(id)
);

const AdminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.userList = [];
      });
  },
});

export default AdminUsersSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../app/api";

export const initialState = {
  users: [""],
  requests:[""],
  message:"",
  status: "rejected", // pending || idle || rejected
  error: null,
};

export const getFriendsList = createAsyncThunk("user/friends", async () => {
  const response = await api.get("/user/friends");
  return response.data;
});


const friendsListSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFriendsList.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getFriendsList.fulfilled, (state, action) => {
        state.status = "idle";
        state.users = action.payload.users;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(getFriendsList.rejected, (state, action) => {
        state.error = action.error;
        state.users = initialState.users;
        state.status = "rejected";
      })
  },
});

export default friendsListSlice.reducer;

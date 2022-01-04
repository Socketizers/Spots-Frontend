import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../app/api";

export const initialState = {
  users: [""],
  requests:[""],
  message:"",
  seen:false,
  status: "rejected", // pending || idle || rejected
  error: null,
};


export const getFriendsRequest = createAsyncThunk("friends/new-request", async () => {
  const response = await api.get("/friends/new-request");
  console.log("requests=======>",response.data.users);
  return response.data.users;
});


const friendsRequestsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    reqSeen: (state) => {
      state.seen = true;
},

  },
  extraReducers: (builder) => {
    builder
      .addCase(getFriendsRequest.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getFriendsRequest.fulfilled, (state, action) => {
        state.status = "idle";
        state.users = action.payload;
        state.message = action.payload;
        state.error = null;
        state.seen=false;
      })
      .addCase(getFriendsRequest.rejected, (state, action) => {
        state.error = action.error;
        state.users = initialState.users;
        state.status = "rejected";
      })
  },
});

export const {reqSeen} = friendsRequestsSlice.actions;
export default friendsRequestsSlice.reducer;

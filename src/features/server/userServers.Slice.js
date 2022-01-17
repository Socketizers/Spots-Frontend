import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../app/api";

export const initialState = {
  servers: [],
  subscribedServers: [],
  status: "", // pending || idle || rejected
  error: null,
};

export const getUserServers = createAsyncThunk(
  "server/getUserServers",
  async () => {
    const response = await api.get("/user/servers");
    return response.data;
  }
);

export const getSubscribedServers = createAsyncThunk(
  "server/getUserServers",
  async () => {
    const response = await api.get("/user/servers");
    return response.data;
  }
);

const userServersSlice = createSlice({
  name: "server",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserServers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getUserServers.fulfilled, (state, action) => {
        // action.payload.map(server => {
        //   if(server.image){server.image = `https://socketizers.herokuapp.com/${server.image}`}
        // })
        state.status = "idle";
        state.servers = action.payload;
        state.error = null;
      })
      .addCase(getUserServers.rejected, (state, action) => {
        state.error = action.error;
        state.servers = initialState.servers;
        state.status = "rejected";
      });
  },
});

export default userServersSlice.reducer;

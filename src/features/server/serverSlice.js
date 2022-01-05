import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../app/api";
import logo from "../assets/SPOTSLOGO-PPS.png"

export const initialState = {
  servers: [],
  status: "", // pending || idle || rejected
  error: null,
};

export const getAllServers = createAsyncThunk(
  "server/getAllServers",
  async () => {
    const response = await api.get("/server");
    response.data.forEach(server => {
      if(!server.image) {server.image = logo}
    })
    return response.data;
  }
);

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllServers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getAllServers.fulfilled, (state, action) => {
        state.status = "idle";
        state.servers = action.payload;
        state.error = null;
      })
      .addCase(getAllServers.rejected, (state, action) => {
        state.error = action.error;
        state.servers = initialState.servers;
        state.status = "rejected";
      });
  },
});

export default serverSlice.reducer;

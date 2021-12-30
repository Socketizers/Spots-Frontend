import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import base64 from "base-64";
// import jwt from "jsonwebtoken";
import cookie from "react-cookies";
import api from "../../app/api";
// Sign-In API
const signInApi = async (username, password) => {
  return await axios.post(
    "https://socketizers.herokuapp.com/sign-in",
    {},
    {
      headers: {
        Authorization: `Basic ${base64.encode(`${username}:${password}`)}`,
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};

// Sign-Up API
const signUpApi = async (body) => {
  return await axios.post("https://socketizers.herokuapp.com/sign-up", body);
};

export const initialState = {
  user: {
    email: "",
    username: "",
    fullName: "",
    image: "",
    onlineStatus: false,
    lastSeen: "",
    friends: [],
    story: {},
  },
  // pending || idle || rejected
  status: "idle",
  error: null,
};
export const signIn = createAsyncThunk(
  "auth/sign-in",
  async ({ username, password }) => {
    const response = await signInApi(username, password);
    return response.data;
  }
);

export const logIn = createAsyncThunk("auth/sign-in", async () => {
  const response = await api.post("/log-in");
  return response.data;
});

export const signUp = createAsyncThunk("auth/sign-in", async (body) => {
  const response = await signUpApi(body);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = "pending";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.user;
        state.error = null;
        cookie.save("token", action.payload.token);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.error;
        state.user = initialState.user;
        state.status = "rejected";
      });
  },
});

export default authSlice.reducer;

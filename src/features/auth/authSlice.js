import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import base64 from "base-64";
import cookie from "react-cookies";
import api from "../../app/api";
import Swal from "sweetalert2";

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
  status: "notAuth", // pending || idle || rejected
  error: null,
};

export const signIn = createAsyncThunk(
  "auth/sign-in",
  async ({ username, password }) => {
    try {
      const response = await signInApi(username, password);
      return response.data;
    } catch (e) {
      Swal.fire({
        title: "Invalid Login",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  }
);

export const logIn = createAsyncThunk("auth/sign-in", async () => {
  const response = await api.post("/log-in");
  return response.data;
});

export const signUp = createAsyncThunk("auth/sign-in", async (body) => {
  try {
    const response = await signUpApi(body);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Account Created Successfully",
      showConfirmButton: false,
      timer: 1500,
    });
    return response.data;
  } catch (e) {
    Swal.fire({
      title: "Error!",
      text: "Try Again Please",
      icon: "error",
      confirmButtonText: "Close",
    });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = {
        email: "",
        username: "",
        fullName: "",
        image: "",
        onlineStatus: false,
        lastSeen: "",
        friends: [],
        story: {},
      };
      state.status = "notAuth";
      state.error = null;
      cookie.remove("token");
    },
  },
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

export const { logOut } = authSlice.actions;
export default authSlice.reducer;

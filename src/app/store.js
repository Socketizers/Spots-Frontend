import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import serverReducer from "../features/server/serverSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    server: serverReducer,
  },
});

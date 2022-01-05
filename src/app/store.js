import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import serverReducer from "../features/server/serverSlice";
import friendsReducer from "../features/friends/friendsSlice";
import friendsRequestsReducer from "../features/friends/friendsReqSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    server: serverReducer,
    friendsList: friendsReducer,
    friendsRequest: friendsRequestsReducer,
  },
});

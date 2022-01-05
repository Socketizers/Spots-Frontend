import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import serverReducer from "../features/server/serverSlice";
import friendsReducer from "../features/friends/friendsSlice";
import friendsRequestsReducer from "../features/friends/friendsReqSlice";
import userServersReducer from "../features/server/userServers.Slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    server: serverReducer,
    userServers:userServersReducer,
    friendsList: friendsReducer,
    friendsRequest: friendsRequestsReducer,
  },
});

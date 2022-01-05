import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    receiver: null
  };


  const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        updateReceiver: (state, action) => {
            state.receiver = action.payload
        }
    },
    
  });

  
export const { updateReceiver } = chatSlice.actions;
export default chatSlice.reducer;
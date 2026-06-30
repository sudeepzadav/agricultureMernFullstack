import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// ✅ Type for RootState (use in useSelector)
export type RootState = ReturnType<typeof store.getState>;

// ✅ Type for dispatch (use in custom hooks if needed)
export type AppDispatch = typeof store.dispatch;
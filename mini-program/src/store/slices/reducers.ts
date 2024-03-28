import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";

const rootReducer = combineReducers({
  userData: userSlice.reducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;

import { configureStore } from "@reduxjs/toolkit";
import prReducer from "./pr-slice";
import filterReducer from "./filter-slice";

export const store = configureStore({
  reducer: {
    pr: prReducer, // state.pr
    filter: filterReducer, // state.filter
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PullRequest } from "@/types";
import { RootState } from "./index";

interface PRState {
  list: PullRequest[];
  selectedPR: PullRequest | null;
  hasLoaded: boolean;
}

const initialState: PRState = {
  list: [],
  selectedPR: null,
  hasLoaded: false,
};

const prSlice = createSlice({
  name: "pr",
  initialState,
  reducers: {
    setSelectedPR(state, action: PayloadAction<PullRequest | null>) {
      state.selectedPR = action.payload;
    },
    setPRList(state, action: PayloadAction<PullRequest[]>) {
      state.list = action.payload;
      state.hasLoaded = true;
    },
  },
});

export const { setSelectedPR, setPRList } = prSlice.actions;

export const selectPRList = (state: RootState) => state.pr.list;
export const selectSelectedPR = (state: RootState) => state.pr.selectedPR;
export const selectPRHasLoaded = (state: RootState) => state.pr.hasLoaded;

export default prSlice.reducer;

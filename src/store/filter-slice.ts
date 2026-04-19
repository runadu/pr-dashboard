import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";
import type { PullRequest, PullRequestTriageFilter } from "@/types";
import { createEmptyTriageQueueCounts } from "@/lib/triage";
import { selectPRList } from "./pr-slice";

interface FilterState {
  queue: PullRequestTriageFilter;
  repo: string;
  searchQuery: string;
}

const initialState: FilterState = {
  queue: "all",
  repo: "",
  searchQuery: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setQueue(state, action: PayloadAction<FilterState["queue"]>) {
      state.queue = action.payload;
    },
    setRepo(state, action: PayloadAction<string>) {
      state.repo = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    resetFilters(state) {
      state.queue = "all";
      state.repo = "";
      state.searchQuery = "";
    },
  },
});

export const { setQueue, setRepo, setSearchQuery, resetFilters } = filterSlice.actions;

export const selectFilter = (state: RootState) => state.filter;
export const selectQueueCounts = createSelector([selectPRList], (list) =>
  list.reduce((counts, pr) => {
    counts[pr.triageQueue] += 1;
    return counts;
  }, createEmptyTriageQueueCounts())
);

export const selectFilteredPRs = createSelector(
  [selectPRList, selectFilter], // 依賴這兩個 selector
  (list, filter): PullRequest[] =>
    list.filter((pr) => {
      const matchQueue = filter.queue === "all" || pr.triageQueue === filter.queue;
      const matchRepo = filter.repo === "" || pr.repo === filter.repo;
      const matchSearch =
        filter.searchQuery === "" ||
        pr.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        pr.author.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        `${pr.owner}/${pr.repo}`.toLowerCase().includes(filter.searchQuery.toLowerCase());
      return matchQueue && matchRepo && matchSearch;
    })
);
export default filterSlice.reducer;

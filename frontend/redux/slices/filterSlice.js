import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    guideFilters: {
      language: "",
      availability: null, // null = both available/unavailable
    },
    packageFilters: {
      priceRange: [0, 10000], // [min, max]
      dateRange: { startDate: null, endDate: null },
      maxGroupSize: null,
    },
  },
  reducers: {
    setGuideFilters(state, action) {
      state.guideFilters = { ...state.guideFilters, ...action.payload };
    },
    setPackageFilters(state, action) {
      state.packageFilters = { ...state.packageFilters, ...action.payload };
    },
    resetGuideFilters(state) {
      state.guideFilters = { language: "", availability: null };
    },
    resetPackageFilters(state) {
      state.packageFilters = {
        priceRange: [0, 10000],
        dateRange: { startDate: null, endDate: null },
        maxGroupSize: null,
      };
    },
  },
});

export const {
  setGuideFilters,
  setPackageFilters,
  resetGuideFilters,
  resetPackageFilters,
} = filterSlice.actions;

export default filterSlice.reducer;

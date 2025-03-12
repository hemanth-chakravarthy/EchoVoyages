import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define async thunk for fetching packages
export const fetchPackages = createAsyncThunk(
  "packages/fetchPackages",
  async () => {
    const response = await axios.get("http://localhost:5000/packages");
    return response.data;
  }
);

// Define async thunk for booking a package
export const bookPackage = createAsyncThunk(
  "packages/bookPackage",
  async (packageId) => {
    const response = await axios.post(
      `http://localhost:5000/packages/book/${packageId}`
    );
    return response.data;
  }
);

const packageSlice = createSlice({
  name: "packages",
  initialState: {
    packages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.packages = action.payload;
        state.loading = false;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(bookPackage.fulfilled, (state, action) => {
        const index = state.packages.findIndex(
          (pkg) => pkg.id === action.payload.id
        );
        if (index !== -1) {
          state.packages[index] = action.payload;
        }
      });
  },
});

export default packageSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define async thunk for fetching guides
export const fetchGuides = createAsyncThunk("guides/fetchGuides", async () => {
  const response = await axios.get("http://localhost:5000/guides");
  return response.data;
});

// Define async thunk for booking a guide
export const bookGuide = createAsyncThunk(
  "guides/bookGuide",
  async (guideId) => {
    const response = await axios.post(
      `http://localhost:5000/guides/book/${guideId}`
    );
    return response.data;
  }
);

const guideSlice = createSlice({
  name: "guides",
  initialState: {
    guides: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuides.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGuides.fulfilled, (state, action) => {
        state.guides = action.payload;
        state.loading = false;
      })
      .addCase(fetchGuides.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(bookGuide.fulfilled, (state, action) => {
        const index = state.guides.findIndex(
          (guide) => guide.id === action.payload.id
        );
        if (index !== -1) {
          state.guides[index] = action.payload;
        }
      });
  },
});

export default guideSlice.reducer;

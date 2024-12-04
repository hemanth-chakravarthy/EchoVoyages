import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching user bookings
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/users/${userId}/bookings`
    );
    return response.data;
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default bookingSlice.reducer;

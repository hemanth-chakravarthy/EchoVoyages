import { configureStore } from "@reduxjs/toolkit";
import guideSlice from "./slices/guideSlice";
import packageSlice from "./slices/packageSlice";

const store = configureStore({
  reducer: {
    guides: guideSlice,
    packages: packageSlice,
  },
});

export default store;

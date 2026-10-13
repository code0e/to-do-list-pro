import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice.js";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

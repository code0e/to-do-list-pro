import { createSlice, nanoid } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",

  initialState: JSON.parse(localStorage.getItem("tasks")) || [],

  reducers: {
    addTask: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (title) => ({
        payload: {
          id: nanoid(),
          title,
          completed: false,
          priority: "medium",
        },
      }),
    },

    toggleTask: (state, action) => {
      const task = state.find((task) => task.id === action.payload);

      if (task) {
        task.completed = !task.completed;
      }
    },

    deleteTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },

    editTask: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);

      if (task) {
        task.title = action.payload.title;
      }
    },

    updateTaskPriority: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);

      if (task) {
        task.priority = action.payload.priority;
      }
    },
  },
});

export const { addTask, toggleTask, deleteTask, editTask, updateTaskPriority } =
  taskSlice.actions;

export default taskSlice.reducer;

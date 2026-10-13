import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  toggleTask,
  deleteTask,
  editTask,
  updateTaskPriority,
} from "./features/tasks/taskSlice.js";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  function handleAddTask(event) {
    event.preventDefault();

    if (!taskTitle.trim()) return;

    dispatch(addTask(taskTitle.trim()));
    setTaskTitle("");
  }

  function handleEditTask(task) {
    const newTitle = prompt("Edit your task:", task.title);

    if (newTitle === null || !newTitle.trim()) return;

    dispatch(
      editTask({
        id: task.id,
        title: newTitle.trim(),
      }),
    );
  }

  const cardClass = darkMode
    ? "rounded-xl border border-gray-700 bg-gray-800 p-5"
    : "rounded-xl border border-gray-200 bg-white p-5";

  const inputClass = darkMode
    ? "w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-green-400"
    : "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-500";

  const buttonClass = darkMode
    ? "rounded-lg border border-gray-600 px-4 py-2 hover:bg-gray-700"
    : "rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100";

  const filterButtonClass = (selected) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      selected
        ? "bg-[#39ff88] text-gray-900"
        : darkMode
          ? "border border-gray-600 text-gray-300 hover:bg-gray-700"
          : "border border-gray-300 text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-gray-900 text-white"
          : "min-h-screen bg-gray-50 text-gray-900"
      }
    >
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Todo List <span className="text-green-500">Pro</span>
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Organize your day, one task at a time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={buttonClass}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className={cardClass}>
            <p
              className={
                darkMode ? "text-sm text-gray-400" : "text-sm text-gray-500"
              }
            >
              Total Tasks
            </p>
            <h2 className="mt-2 text-3xl font-bold">{tasks.length}</h2>
          </div>

          <div className={cardClass}>
            <p
              className={
                darkMode ? "text-sm text-gray-400" : "text-sm text-gray-500"
              }
            >
              Completed
            </p>
            <h2 className="mt-2 text-3xl font-bold text-green-500">
              {tasks.filter((task) => task.completed).length}
            </h2>
          </div>

          <div className={cardClass}>
            <p
              className={
                darkMode ? "text-sm text-gray-400" : "text-sm text-gray-500"
              }
            >
              Pending
            </p>
            <h2 className="mt-2 text-3xl font-bold text-orange-500">
              {tasks.filter((task) => !task.completed).length}
            </h2>
          </div>
        </section>

        {/* Tasks */}
        <section
          className={
            darkMode
              ? "rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6"
              : "rounded-xl border border-gray-200 bg-white p-4 sm:p-6"
          }
        >
          <h2 className="text-xl font-bold">My Tasks</h2>

          <p className="mb-5 mt-1 text-sm text-gray-500">
            Keep track of what needs to get done.
          </p>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your tasks..."
            className={`${inputClass} mb-4`}
          />

          {/* Filters */}
          <div className="mb-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={filterButtonClass(filter === "all")}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setFilter("active")}
              className={filterButtonClass(filter === "active")}
            >
              Active
            </button>

            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={filterButtonClass(filter === "completed")}
            >
              Completed
            </button>
          </div>

          {/* Add Task */}
          <form
            onSubmit={handleAddTask}
            className="mb-6 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Enter a task..."
              className={`${inputClass} min-w-0 flex-1`}
            />

            <button
              type="submit"
              className="rounded-lg bg-[#39ff88] px-6 py-3 font-semibold text-gray-900 transition hover:bg-green-400 sm:shrink-0"
            >
              Add Task
            </button>
          </form>

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              {tasks.length === 0
                ? "No tasks yet. Add your first task!"
                : "No matching tasks found."}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={
                    darkMode
                      ? "flex flex-col gap-3 rounded-lg border border-gray-700 p-3 sm:p-4"
                      : "flex flex-col gap-3 rounded-lg border border-gray-200 p-3 sm:p-4"
                  }
                >
                  {/* Task title area */}
                  <div className="flex min-w-0 items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => dispatch(toggleTask(task.id))}
                      className="mt-1 h-5 w-5 shrink-0 accent-green-500"
                      aria-label={`Mark ${task.title} as completed`}
                    />

                    <span
                      className={
                        task.completed
                          ? "min-w-0 flex-1 break-words text-gray-400 line-through [overflow-wrap:anywhere]"
                          : "min-w-0 flex-1 break-words [overflow-wrap:anywhere]"
                      }
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* Task controls */}
                  <div className="flex flex-wrap items-center gap-2 sm:pl-8">
                    <select
                      value={task.priority}
                      onChange={(event) =>
                        dispatch(
                          updateTaskPriority({
                            id: task.id,
                            priority: event.target.value,
                          }),
                        )
                      }
                      className={
                        darkMode
                          ? "rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white"
                          : "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                      }
                      aria-label={`Priority for ${task.title}`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleEditTask(task)}
                      className={
                        darkMode
                          ? "rounded-lg px-3 py-2 text-sm text-blue-400 hover:bg-gray-700"
                          : "rounded-lg px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => dispatch(deleteTask(task.id))}
                      className={
                        darkMode
                          ? "rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
                          : "rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-8 text-center text-sm text-gray-500">
          Built with React, Redux Toolkit and Tailwind CSS.
        </footer>
      </div>
    </div>
  );
}

export default App;

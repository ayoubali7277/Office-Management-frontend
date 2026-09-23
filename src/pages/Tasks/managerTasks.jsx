import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CheckSquare2,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Plus,
  LoaderCircle,
} from "lucide-react";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function ManagerTasks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const [isCreating, setIsCreating] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: teamData,
    isLoading: teamLoading,
  } = useQuery({
    queryKey: ["manager-team"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/employees/manager-team",
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch team"
        );
      }

      return result;
    },
  });

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery({
    queryKey: ["manager-tasks"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/tasks/manager",
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch tasks"
        );
      }

      return result;
    },
  });

  const employees = teamData?.employees || [];
  const tasks = tasksData?.tasks || [];

  const managerName =
    teamData?.manager?.name ||
    tasksData?.manager?.name;

  const filteredTasks = tasks.filter((task) => {
    const employeeName = task.employee?.name || "";

    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      employeeName
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  const formatStatus = (status) => {
    if (status === "IN_PROGRESS") {
      return "In Progress";
    }

    if (status === "COMPLETED") {
      return "Completed";
    }

    if (status === "TODO") {
      return "To Do";
    }

    return status;
  };

  const formatPriority = (priority) => {
    if (priority === "HIGH") {
      return "High";
    }

    if (priority === "MEDIUM") {
      return "Medium";
    }

    if (priority === "LOW") {
      return "Low";
    }

    return priority;
  };

  const formatDate = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEmployeeId("");
    setPriority("MEDIUM");
    setDueDate("");
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!employeeId) {
      toast.error("Please select an employee");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            employeeId: Number(employeeId),
            priority,
            dueDate: dueDate || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to assign task"
        );
      }

      toast.success("Task assigned successfully");

      resetForm();
      setShowForm(false);

      queryClient.invalidateQueries({
        queryKey: ["manager-tasks"],
      });
    } catch (error) {
      toast.error(
        error.message || "Failed to assign task"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const managerInitials = managerName
    ? managerName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "--";

  return (
    <div className="min-h-screen bg-slate-100">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-950 p-6 transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        lg:translate-x-0`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-white lg:hidden"
        >
          <X size={22} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Office<span className="text-orange-500">
              Management
            </span>
          </h1>

          <p className="ml-16 mt-1 text-sm font-medium text-slate-400">
            Manager Panel
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          <a
            href="/manager"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a
            href="/manager/team"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Users size={19} />
            My Team
          </a>

          <a
            href="/manager/attendance"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Clock size={19} />
            Attendance
          </a>

          <a
            href="/manager/leaves"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <CalendarDays size={19} />
            Leave Requests
          </a>

          <a
            href="/manager/tasks"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
          >
            <CheckSquare2 size={19} />
            Tasks
          </a>

          <a
            href="/manager/reports"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <BarChart2 size={19} />
            Reports
          </a>
        </nav>

        <div className="mt-auto space-y-2">
          <a
            href="/manager/settings"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Settings size={19} />
            Settings
          </a>

          <a
            href=""
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LogOut size={19} />
            Logout
          </a>
        </div>
      </aside>

      <main className="ml-64 min-h-screen max-lg:ml-0">
        <header className="flex items-center justify-between bg-white px-8 py-5 max-md:px-5 max-sm:px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="hidden text-slate-600 transition hover:text-orange-600 max-lg:block"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 max-sm:text-xl">
                Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Manage and assign tasks to your team.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 max-sm:gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
              {managerInitials}
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Team Tasks
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create and assign tasks for your team.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                <Plus size={18} />
                Add Task
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4 max-lg:flex-col max-lg:items-stretch">
              <div className="relative w-full">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search task or employee..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
              >
                <option value="ALL">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">
                  In Progress
                </option>
                <option value="COMPLETED">
                  Completed
                </option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
              >
                <option value="ALL">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-245">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Task
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Assigned To
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Priority
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Due Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {tasksLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        Loading tasks...
                      </td>
                    </tr>
                  ) : tasksError ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-10 text-center text-sm text-red-500"
                      >
                        Failed to load tasks.
                      </td>
                    </tr>
                  ) : filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => {
                      const employeeName =
                        task.employee?.name || "Unknown";

                      return (
                        <tr
                          key={task.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {task.title}
                              </p>

                              <p className="mt-1 max-w-60 text-xs text-slate-400">
                                {task.description ||
                                  "No description"}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-600">
                                {employeeName
                                  .split(" ")
                                  .map(
                                    (word) => word[0]
                                  )
                                  .join("")
                                  .toUpperCase()}
                              </div>

                              <span className="text-sm text-slate-600">
                                {employeeName}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                task.priority === "HIGH"
                                  ? "bg-red-50 text-red-600"
                                  : task.priority === "MEDIUM"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : "bg-green-50 text-green-600"
                              }`}
                            >
                              {formatPriority(
                                task.priority
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {formatDate(task.dueDate)}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                task.status ===
                                "COMPLETED"
                                  ? "bg-green-50 text-green-600"
                                  : task.status ===
                                    "IN_PROGRESS"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {formatStatus(
                                task.status
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedTask(task)
                              }
                              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Add New Task
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Assign a new task to your team member.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-slate-400 transition hover:text-slate-700"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleCreateTask}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Task Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Enter task title"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Enter task description"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400"
                ></textarea>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Assign To
                </label>

                <select
                  value={employeeId}
                  onChange={(e) =>
                    setEmployeeId(e.target.value)
                  }
                  disabled={teamLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400 disabled:bg-slate-50"
                >
                  <option value="">
                    {teamLoading
                      ? "Loading employees..."
                      : "Select employee"}
                  </option>

                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">
                      Medium
                    </option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isCreating && (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {isCreating
                    ? "Creating..."
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Task Details
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  View complete task information.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTask(null)
                }
                className="text-slate-400 transition hover:text-slate-700"
              >
                <X size={21} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Task Title
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {selectedTask.title}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {selectedTask.description ||
                    "No description provided."}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Assigned To
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-600">
                    {(selectedTask.employee?.name ||
                      "Unknown")
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <span className="text-sm font-medium text-slate-700">
                    {selectedTask.employee?.name ||
                      "Unknown"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Priority
                  </p>

                  <div className="mt-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        selectedTask.priority ===
                        "HIGH"
                          ? "bg-red-50 text-red-600"
                          : selectedTask.priority ===
                            "MEDIUM"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {formatPriority(
                        selectedTask.priority
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <div className="mt-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        selectedTask.status ===
                        "COMPLETED"
                          ? "bg-green-50 text-green-600"
                          : selectedTask.status ===
                            "IN_PROGRESS"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {formatStatus(
                        selectedTask.status
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Due Date
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDate(selectedTask.dueDate)}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedTask(null)
                  }
                  className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerTasks;
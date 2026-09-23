import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  CheckSquare2,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  LoaderCircle,
} from "lucide-react";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function EmployeeTasks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
  });

  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employee-tasks"],
    queryFn: async () => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/tasks/employee",
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

  const tasks = data?.tasks || [];
  const employee = data?.employee || null;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);

    try {
      const response = await fetch(
        `https://office-management-backend-production.up.railway.app/api/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update task status"
        );
      }

      toast.success("Task status updated successfully");

      await queryClient.invalidateQueries({
        queryKey: ["employee-tasks"],
      });
    } catch (error) {
      toast.error(
        error.message || "Failed to update task status"
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === "HIGH") {
      return "bg-red-50 text-red-600";
    }

    if (priority === "MEDIUM") {
      return "bg-yellow-50 text-yellow-600";
    }

    return "bg-green-50 text-green-600";
  };

  const getStatusClass = (status) => {
    if (status === "COMPLETED") {
      return "bg-green-50 text-green-600";
    }

    if (status === "IN_PROGRESS") {
      return "bg-blue-50 text-blue-600";
    }

    return "bg-slate-100 text-slate-600";
  };

  const getStatusLabel = (status) => {
    if (status === "IN_PROGRESS") {
      return "In Progress";
    }

    if (status === "COMPLETED") {
      return "Completed";
    }

    return "To Do";
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "ALL" ||
      task.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const employeeInitials = employee?.name
    ? employee.name
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
            Office<span className="text-orange-500">Management</span>
          </h1>

          <p className="ml-16 mt-1 text-sm font-medium text-slate-400">
            Employee Panel
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          <a
            href="/employee"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a
            href="/employee/attendance"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Clock size={19} />
            Attendance
          </a>

          <a
            href="/employee/leaves"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <CalendarDays size={19} />
            Leave Request
          </a>

          <a
            href="/employee/tasks"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
          >
            <CheckSquare2 size={19} />
            My Tasks
          </a>

          <a
            href="/employee/payroll"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <CreditCard size={19} />
            Payroll
          </a>
        </nav>

        <div className="mt-auto space-y-2">
          <a
            href="/employee/settings"
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
                My Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                View and manage the tasks assigned to you.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
              {employeeInitials}
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Tasks
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {totalTasks}
              </h3>

              <p className="mt-3 text-xs text-slate-400">
                All assigned tasks
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                To Do
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {todoTasks}
              </h3>

              <p className="mt-3 text-xs text-slate-400">
                Tasks waiting to start
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                In Progress
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {inProgressTasks}
              </h3>

              <p className="mt-3 text-xs text-slate-400">
                Currently working
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {completedTasks}
              </h3>

              <p className="mt-3 text-xs text-slate-400">
                Successfully completed
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Assigned Tasks
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Keep track of your assigned work.
                </p>
              </div>

              <div className="flex gap-3 max-sm:flex-col">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search tasks..."
                    className="w-64 rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-600 outline-none transition focus:border-orange-400 max-sm:w-full"
                  />
                </div>

                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
                >
                  <option value="ALL">
                    All Status
                  </option>

                  <option value="TODO">
                    To Do
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-5 py-12">
                  <LoaderCircle
                    size={30}
                    className="animate-spin text-orange-500"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    Loading tasks...
                  </p>
                </div>
              ) : isError ? (
                <div className="rounded-xl border border-dashed border-red-200 px-5 py-12 text-center">
                  <p className="text-sm font-medium text-red-500">
                    Failed to load tasks.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Please try again later.
                  </p>
                </div>
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-orange-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-5 max-md:flex-col">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-semibold text-slate-900">
                            {task.title}
                          </h4>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {task.description || "No description provided."}
                        </p>

                        <p className="mt-3 text-xs text-slate-400">
                          Due: {formatDate(task.dueDate)}
                        </p>

                        {task.assignedBy?.name && (
                          <p className="mt-1 text-xs text-slate-400">
                            Assigned by: {task.assignedBy.name}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-3 max-sm:w-full">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
                            task.status
                          )}`}
                        >
                          {getStatusLabel(task.status)}
                        </span>

                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(
                              task.id,
                              e.target.value
                            )
                          }
                          disabled={updatingTaskId === task.id}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none transition focus:border-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="TODO">
                            To Do
                          </option>

                          <option value="IN_PROGRESS">
                            In Progress
                          </option>

                          <option value="COMPLETED">
                            Completed
                          </option>
                        </select>

                        {updatingTaskId === task.id && (
                          <LoaderCircle
                            size={18}
                            className="animate-spin text-orange-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 px-5 py-12 text-center">
                  <CheckSquare2
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    No tasks found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try changing your search or status filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EmployeeTasks;


import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  Calendar,
  CheckSquare2,
  LucideCreditCard,
  BarChart2,
  Settings,
  LogOutIcon,
  Menu,
  X,
  Search,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

function Tasks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminTasks"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/tasks/admin",
        {
          method: "GET",
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

  useEffect(() => {
    if (isError) {
      toast.error(
        error?.message || "Failed to fetch tasks"
      );
    }
  }, [isError, error]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      task.employee?.name
        ?.toLowerCase()
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-600">
          Loading Tasks...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-red-600">
          Failed to load tasks.
        </p>
      </div>
    );
  }

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
            Office
            <span className="text-orange-500">
              Management
            </span>
          </h1>

          <p className="ml-16 mt-1 text-sm font-medium text-slate-400">
            Admin Panel
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          <a
            href="/admin"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a
            href="/employees"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Users size={19} />
            Employees
          </a>

          <a
            href="/departments"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Building2 size={19} />
            Departments
          </a>

          <a
            href="/attendance"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Clock size={19} />
            Attendance
          </a>

          <a
            href="/leaves"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Calendar size={19} />
            Leaves
          </a>

          <a
            href="/tasks"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
          >
            <CheckSquare2 size={19} />
            Tasks
          </a>

          <a
            href="/payroll"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LucideCreditCard size={19} />
            Payroll
          </a>

          <a
            href="/reports"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <BarChart2 size={19} />
            Reports
          </a>
        </nav>

        <div className="mt-auto space-y-2">
          <a
            href="/settings"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Settings size={19} />
            Settings
          </a>

          <a
            href=""
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LogOutIcon size={19} />
            Logout
          </a>
        </div>
      </aside>

      <main className="ml-64 min-h-screen max-lg:ml-0">
        <header className="flex items-center bg-white px-8 py-5 max-md:px-5 max-sm:px-4">
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
                Monitor tasks across your organization.
              </p>
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="grid grid-cols-4 gap-5 max-xl:grid-cols-2 max-sm:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Tasks
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {tasks.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                To Do
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {
                  tasks.filter(
                    (task) => task.status === "TODO"
                  ).length
                }
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                In Progress
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {
                  tasks.filter(
                    (task) => task.status === "IN_PROGRESS"
                  ).length
                }
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {
                  tasks.filter(
                    (task) => task.status === "COMPLETED"
                  ).length
                }
              </h3>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex gap-4 max-md:flex-col">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks or employees..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-48 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500 max-md:w-full"
              >
                <option value="ALL">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-48 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500 max-md:w-full"
              >
                <option value="ALL">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Task
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Assigned To
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Priority
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Due Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-10 text-center text-sm text-slate-500"
                      >
                        No tasks found.
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800">
                            {task.title}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {task.employee?.name || "Unknown"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {task.employee?.department?.name ||
                            "Unknown"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium
                            ${
                              task.priority === "HIGH"
                                ? "bg-red-50 text-red-600"
                                : task.priority === "MEDIUM"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {task.priority === "HIGH"
                              ? "High"
                              : task.priority === "MEDIUM"
                              ? "Medium"
                              : "Low"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium
                            ${
                              task.status === "TODO"
                                ? "bg-slate-100 text-slate-600"
                                : task.status === "IN_PROGRESS"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {task.status === "TODO"
                              ? "To Do"
                              : task.status === "IN_PROGRESS"
                              ? "In Progress"
                              : "Completed"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {task.dueDate
                            ? new Date(
                                task.dueDate
                              ).toLocaleDateString("en-GB")
                            : "No due date"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Tasks;
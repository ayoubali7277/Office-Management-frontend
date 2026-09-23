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
  TrendingUp,
  UserCheck,
  Clock3,
  CircleCheck,
  CircleAlert,
  ArrowUpRight,
  Activity,
  LoaderCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/reports/overview",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch reports");
      }

      return result;
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to load reports");
    }
  }, [isError, error]);

  const getPercentage = (value, total) => {
    if (!total) return 0;

    return Math.round((value / total) * 100);
  };

  const overview = data?.overview || {
    totalEmployees: 0,
    attendanceRate: 0,
    pendingLeaves: 0,
    pendingTasks: 0,
  };

  const attendance = data?.attendance || {
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    totalRecords: 0,
  };

  const leaves = data?.leaves || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  const tasks = data?.tasks || {
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
  };

  const departments = data?.departments || [];

  return (
    <div className="min-h-screen bg-slate-100">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-950 p-6 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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

      <main className="min-h-screen ml-64 max-lg:ml-0">
        <header className="flex items-center justify-between bg-white px-8 py-5 max-md:px-5 max-sm:px-4">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-3 hidden text-slate-600 transition hover:text-orange-600 max-lg:block"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 max-sm:text-xl">
                Reports
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Analyze your organization data and performance.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 sm:flex">
            <Activity size={17} className="text-orange-500" />

            <span className="text-sm font-medium text-slate-600">
              Organization Overview
            </span>
          </div>
        </header>

        {isLoading ? (
          <section className="flex min-h-[calc(100vh-88px)] items-center justify-center p-8 max-md:p-5 max-sm:p-4">
            <div className="flex flex-col items-center justify-center">
              <LoaderCircle
                size={34}
                className="animate-spin text-orange-500"
              />

              <p className="mt-3 text-sm font-medium text-slate-600">
                Loading reports...
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Fetching organization data
              </p>
            </div>
          </section>
        ) : isError ? (
          <section className="flex min-h-[calc(100vh-88px)] items-center justify-center p-8 max-md:p-5 max-sm:p-4">
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <CircleAlert size={24} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Unable to load reports
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {error?.message || "Something went wrong while loading data."}
              </p>
            </div>
          </section>
        ) : (
          <section className="space-y-6 p-8 max-md:p-5 max-sm:p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Organization Overview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  A complete summary of your organization's current
                  performance.
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-600">
                <TrendingUp size={17} />
                Performance Summary
              </div>
            </div>

            <div className="grid grid-cols-4 gap-5 max-2xl:grid-cols-2 max-sm:grid-cols-1">
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-orange-50 p-3 text-orange-500">
                    <Users size={22} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-slate-300 transition group-hover:text-orange-500"
                  />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  Total Employees
                </p>

                <h4 className="mt-2 text-3xl font-bold text-slate-900">
                  {overview.totalEmployees}
                </h4>

                <p className="mt-2 text-xs text-slate-400">
                  Active employees in organization
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <UserCheck size={22} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-slate-300 transition group-hover:text-emerald-500"
                  />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  Attendance Rate
                </p>

                <h4 className="mt-2 text-3xl font-bold text-slate-900">
                  {overview.attendanceRate}%
                </h4>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    style={{
                      width: `${overview.attendanceRate}%`,
                    }}
                    className="h-full rounded-full bg-emerald-500"
                  ></div>
                </div>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                    <Calendar size={22} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-slate-300 transition group-hover:text-amber-500"
                  />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  Pending Leaves
                </p>

                <h4 className="mt-2 text-3xl font-bold text-slate-900">
                  {overview.pendingLeaves}
                </h4>

                <p className="mt-2 text-xs text-slate-400">
                  Leave requests waiting for approval
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <CheckSquare2 size={22} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-slate-300 transition group-hover:text-blue-500"
                  />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  Pending Tasks
                </p>

                <h4 className="mt-2 text-3xl font-bold text-slate-900">
                  {overview.pendingTasks}
                </h4>

                <p className="mt-2 text-xs text-slate-400">
                  Tasks that are not completed
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Attendance Summary
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Current attendance distribution.
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-3 text-orange-500">
                    <Clock size={21} />
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        Present
                      </div>

                      <span className="font-semibold text-slate-900">
                        {attendance.present}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        style={{
                          width: `${getPercentage(
                            attendance.present,
                            attendance.totalRecords
                          )}%`,
                        }}
                        className="h-full rounded-full bg-emerald-500"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                        Absent
                      </div>

                      <span className="font-semibold text-slate-900">
                        {attendance.absent}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        style={{
                          width: `${getPercentage(
                            attendance.absent,
                            attendance.totalRecords
                          )}%`,
                        }}
                        className="h-full rounded-full bg-red-500"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                        Late
                      </div>

                      <span className="font-semibold text-slate-900">
                        {attendance.late}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        style={{
                          width: `${getPercentage(
                            attendance.late,
                            attendance.totalRecords
                          )}%`,
                        }}
                        className="h-full rounded-full bg-amber-500"
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                        Half Day
                      </div>

                      <span className="font-semibold text-slate-900">
                        {attendance.halfDay}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        style={{
                          width: `${getPercentage(
                            attendance.halfDay,
                            attendance.totalRecords
                          )}%`,
                        }}
                        className="h-full rounded-full bg-blue-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Leave Summary
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Overview of employee leave requests.
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                    <Calendar size={21} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Total Leaves</p>

                    <h4 className="mt-2 text-2xl font-bold text-slate-900">
                      {leaves.total}
                    </h4>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-sm text-amber-700">Pending</p>

                    <h4 className="mt-2 text-2xl font-bold text-amber-700">
                      {leaves.pending}
                    </h4>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-700">Approved</p>

                    <h4 className="mt-2 text-2xl font-bold text-emerald-700">
                      {leaves.approved}
                    </h4>
                  </div>

                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-red-700">Rejected</p>

                    <h4 className="mt-2 text-2xl font-bold text-red-700">
                      {leaves.rejected}
                    </h4>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  <CircleAlert size={17} />
                  {leaves.pending} leave requests need attention.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Task Summary
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Current task progress in your organization.
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <CheckSquare2 size={21} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Total Tasks</p>

                    <h4 className="mt-2 text-2xl font-bold text-slate-900">
                      {tasks.total}
                    </h4>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-sm text-blue-700">To Do</p>

                    <h4 className="mt-2 text-2xl font-bold text-blue-700">
                      {tasks.todo}
                    </h4>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-sm text-amber-700">In Progress</p>

                    <h4 className="mt-2 text-2xl font-bold text-amber-700">
                      {tasks.inProgress}
                    </h4>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-700">Completed</p>

                    <h4 className="mt-2 text-2xl font-bold text-emerald-700">
                      {tasks.completed}
                    </h4>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      Task Completion
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {getPercentage(tasks.completed, tasks.total)}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      style={{
                        width: `${getPercentage(
                          tasks.completed,
                          tasks.total
                        )}%`,
                      }}
                      className="h-full rounded-full bg-emerald-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Department Performance
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Employee distribution and performance by department.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Building2 size={17} />
                  {departments.length} Departments
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-175">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Department
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Employees
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Attendance
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Pending Tasks
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Completed Tasks
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {departments.length > 0 ? (
                      departments.map((department) => (
                        <tr
                          key={department.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-orange-50 p-2 text-orange-500">
                                <Building2 size={18} />
                              </div>

                              <span className="text-sm font-semibold text-slate-800">
                                {department.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {department.employees}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  style={{
                                    width: `${department.attendance}%`,
                                  }}
                                  className="h-full rounded-full bg-emerald-500"
                                ></div>
                              </div>

                              <span className="text-sm font-semibold text-slate-700">
                                {department.attendance}%
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                              {department.pendingTasks}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              {department.completedTasks}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-8 text-center text-sm text-slate-500"
                        >
                          No departments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-1">
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <UserCheck size={21} />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Attendance Status
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {overview.attendanceRate}% overall attendance rate is
                    currently recorded.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <CircleAlert size={21} />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Pending Actions
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {overview.pendingLeaves} leaves and{" "}
                    {overview.pendingTasks} tasks are still pending.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <CheckSquare2 size={21} />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Task Progress
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {getPercentage(tasks.completed, tasks.total)}% of
                    organization tasks are completed.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Reports;
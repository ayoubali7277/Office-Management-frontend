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
  FileText,
  Filter,
  LoaderCircle,
  RefreshCcw,
} from "lucide-react";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

function ManagerReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  const {
    data: managerData,
    isLoading: managerLoading,
  } = useQuery({
    queryKey: ["manager-dashboard"],

    queryFn: async () => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/managers/dashboard",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch Manager information"
        );
      }

      return result;
    },
  });

  const {
    data: attendanceData,
    isFetching: attendanceLoading,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: [
      "manager-report",
      "ATTENDANCE",
      filters.fromDate,
      filters.toDate,
    ],

    queryFn: async () => {
      const response = await fetch(
        `https://office-management-backend-production.up.railway.app/api/managers/reports?type=ATTENDANCE&fromDate=${filters.fromDate}&toDate=${filters.toDate}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch Attendance report"
        );
      }

      return result;
    },

    enabled: false,
  });

  const {
    data: leaveData,
    isFetching: leaveLoading,
    refetch: refetchLeaves,
  } = useQuery({
    queryKey: [
      "manager-report",
      "LEAVES",
      filters.fromDate,
      filters.toDate,
    ],

    queryFn: async () => {
      const response = await fetch(
        `https://office-management-backend-production.up.railway.app/api/managers/reports?type=LEAVES&fromDate=${filters.fromDate}&toDate=${filters.toDate}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch Leave report");
      }

      return result;
    },

    enabled: false,
  });

  const {
    data: taskData,
    isFetching: taskLoading,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: [
      "manager-report",
      "TASKS",
      filters.fromDate,
      filters.toDate,
    ],

    queryFn: async () => {
      const response = await fetch(
        `https://office-management-backend-production.up.railway.app/api/managers/reports?type=TASKS&fromDate=${filters.fromDate}&toDate=${filters.toDate}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch Task report");
      }

      return result;
    },

    enabled: false,
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));
  };

  const fetchReports = async () => {
    if (!filters.fromDate || !filters.toDate) {
      toast.error("Please select both dates");
      return;
    }

    if (filters.fromDate > filters.toDate) {
      toast.error("From date cannot be greater than to date");
      return;
    }

    try {
      await Promise.all([
        refetchAttendance(),
        refetchLeaves(),
        refetchTasks(),
      ]);

      toast.success("Reports generated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to generate reports");
    }
  };

  const clearReports = () => {
    setFilters({
      fromDate: "",
      toDate: "",
    });
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) {
      return "M";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const manager = managerData?.manager;

  const attendanceReports = attendanceData?.reports || [];
  const leaveReports = leaveData?.reports || [];
  const taskReports = taskData?.reports || [];

  const reportLoading =
    attendanceLoading || leaveLoading || taskLoading;

  return (
    <div className="min-h-screen bg-slate-100">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-950 p-6 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <button
          type="button"
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <CheckSquare2 size={19} />
            Tasks
          </a>

          <a
            href="/manager/reports"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
            href="/logout"
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
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="hidden text-slate-600 transition hover:text-orange-600 max-lg:block"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 max-sm:text-xl">
                Reports
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                View your team's performance and activity reports.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 max-sm:gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
              {managerLoading ? "..." : getInitials(manager?.name)}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {managerLoading ? "Loading..." : manager?.name || "Manager"}
              </p>

              <p className="text-xs text-slate-500">Manager</p>
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Filter size={20} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Report Filters
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Select the date range you want to view.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="fromDate"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  From Date
                </label>

                <input
                  id="fromDate"
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="toDate"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  To Date
                </label>

                <input
                  id="toDate"
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={clearReports}
                disabled={reportLoading}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCcw size={17} />
                Clear
              </button>

              <button
                type="button"
                onClick={fetchReports}
                disabled={reportLoading}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reportLoading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    Generate Reports
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 max-sm:flex-col">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Attendance Report
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(filters.fromDate)} -{" "}
                  {formatDate(filters.toDate)}
                </p>
              </div>

              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                {attendanceReports.length} Employees
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">
              {attendanceLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                  <LoaderCircle size={18} className="animate-spin" />
                  Loading attendance report...
                </div>
              ) : attendanceReports.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  Select dates and generate the report to view attendance data.
                </div>
              ) : (
                <table className="w-full min-w-[700px]">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Employee
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Present
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Absent
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Late
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Half Day
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {attendanceReports.map((report) => (
                      <tr
                        key={report.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                          {report.employee}
                        </td>

                        <td className="px-4 py-4 text-sm text-green-600">
                          {report.present}
                        </td>

                        <td className="px-4 py-4 text-sm text-red-600">
                          {report.absent}
                        </td>

                        <td className="px-4 py-4 text-sm text-yellow-600">
                          {report.late}
                        </td>

                        <td className="px-4 py-4 text-sm text-blue-600">
                          {report.halfDay}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 max-sm:flex-col">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Leave Report
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(filters.fromDate)} -{" "}
                  {formatDate(filters.toDate)}
                </p>
              </div>

              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                {leaveReports.length} Employees
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">
              {leaveLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                  <LoaderCircle size={18} className="animate-spin" />
                  Loading leave report...
                </div>
              ) : leaveReports.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  Select dates and generate the report to view leave data.
                </div>
              ) : (
                <table className="w-full min-w-[800px]">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Employee
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total Leaves
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Approved
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Rejected
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Pending
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {leaveReports.map((report) => (
                      <tr
                        key={report.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                          {report.employee}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {report.totalLeaves}
                        </td>

                        <td className="px-4 py-4 text-sm text-green-600">
                          {report.approved}
                        </td>

                        <td className="px-4 py-4 text-sm text-red-600">
                          {report.rejected}
                        </td>

                        <td className="px-4 py-4 text-sm text-yellow-600">
                          {report.pending}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 max-sm:flex-col">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Task Report
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(filters.fromDate)} -{" "}
                  {formatDate(filters.toDate)}
                </p>
              </div>

              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                {taskReports.length} Employees
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">
              {taskLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                  <LoaderCircle size={18} className="animate-spin" />
                  Loading task report...
                </div>
              ) : taskReports.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  Select dates and generate the report to view task data.
                </div>
              ) : (
                <table className="w-full min-w-[800px]">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Employee
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total Tasks
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Completed
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        In Progress
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        To Do
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {taskReports.map((report) => (
                      <tr
                        key={report.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                          {report.employee}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {report.totalTasks}
                        </td>

                        <td className="px-4 py-4 text-sm text-green-600">
                          {report.completed}
                        </td>

                        <td className="px-4 py-4 text-sm text-blue-600">
                          {report.inProgress}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {report.todo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ManagerReports;
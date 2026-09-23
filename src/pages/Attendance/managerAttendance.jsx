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
} from "lucide-react";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

function ManagerAttendance() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["manager-attendance", selectedDate],

    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/api/attendance/manager?date=${selectedDate}`,
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch attendance"
        );
      }

      return result;
    },
  });

  const manager = data?.manager;

  const attendanceRecords = data?.attendance || [];

  const filteredAttendance = attendanceRecords.filter((record) => {
    const matchesSearch = record.employee
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const presentCount = attendanceRecords.filter(
    (record) =>
      record.status === "PRESENT" ||
      record.status === "LATE"
  ).length;

  const absentCount = attendanceRecords.filter(
    (record) => record.status === "ABSENT"
  ).length;

  const halfDayCount = attendanceRecords.filter(
    (record) => record.status === "HALF_DAY"
  ).length;

  const totalEmployees = attendanceRecords.length;

  const formatTime = (date) => {
    if (!date) {
      return null;
    }

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
                Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Track and monitor attendance of your team.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3 max-sm:gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
              {manager?.name
                ? manager.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                : "--"}
            </div>

          </div>

        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Present
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {isLoading ? "..." : presentCount}
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Clock size={21} />
                </div>

              </div>

              <p className="mt-4 text-xs text-slate-400">
                Present today
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Absent
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {isLoading ? "..." : absentCount}
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Users size={21} />
                </div>

              </div>

              <p className="mt-4 text-xs text-slate-400">
                Not present today
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Half Day
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {isLoading ? "..." : halfDayCount}
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays size={21} />
                </div>

              </div>

              <p className="mt-4 text-xs text-slate-400">
                Half day attendance
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Total Employees
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {isLoading ? "..." : totalEmployees}
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Users size={21} />
                </div>

              </div>

              <p className="mt-4 text-xs text-slate-400">
                Team members
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div>

              <h3 className="text-lg font-semibold text-slate-900">
                Team Attendance
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Attendance records of your department employees.
              </p>

            </div>

            <div className="mt-5 flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">

              <div className="relative w-full max-w-md">

                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
                />

              </div>

              <div className="flex gap-3 max-sm:flex-col">

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
                >
                  <option value="ALL">All Status</option>
                  <option value="PRESENT">Present</option>
                  <option value="LATE">Late</option>
                  <option value="ABSENT">Absent</option>
                  <option value="HALF_DAY">Half Day</option>
                </select>

              </div>

            </div>

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-187.5">

                <thead className="border-b border-slate-200">

                  <tr>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Employee
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Check In
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Check Out
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {isLoading ? (

                    <tr>

                      <td
                        colSpan="5"
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        Loading attendance...
                      </td>

                    </tr>

                  ) : isError ? (

                    <tr>

                      <td
                        colSpan="5"
                        className="px-4 py-10 text-center text-sm text-red-500"
                      >
                        Failed to load attendance records.
                      </td>

                    </tr>

                  ) : filteredAttendance.length > 0 ? (

                    filteredAttendance.map((record) => (

                      <tr
                        key={record.id}
                        className="transition hover:bg-slate-50"
                      >

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-600">
                              {record.employee
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase()}
                            </div>

                            <p className="text-sm font-semibold text-slate-800">
                              {record.employee}
                            </p>

                          </div>

                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {record.date}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {formatTime(record.checkIn) || "--"}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {formatTime(record.checkOut) || "--"}
                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              record.status === "PRESENT"
                                ? "bg-green-50 text-green-600"
                                : record.status === "LATE"
                                ? "bg-yellow-50 text-yellow-600"
                                : record.status === "ABSENT"
                                ? "bg-red-50 text-red-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {record.status === "HALF_DAY"
                              ? "Half Day"
                              : record.status.charAt(0) +
                                record.status.slice(1).toLowerCase()}
                          </span>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        No attendance records found.
                      </td>

                    </tr>

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

export default ManagerAttendance;
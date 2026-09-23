import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  Search,
  CalendarDays,
  UserCheck,
  UserX,
  CheckSquare2,
  CreditCard,
} from "lucide-react";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

function Attendance() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeDate, setEmployeeDate] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState("ALL");

  const [managerSearch, setManagerSearch] = useState("");
  const [managerDate, setManagerDate] = useState("");
  const [managerStatus, setManagerStatus] = useState("ALL");

  const getToday = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const selectedEmployeeDate =
    employeeDate || getToday();

  const selectedManagerDate =
    managerDate || getToday();

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [
      "admin-attendance",
      employeeSearch,
      employeeStatus,
      selectedEmployeeDate,
      managerSearch,
      managerStatus,
      selectedManagerDate,
    ],

    queryFn: async () => {
      const params = new URLSearchParams();

      if (employeeSearch.trim()) {
        params.append(
          "employeeSearch",
          employeeSearch.trim()
        );
      }

      if (employeeStatus !== "ALL") {
        params.append(
          "employeeStatus",
          employeeStatus
        );
      }

      if (selectedEmployeeDate) {
        params.append(
          "employeeDate",
          selectedEmployeeDate
        );
      }

      if (managerSearch.trim()) {
        params.append(
          "managerSearch",
          managerSearch.trim()
        );
      }

      if (managerStatus !== "ALL") {
        params.append(
          "managerStatus",
          managerStatus
        );
      }

      if (selectedManagerDate) {
        params.append(
          "managerDate",
          selectedManagerDate
        );
      }

      const response = await fetch(
        `https://office-management-backend-production.up.railway.app/api/attendance/admin?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch attendance"
        );
      }

      return result;
    },
  });

  const summary = data?.summary || {
    totalEmployees: 0,
    totalManagers: 0,
    presentEmployees: 0,
    presentManagers: 0,
    absentEmployees: 0,
    absentManagers: 0,
  };

  const employeeAttendance =
    data?.employeeAttendance || [];

  const managerAttendance =
    data?.managerAttendance || [];

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getInitials = (name) => {
    if (!name) {
      return "--";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusStyle = (status) => {
    if (status === "PRESENT") {
      return "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600";
    }

    if (status === "LATE") {
      return "rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600";
    }

    if (status === "HALF_DAY") {
      return "rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600";
    }

    return "rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600";
  };

  const getStatusLabel = (status) => {
    if (status === "PRESENT") {
      return "Present";
    }

    if (status === "LATE") {
      return "Late";
    }

    if (status === "HALF_DAY") {
      return "Half Day";
    }

    return "Absent";
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
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-950 p-6 transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
          >
            <Clock size={19} />
            Attendance
          </a>

          <a
            href="/leaves"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <CalendarDays size={19} />
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
            <CreditCard size={19} />
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
                Monitor employee and manager attendance and working hours.
              </p>
            </div>

          </div>

        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">

          <div className="grid grid-cols-6 gap-5 max-2xl:grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Employees
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.totalEmployees}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users size={22} />
                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Managers
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.totalManagers}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Users size={22} />
                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Present Employees
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.presentEmployees}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <UserCheck size={22} />
                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Present Managers
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.presentManagers}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <UserCheck size={22} />
                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Absent Employees
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.absentEmployees}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <UserX size={22} />
                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Absent Managers
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.absentManagers}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <UserX size={22} />
                </div>

              </div>

            </div>

          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Employee Attendance
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Employee attendance records.
                  </p>
                </div>

                <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {employeeAttendance.length} Records
                </div>

              </div>

            </div>

            <div className="border-b border-slate-100 px-6 py-4">

              <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={employeeSearch}
                    onChange={(e) =>
                      setEmployeeSearch(e.target.value)
                    }
                    placeholder="Search employees..."
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                </div>

                <div className="relative">

                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={employeeDate}
                    onChange={(e) =>
                      setEmployeeDate(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                </div>

                <select
                  value={employeeStatus}
                  onChange={(e) =>
                    setEmployeeStatus(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >

                  <option value="ALL">
                    All Status
                  </option>

                  <option value="PRESENT">
                    Present
                  </option>

                  <option value="LATE">
                    Late
                  </option>

                  <option value="HALF_DAY">
                    Half Day
                  </option>

                  <option value="ABSENT">
                    Absent
                  </option>

                </select>

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-237.5">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Check In
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Check Out
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Working Hours
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {isLoading ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center"
                      >

                        <div className="flex items-center justify-center gap-3 text-sm text-slate-500">

                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500"></div>

                          Loading employee attendance...

                        </div>

                      </td>

                    </tr>

                  ) : employeeAttendance.length > 0 ? (

                    employeeAttendance.map(
                      (employee) => (

                        <tr
                          key={employee.id}
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-600">
                                {getInitials(
                                  employee.employee
                                )}
                              </div>

                              <div>

                                <p className="text-sm font-semibold text-slate-800">
                                  {employee.employee}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {employee.email}
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatDate(
                              employee.date
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatTime(
                              employee.checkIn
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatTime(
                              employee.checkOut
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {employee.workingHours ||
                              "-"}
                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={getStatusStyle(
                                employee.status
                              )}
                            >
                              {getStatusLabel(
                                employee.status
                              )}
                            </span>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-6 py-10 text-center text-sm text-slate-400"
                      >
                        No employee attendance records found.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    Manager Attendance
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Manager attendance records.
                  </p>

                </div>

                <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {managerAttendance.length} Records
                </div>

              </div>

            </div>

            <div className="border-b border-slate-100 px-6 py-4">

              <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={managerSearch}
                    onChange={(e) =>
                      setManagerSearch(e.target.value)
                    }
                    placeholder="Search managers..."
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                </div>

                <div className="relative">

                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={managerDate}
                    onChange={(e) =>
                      setManagerDate(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                </div>

                <select
                  value={managerStatus}
                  onChange={(e) =>
                    setManagerStatus(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >

                  <option value="ALL">
                    All Status
                  </option>

                  <option value="PRESENT">
                    Present
                  </option>

                  <option value="LATE">
                    Late
                  </option>

                  <option value="HALF_DAY">
                    Half Day
                  </option>

                  <option value="ABSENT">
                    Absent
                  </option>

                </select>

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-237.5">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Manager
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Check In
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Check Out
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Working Hours
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {isLoading ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center"
                      >

                        <div className="flex items-center justify-center gap-3 text-sm text-slate-500">

                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500"></div>

                          Loading manager attendance...

                        </div>

                      </td>

                    </tr>

                  ) : managerAttendance.length > 0 ? (

                    managerAttendance.map(
                      (manager) => (

                        <tr
                          key={manager.id}
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 font-semibold text-purple-600">
                                {getInitials(
                                  manager.manager
                                )}
                              </div>

                              <div>

                                <p className="text-sm font-semibold text-slate-800">
                                  {manager.manager}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {manager.email}
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatDate(
                              manager.date
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatTime(
                              manager.checkIn
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatTime(
                              manager.checkOut
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {manager.workingHours ||
                              "-"}
                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={getStatusStyle(
                                manager.status
                              )}
                            >
                              {getStatusLabel(
                                manager.status
                              )}
                            </span>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-6 py-10 text-center text-sm text-slate-400"
                      >
                        No manager attendance records found.
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

export default Attendance;
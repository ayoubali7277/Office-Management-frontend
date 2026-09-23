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
  CheckCircle2,
  Timer,
  UserCheck,
  LoaderCircle,
  Calendar,
  UserX,
  Clock3,
  Percent,
} from "lucide-react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import { useState } from "react";

function EmployeeAttendance() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`
  );

  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const queryClient = useQueryClient();

  const {
    data: todayData,
    isLoading: isTodayLoading,
    isError: isTodayError,
  } = useQuery({
    queryKey: ["employee-today-attendance"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/attendance/today",
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

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
  } = useQuery({
    queryKey: ["employee-attendance-summary"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/attendance/summary",
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch attendance summary"
        );
      }

      return result;
    },
  });

  const {
    data: recordsData,
    isLoading: isRecordsLoading,
    isError: isRecordsError,
  } = useQuery({
    queryKey: [
      "employee-attendance-records",
      selectedMonth,
      selectedStatus,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.append("month", selectedMonth);
      params.append("status", selectedStatus);

      const response = await fetch(
        `http://localhost:3000/api/attendance/records?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch attendance records"
        );
      }

      return result;
    },
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/attendance/check-in",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to check in"
        );
      }

      return result;
    },

    onSuccess: (result) => {
      toast.success(result.message);

      queryClient.invalidateQueries({
        queryKey: ["employee-today-attendance"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee-attendance-summary"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee-attendance-records"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/attendance/check-out",
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to check out"
        );
      }

      return result;
    },

    onSuccess: (result) => {
      toast.success(result.message);

      queryClient.invalidateQueries({
        queryKey: ["employee-today-attendance"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee-attendance-summary"],
      });

      queryClient.invalidateQueries({
        queryKey: ["employee-attendance-records"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const attendance = todayData?.attendance;
  const employee = todayData?.employee;
  const summary = summaryData?.summary;
  const records = recordsData?.records || [];

  const getStatusLabel = (status) => {
    const statusLabels = {
      PRESENT: "Present",
      LATE: "Late",
      ABSENT: "Absent",
      HALF_DAY: "Half Day",
    };

    return statusLabels[status] || "Not Started";
  };

  const getStatusClasses = (status) => {
    const statusClasses = {
      PRESENT: "bg-green-50 text-green-600",
      LATE: "bg-yellow-50 text-yellow-600",
      ABSENT: "bg-red-50 text-red-600",
      HALF_DAY: "bg-orange-50 text-orange-600",
    };

    return (
      statusClasses[status] ||
      "bg-slate-100 text-slate-600"
    );
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

  const formatTime = (date) => {
    if (!date) {
      return "--:--";
    }

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCheckIn = () => {
    checkInMutation.mutate();
  };

  const handleCheckOut = () => {
    checkOutMutation.mutate();
  };

  const isCheckingIn = checkInMutation.isPending;
  const isCheckingOut = checkOutMutation.isPending;

  const hasCheckedIn = Boolean(attendance?.checkIn);
  const hasCheckedOut = Boolean(attendance?.checkOut);

  const todayStatus = !attendance
    ? "NOT_STARTED"
    : hasCheckedOut
      ? "CHECKED_OUT"
      : "CHECKED_IN";

  if (isTodayLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <LoaderCircle
          size={32}
          className="animate-spin text-orange-500"
        />
      </div>
    );
  }

  if (isTodayError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Failed to load attendance
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please refresh the page and try again.
          </p>
        </div>
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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
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
                Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Track your daily attendance.
              </p>
            </div>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
            {employee?.name
              ?.split(" ")
              .map((word) => word[0])
              .join("")}
          </div>

        </header>

        <section className="space-y-6 p-8 max-md:p-5 max-sm:p-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between gap-4 max-md:flex-col">

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Today's Attendance
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(
                    attendance?.date || new Date()
                  )}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  todayStatus === "CHECKED_IN"
                    ? "bg-green-50 text-green-600"
                    : todayStatus === "CHECKED_OUT"
                      ? "bg-green-50 text-green-600"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {todayStatus === "CHECKED_IN"
                  ? "Checked In"
                  : todayStatus === "CHECKED_OUT"
                    ? "Checked Out"
                    : attendance?.status === "LATE"
                      ? "Present"
                      : getStatusLabel(
                          attendance?.status
                        )}
              </span>

            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Timer size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Check In
                    </p>

                    <p className="mt-1 text-lg font-semibold text-slate-800">
                      {formatTime(attendance?.checkIn)}
                    </p>
                  </div>

                </div>

              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Check Out
                    </p>

                    <p className="mt-1 text-lg font-semibold text-slate-800">
                      {formatTime(attendance?.checkOut)}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            <div className="mt-5 flex justify-end gap-3 max-sm:flex-col">

              {!attendance && (
                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCheckingIn ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Checking In...
                    </>
                  ) : (
                    <>
                      <UserCheck size={18} />
                      Check In
                    </>
                  )}
                </button>
              )}

              {attendance && !attendance.checkOut && (
                <button
                  type="button"
                  onClick={handleCheckOut}
                  disabled={isCheckingOut}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCheckingOut ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Checking Out...
                    </>
                  ) : (
                    <>
                      <Clock size={18} />
                      Check Out
                    </>
                  )}
                </button>
              )}

              {attendance?.checkOut && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-5 py-2.5 text-sm font-medium text-green-600">
                  <CheckCircle2 size={18} />
                  Attendance Completed
                </div>
              )}

            </div>

          </div>

          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Attendance Summary
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Overview of your attendance records.
              </p>
            </div>

            {isSummaryLoading ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-orange-500"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                      <CheckCircle2 size={19} />
                    </div>

                    <span className="text-2xl font-bold text-slate-900">
                      {summary?.present || 0}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Present
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                      <Clock3 size={19} />
                    </div>

                    <span className="text-2xl font-bold text-slate-900">
                      {summary?.late || 0}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Late
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <Timer size={19} />
                    </div>

                    <span className="text-2xl font-bold text-slate-900">
                      {summary?.halfDay || 0}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Half Day
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <UserX size={19} />
                    </div>

                    <span className="text-2xl font-bold text-slate-900">
                      {summary?.absent || 0}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Absent
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Percent size={19} />
                    </div>

                    <span className="text-2xl font-bold text-slate-900">
                      {summary?.attendanceRate || 0}%
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Attendance Rate
                  </p>
                </div>

              </div>
            )}

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-6">

              <div className="flex items-start justify-between gap-4 max-md:flex-col">

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Attendance Records
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    View your attendance history.
                  </p>
                </div>

                <div className="flex gap-3 max-sm:w-full max-sm:flex-col">

                  <div className="relative">
                    <Calendar
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={(event) =>
                        setSelectedMonth(event.target.value)
                      }
                      className="rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 max-sm:w-full"
                    />
                  </div>

                  <select
                    value={selectedStatus}
                    onChange={(event) =>
                      setSelectedStatus(event.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PRESENT">Present</option>
                    <option value="LATE">Late</option>
                    <option value="ABSENT">Absent</option>
                    <option value="HALF_DAY">Half Day</option>
                  </select>

                </div>

              </div>

            </div>

            {isRecordsLoading ? (
              <div className="flex h-56 items-center justify-center">
                <LoaderCircle
                  size={30}
                  className="animate-spin text-orange-500"
                />
              </div>
            ) : isRecordsError ? (
              <div className="p-8 text-center">
                <h4 className="font-semibold text-slate-900">
                  Failed to load records
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Please try again.
                </p>
              </div>
            ) : records.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Calendar size={21} />
                </div>

                <h4 className="mt-4 font-semibold text-slate-900">
                  No attendance records
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  No attendance records found for the selected filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-162.5 text-left">

                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Check In
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Check Out
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {records.map((record) => (
                      <tr
                        key={record.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          {formatDate(record.date)}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatTime(record.checkIn)}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatTime(record.checkOut)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                              record.status
                            )}`}
                          >
                            {getStatusLabel(record.status)}
                          </span>
                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default EmployeeAttendance;
import {
  LayoutDashboard,
  Bell,
  Users,
  Clock,
  CalendarDays,
  CheckSquare2,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  LoaderCircle,
  CreditCard,
  CircleCheck,
  FileText,
} from "lucide-react";

import { useState } from "react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-hot-toast";

function ManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readingNotificationId, setReadingNotificationId] = useState(null);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["manager-dashboard"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/managers/dashboard",
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch Manager dashboard"
        );
      }

      return result;
    },
  });

  const {
    data: salaryData,
    isLoading: salaryLoading,
    isError: salaryError,
  } = useQuery({
    queryKey: ["manager-payroll"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/payroll/manager",
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch salary information"
        );
      }

      return result;
    },
  });

  const manager = data?.manager;
  const summary = data?.summary;
  const notifications = data?.notifications || [];
  const leaveRequests = data?.leaveRequests || [];
  const recentTasks = data?.recentTasks || [];

  const payrollHistory = salaryData?.payrolls || [];

  const paidPayrolls = payrollHistory.filter(
    (payroll) => payroll.status === "PAID"
  );

  const pendingPayroll = payrollHistory.find(
    (payroll) => payroll.status === "PENDING"
  );

  const latestPayroll = payrollHistory[0];

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const handleNotificationClick = async (notification) => {
    setReadingNotificationId(notification.id);

    try {
      if (!notification.isRead) {
        const response = await fetch(
          `http://localhost:3000/api/notifications/${notification.id}/read`,
          {
            method: "PATCH",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to mark notification as read"
          );
        }

        await queryClient.invalidateQueries({
          queryKey: ["manager-dashboard"],
        });
      }

      setNotificationsOpen(false);

      if (notification.type === "LEAVE") {
        window.location.href = "/manager/leaves";
        return;
      }

      if (notification.type === "TASK") {
        window.location.href = "/manager/tasks";
        return;
      }

      if (notification.type === "PAYROLL") {
        window.location.href = "/manager";
        return;
      }

      if (notification.type === "GENERAL") {
        window.location.href = "/manager";
        return;
      }

      window.location.href = "/manager";
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to mark notification as read"
      );
    } finally {
      setReadingNotificationId(null);
    }
  };

  const formatLeaveType = (type) => {
    const leaveTypes = {
      CASUAL: "Casual Leave",
      SICK: "Sick Leave",
      ANNUAL: "Annual Leave",
      EMERGENCY: "Emergency Leave",
      OTHER: "Other Leave",
    };

    return leaveTypes[type] || type;
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

  const formatShortDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  const formatLeaveDates = (startDate, endDate) => {
    const start = formatShortDate(startDate);
    const end = formatShortDate(endDate);

    if (start === end) {
      return start;
    }

    return `${start} - ${end}`;
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "0";
    }

    return new Intl.NumberFormat("en-PK").format(amount);
  };

  const getInitials = (name) => {
    if (!name) {
      return "";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getPayrollStatusClass = (status) => {
    if (status === "PAID") {
      return "bg-green-50 text-green-600";
    }

    if (status === "PENDING") {
      return "bg-yellow-50 text-yellow-600";
    }

    return "bg-slate-100 text-slate-600";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <LoaderCircle
          size={32}
          className="animate-spin text-orange-500"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Failed to load Manager dashboard
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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
                Welcome back, {manager?.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Let's check out what's happening in your{" "}
                {manager?.department?.name}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 max-sm:gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setNotificationsOpen(!notificationsOpen)
                }
                className="relative cursor-pointer text-slate-500 transition hover:text-orange-500"
              >
                <Bell size={20} />

                {unreadNotifications > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-9 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl max-sm:fixed max-sm:right-4 max-sm:top-16 max-sm:w-[calc(100vw-2rem)]">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Notifications
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {unreadNotifications} unread
                        notifications
                      </p>
                    </div>

                    <Bell
                      size={17}
                      className="text-orange-500"
                    />
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => {
                        const isReading =
                          readingNotificationId ===
                          notification.id;

                        return (
                          <button
                            key={notification.id}
                            type="button"
                            disabled={isReading}
                            onClick={() =>
                              handleNotificationClick(
                                notification
                              )
                            }
                            className={`w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                              !notification.isRead
                                ? "bg-orange-50/40"
                                : ""
                            } ${
                              isReading
                                ? "cursor-wait opacity-70"
                                : ""
                            }`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                  !notification.isRead
                                    ? "bg-orange-500"
                                    : "bg-slate-300"
                                }`}
                              ></div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-medium text-slate-700">
                                    {notification.message}
                                  </p>

                                  {isReading && (
                                    <LoaderCircle
                                      size={15}
                                      className="shrink-0 animate-spin text-orange-500"
                                    />
                                  )}
                                </div>

                                <p className="mt-1 text-xs text-slate-400">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-slate-500">
                          No notifications
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
              {getInitials(manager?.name)}
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    My Employees
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary?.employees || 0}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Users size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Total Employees
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Present Today
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary?.presentToday || 0}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Clock size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Out of {summary?.employees || 0} employees
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Salary Status
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {salaryLoading
                      ? "Loading..."
                      : salaryError
                      ? "Unavailable"
                      :  latestPayroll?.status === "PAID"
                      ? "Paid" 
                      : latestPayroll?.status === "PENDING"
                      ? "Pending"
                      : "No Payroll"}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CreditCard size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                {salaryLoading
                  ? "Checking salary status..."
                  : latestPayroll
                  ? `${latestPayroll.month} salary`
                  : "No payroll record available"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-yellow-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Pending Tasks
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary?.pendingTasks || 0}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                  <CheckSquare2 size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Tasks requiring attention
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Pending Leave Requests
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Requests waiting for your approval.
                  </p>
                </div>

                <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600">
                  {summary?.pendingLeaves || 0} Pending
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {leaveRequests.length > 0 ? (
                  leaveRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0 max-md:flex-col max-md:items-start"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-600">
                          {getInitials(
                            request.employee?.name
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {request.employee?.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {formatLeaveType(request.type)} •{" "}
                            {formatLeaveDates(
                              request.startDate,
                              request.endDate
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 max-md:w-full">
                        <button
                          type="button"
                          className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-600 transition hover:bg-green-100"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-slate-500">
                      No pending leave requests
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Tasks
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Overview of tasks assigned to your team.
                </p>
              </div>

              <div className="mt-5 overflow-x-auto">
                {recentTasks.length > 0 ? (
                  <table className="w-full min-w-162.5">
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
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {recentTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-slate-800">
                            {task.title}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {task.employee?.name}
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
                              {task.priority}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                task.status === "COMPLETED"
                                  ? "bg-green-50 text-green-600"
                                  : task.status === "IN_PROGRESS"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {task.status === "IN_PROGRESS"
                                ? "In Progress"
                                : task.status === "COMPLETED"
                                ? "Completed"
                                : "To Do"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-slate-500">
                      No recent tasks
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 max-sm:flex-col">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <CreditCard size={20} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      My Salary
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      View your salary and payroll history.
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    latestPayroll
                      ? getPayrollStatusClass(
                          latestPayroll.status
                        )
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {salaryLoading
                    ? "Loading"
                    : latestPayroll?.status || "No Payroll"}
                </span>
              </div>

              {salaryLoading ? (
                <div className="flex min-h-32 items-center justify-center">
                  <LoaderCircle
                    size={26}
                    className="animate-spin text-orange-500"
                  />
                </div>
              ) : salaryError ? (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center">
                  <p className="text-sm text-red-600">
                    Unable to load salary information.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Current Salary
                      </p>

                      <p className="mt-2 text-xl font-bold text-slate-900">
                        Rs.{" "}
                        {formatAmount(manager?.salary)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Latest Payroll
                      </p>

                      <p className="mt-2 text-xl font-bold text-slate-900">
                        {latestPayroll
                          ? `Rs. ${formatAmount(
                              latestPayroll.salary
                            )}`
                          : "No Payroll"}
                      </p>

                      {latestPayroll && (
                        <p className="mt-1 text-xs text-slate-400">
                          {latestPayroll.month}
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Payment Status
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        {latestPayroll?.status ===
                          "PAID" && (
                          <CircleCheck
                            size={18}
                            className="text-green-500"
                          />
                        )}

                        <p
                          className={`text-lg font-bold ${
                            latestPayroll?.status ===
                            "PAID"
                              ? "text-green-600"
                              : latestPayroll?.status ===
                                "PENDING"
                              ? "text-yellow-600"
                              : "text-slate-600"
                          }`}
                        >
                          {latestPayroll?.status ||
                            "No Payroll"}
                        </p>
                      </div>

                      {latestPayroll?.paymentDate && (
                        <p className="mt-1 text-xs text-slate-400">
                          Paid on{" "}
                          {formatDate(
                            latestPayroll.paymentDate
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          Salary History
                        </h4>

                        <p className="mt-1 text-xs text-slate-400">
                          Your recent payroll records.
                        </p>
                      </div>

                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                        {payrollHistory.length} Records
                      </span>
                    </div>

                    {payrollHistory.length > 0 ? (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-137.5">
                          <thead className="border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Month
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Salary
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Payment Date
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100">
                            {payrollHistory.map((payroll) => (
                              <tr
                                key={payroll.id}
                                className="transition hover:bg-slate-50"
                              >
                                <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                                  {payroll.month}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-600">
                                  Rs.{" "}
                                  {formatAmount(
                                    payroll.salary
                                  )}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-600">
                                  {formatDate(
                                    payroll.paymentDate
                                  )}
                                </td>

                                <td className="px-4 py-4">
                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${getPayrollStatusClass(
                                      payroll.status
                                    )}`}
                                  >
                                    {payroll.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-dashed border-slate-200 px-6 py-8 text-center">
                        <FileText
                          size={30}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-600">
                          No payroll records found
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Your salary history will appear here
                          once payroll is created.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ManagerDashboard;

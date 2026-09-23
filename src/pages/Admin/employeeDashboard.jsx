import {
  LayoutDashboard,
  Bell,
  Clock,
  CalendarDays,
  CheckSquare2,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  LoaderCircle,
} from "lucide-react";

import { useState } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

const getEmployeeDashboard = async () => {
  const response = await fetch(
    "https://office-management-backend-production.up.railway.app/api/employees/dashboard",
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch employee dashboard"
    );
  }

  return data;
};

function EmployeeDashboard() {
  const queryClient = useQueryClient();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readingNotificationId, setReadingNotificationId] =
    useState(null);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employee-dashboard"],
    queryFn: getEmployeeDashboard,
  });

  if (isError) {
    toast.error(error.message);
  }

  const employee = data?.employee;
  const summary = data?.summary;
  const notifications = data?.notifications || [];
  const recentActivity = data?.recentActivity || [];

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const handleNotificationClick = async (notification) => {
    setReadingNotificationId(notification.id);

    try {
      if (!notification.isRead) {
        const response = await fetch(
          `https://office-management-backend-production.up.railway.app/api/notifications/${notification.id}/read`,
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
          queryKey: ["employee-dashboard"],
        });
      }

      setNotificationsOpen(false);

      if (notification.type === "LEAVE") {
        window.location.href = "/employee/leaves";
        return;
      }

      if (notification.type === "TASK") {
        window.location.href = "/employee/tasks";
        return;
      }

      if (notification.type === "PAYROLL") {
        window.location.href = "/employee/payroll";
        return;
      }

      if (notification.type === "GENERAL") {
        window.location.href = "/employee";
        return;
      }

      window.location.href = "/employee";
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to mark notification as read"
      );
    } finally {
      setReadingNotificationId(null);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <LoaderCircle
          size={32}
          className="animate-spin text-orange-600"
        />
      </div>
    );
  }

  if (!employee || !summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="text-sm text-slate-500">
          Unable to load employee dashboard.
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
            Employee Panel
          </p>
        </div>

        <nav className="mt-8 space-y-2">

          <a
            href="/employee"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
                Welcome back, {employee.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                {employee.department?.name ||
                  "No department assigned"}
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
                        {unreadNotifications} unread notifications
                      </p>

                    </div>

                    <Bell
                      size={17}
                      className="text-orange-500"
                    />

                  </div>

                  <div className="max-h-80 overflow-y-auto">

                    {notifications.length > 0 ? (

                      notifications.map((notification) => (

                        <button
                          key={notification.id}
                          type="button"
                          disabled={
                            readingNotificationId ===
                            notification.id
                          }
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
                            readingNotificationId ===
                            notification.id
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

                              <div className="flex items-start justify-between gap-3">

                                <p className="text-sm font-medium text-slate-700">
                                  {notification.message}
                                </p>

                                {readingNotificationId ===
                                  notification.id && (
                                  <LoaderCircle
                                    size={16}
                                    className="shrink-0 animate-spin text-orange-500"
                                  />
                                )}

                              </div>

                              <p className="mt-1 text-xs text-slate-400">
                                {formatTime(
                                  notification.createdAt
                                )}
                              </p>

                            </div>

                          </div>

                        </button>

                      ))

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
              {getInitials(employee.name)}
            </div>

          </div>

        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Today's Attendance
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-green-600">
                    {summary.attendance}
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Clock size={21} />
                </div>

              </div>

              <p className="mt-4 text-xs text-slate-400">
                Your attendance status for today
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-yellow-200 hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Pending Leaves
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.pendingLeaves}
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                  <CalendarDays size={21} />
                </div>

              </div>

              <p className="mt-4 text-xs text-slate-400">
                Leave requests awaiting approval
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Pending Tasks
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.pendingTasks}
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CheckSquare2 size={21} />
                </div>

              </div>

              <p className="mt-4 text-xs text-slate-400">
                Tasks that need your attention
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest activities and updates.
                </p>

              </div>

            </div>

            <div className="mt-6 space-y-5">

              {recentActivity.length > 0 ? (

                recentActivity.map((activity) => (

                  <div
                    key={activity.id}
                    className="flex items-start gap-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">

                      {activity.type === "ATTENDANCE" && (
                        <Clock size={18} />
                      )}

                      {activity.type === "TASK" && (
                        <CheckSquare2 size={18} />
                      )}

                      {activity.type === "LEAVE" && (
                        <CalendarDays size={18} />
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">

                        <div>

                          <p className="text-sm font-semibold text-slate-800">
                            {activity.title}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {activity.description}
                          </p>

                        </div>

                        <span className="shrink-0 text-xs text-slate-400">
                          {formatTime(activity.time)}
                        </span>

                      </div>

                    </div>

                  </div>

                ))

              ) : (

                <div className="py-8 text-center">

                  <p className="text-sm text-slate-500">
                    No recent activity
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

export default EmployeeDashboard;
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
  Bell,
  UserPlus2,
  Notebook,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const getDashboard = async () => {
  const response = await fetch(
    "http://localhost:3000/api/organization-admin/dashboard",
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch dashboard"
    );
  }

  return data.data;
};

const getCurrentUser = async () => {
  const response = await fetch(
    "http://localhost:3000/api/auth/current-user",
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch current user"
    );
  }

  return data.user;
};

const getNotifications = async () => {
  const response = await fetch(
    "http://localhost:3000/api/notifications",
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch notifications"
    );
  }

  return data.notifications;
};

const markNotificationAsRead = async (notificationId) => {
  const response = await fetch(
    `http://localhost:3000/api/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to mark notification as read"
    );
  }

  return data.notification;
};

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: dashboard,
    isLoading: dashboardLoading,
  } = useQuery({
    queryKey: ["organization-admin-dashboard"],
    queryFn: getDashboard,
  });

  const {
    data: user,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });

  const {
    data: notifications = [],
    isLoading: notificationsLoading,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const notificationMutation = useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const adminName = user?.name
    ? user.name.split(" ").slice(0, 2).join(" ")
    : "Admin";

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  );

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      notificationMutation.mutate(notification.id);
    }

    setNotificationOpen(false);

    if (notification.type === "LEAVE") {
      navigate("/leaves");
      return;
    }

    if (notification.type === "TASK") {
      navigate("/tasks");
      return;
    }

    if (notification.type === "PAYROLL") {
      navigate("/payroll");
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-200">
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
          className="absolute right-4 top-2 text-slate-400 hover:text-white lg:hidden"
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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a
            href="/employees"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <Users size={19} />
            Employees
          </a>

          <a
            href="/departments"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <Building2 size={19} />
            Departments
          </a>

          <a
            href="/attendance"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <Clock size={19} />
            Attendance
          </a>

          <a
            href="/leaves"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <Calendar size={19} />
            Leaves
          </a>

          <a
            href="/tasks"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <CheckSquare2 size={19} />
            Tasks
          </a>

          <a
            href="/payroll"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <LucideCreditCard size={19} />
            Payroll
          </a>

          <a
            href="/reports"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <BarChart2 size={19} />
            Reports
          </a>
        </nav>

        <div className="mt-auto space-y-2">
          <a
            href="/settings"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <Settings size={19} />
            Settings
          </a>

          <a
            href="/login"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <LogOutIcon size={19} />
            Logout
          </a>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <main className="ml-64 min-h-screen bg-slate-100 max-lg:ml-0">
        <header className="flex items-center justify-between bg-white px-8 py-5 max-md:px-5 max-sm:px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="hidden text-slate-900 max-lg:block"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 max-sm:text-xl">
                Dashboard
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Checkout what's happening in the office today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 max-sm:gap-2">
            <div className="relative">
              <button
                onClick={() =>
                  setNotificationOpen(!notificationOpen)
                }
                className="relative cursor-pointer text-slate-500 transition hover:text-orange-600"
              >
                <Bell size={20} />

                {unreadNotifications.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                    {unreadNotifications.length > 9
                      ? "9+"
                      : unreadNotifications.length}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl max-sm:fixed max-sm:right-4 max-sm:top-20 max-sm:w-[calc(100vw-2rem)]">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Notifications
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {unreadNotifications.length} unread
                      </p>
                    </div>

                    <Bell
                      size={18}
                      className="text-orange-500"
                    />
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notificationsLoading ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-slate-400">
                          Loading notifications...
                        </p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-10 text-center">
                        <Bell
                          size={28}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          No notifications yet
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          You're all caught up.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          disabled={
                            notificationMutation.isPending
                          }
                          className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-orange-50 ${
                            notification.isRead
                              ? "bg-white"
                              : "bg-orange-50/50"
                          }`}
                        >
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                            <Bell size={16} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm ${
                                notification.isRead
                                  ? "font-medium text-slate-600"
                                  : "font-semibold text-slate-900"
                              }`}
                            >
                              {notification.message}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <p className="text-xs text-slate-400">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString()}
                              </p>

                              {!notification.isRead && (
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                {adminName.charAt(0).toUpperCase()}
              </div>

              <div className="max-sm:hidden">
                <p className="text-sm font-semibold">
                  {userLoading
                    ? "Loading..."
                    : adminName}
                </p>

                <p className="text-xs text-slate-500">
                  Organization Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="mb-8 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-5">
            <div>
              <h3 className="text-xl font-medium text-slate-900">
                Welcome Back, {adminName}!
              </h3>

              <p className="text-sm text-slate-500">
                Here's your organization overview.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5 max-xl:grid-cols-2 max-sm:grid-cols-1">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
              <p className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Users size={19} />
              </p>

              <p className="text-sm text-slate-500">
                Total Employees
              </p>

              <h4 className="mt-2 text-2xl font-bold">
                {dashboardLoading
                  ? "..."
                  : dashboard?.totalEmployees ?? 0}
              </h4>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
              <p className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Building2 size={19} />
              </p>

              <p className="text-sm text-slate-500">
                Total Managers
              </p>

              <h4 className="mt-2 text-2xl font-bold">
                {dashboardLoading
                  ? "..."
                  : dashboard?.totalManagers ?? 0}
              </h4>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
              <p className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Calendar size={19} />
              </p>

              <p className="text-sm text-slate-500">
                Pending Leaves
              </p>

              <h4 className="mt-2 text-2xl font-bold">
                {dashboardLoading
                  ? "..."
                  : dashboard?.pendingLeaves ?? 0}
              </h4>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
              <p className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Notebook size={19} />
              </p>

              <p className="text-sm text-slate-500">
                Pending Tasks
              </p>

              <h4 className="mt-2 text-2xl font-bold">
                {dashboardLoading
                  ? "..."
                  : dashboard?.pendingTasks ?? 0}
              </h4>
            </div>
          </div>

          <div className="mt-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Recent Activity
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest activity in your organization.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Clock size={20} />
                </div>
              </div>

              <div className="mt-6">
                {dashboardLoading ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-slate-400">
                      Loading recent activity...
                    </p>
                  </div>
                ) : !dashboard?.recentActivities ||
                  dashboard.recentActivities.length === 0 ? (
                  <div className="py-10 text-center">
                    <Clock
                      size={28}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No recent activity
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      New organization activity will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboard.recentActivities.map(
                      (activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                            <UserPlus2 size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-800">
                              {activity.message}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(
                                activity.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
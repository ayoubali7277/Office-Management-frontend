import {
  LayoutDashboard,
  Building2,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Building,
  CheckCircle2,
  Clock3,
  Ban,
  LoaderCircle,
} from "lucide-react";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchSuperAdmin = async () => {
    const response = await fetch(
      "http://localhost:3000/api/super-admin/dashboard",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  };

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["super-admin-dashboard"],
    queryFn: fetchSuperAdmin,
  });

  const fetchRecentOrganizations = async () => {
    const response = await fetch(
      "http://localhost:3000/api/super-admin/organizations/recent",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  };

  const {
    data: recentOrganizationsData,
    isLoading: recentOrganizationsLoading,
  } = useQuery({
    queryKey: ["super-admin-recent-organizations"],
    queryFn: fetchRecentOrganizations,
  });

  const admin = data?.admin;

  const summary = {
    totalOrganizations: data?.organizations?.total ?? 0,
    activeOrganizations: data?.organizations?.active ?? 0,
    pendingOrganizations: data?.organizations?.pending ?? 0,
    inactiveOrganizations: data?.organizations?.inactive ?? 0,
  };

  const fetchNotifications = async () => {
    const response = await fetch(
      "http://localhost:3000/api/super-admin/notifications",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  };

  const markNotificationAsRead = async (notificationId) => {
    const response = await fetch(
      `http://localhost:3000/api/super-admin/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  };

  const {
    data: notificationsData,
    isLoading: notificationsLoading,
  } = useQuery({
    queryKey: ["super-admin-notifications"],
    queryFn: fetchNotifications,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["super-admin-notifications"],
      });
    },
  });

  const notifications = notificationsData?.notifications || [];

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const organizations =
    recentOrganizationsData?.organizations || [];

  const timeAgo = (date) => {
    const minutes = Math.floor(
      (new Date() - new Date(date)) / 60000
    );

    if (minutes < 1) {
      return "Just Now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day ago`;
  };

  const fetchRecentActivities = async () => {
    const response = await fetch(
      "http://localhost:3000/api/super-admin/activities/recent",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  };

  const {
    data: recentActivitiesData,
    isLoading: recentActivitiesLoading,
  } = useQuery({
    queryKey: ["super-admin-recent-activities"],
    queryFn: fetchRecentActivities,
  });

  const activities =
    recentActivitiesData?.activities || [];

  const logoutUser = async () => {
    const response = await fetch(
      "http://localhost:3000/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to logout");
    }

    return data;
  };

  const logoutMutation = useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      setShowLogoutModal(false);

      queryClient.clear();

      window.location.href = "/login";
    },
  });

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-red-600">
            Failed to load dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error.message}
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
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        lg:translate-x-0`}
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
            Office
            <span className="text-orange-500">
              Management
            </span>
          </h1>

          <p className="ml-12 mt-1 text-sm font-medium text-slate-400">
            Super Admin Panel
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          <a
            href="/super-admin"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a
            href="/super-admin/organizations"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Building2 size={19} />
            Pending Organizations
          </a>

          <a
            href="/super-admin/reports"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <BarChart2 size={19} />
            Reports
          </a>
        </nav>

        <div className="mt-auto space-y-2">
          <a
            href="/super-admin/settings"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Settings size={19} />
            Settings
          </a>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LogOut size={19} />
            Logout
          </button>
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
                Welcome back,{" "}
                {isLoading
                  ? "Loading..."
                  : admin?.name || "Super Admin"}
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Here's what's happening across your platform.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 max-sm:gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setNotificationsOpen(
                    !notificationsOpen
                  )
                }
                className="relative cursor-pointer text-slate-500 transition hover:text-orange-500"
              >
                <Bell size={21} />

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
                    {notificationsLoading ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-slate-500">
                          Loading Notifications...
                        </p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map(
                        (notification) => (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() => {
                              if (!notification.isRead) {
                                markAsReadMutation.mutate(
                                  notification.id
                                );
                              }

                              setNotificationsOpen(false);

                              navigate(
                                "/super-admin/organizations"
                              );
                            }}
                            className={`w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                              !notification.isRead
                                ? "bg-orange-50/40"
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

                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-700">
                                  {notification.message}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {timeAgo(
                                    notification.createdAt
                                  )}
                                </p>
                              </div>
                            </div>
                          </button>
                        )
                      )
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
              {admin?.name
                ? admin.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                : "AK"}
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total <br /> Organizations
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.totalOrganizations}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Building size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Registered organizations
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Active <br /> Organizations
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.activeOrganizations}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CheckCircle2 size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Currently active
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-yellow-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Pending Organizations
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.pendingOrganizations}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                  <Clock3 size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Waiting for approval
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Inactive Organizations
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {summary.inactiveOrganizations}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Ban size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Currently inactive
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Recent Organizations
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Recently registered organizations on the platform.
                  </p>
                </div>

                <a
                  href="/super-admin/organizations"
                  className="text-sm font-medium text-orange-500 transition hover:text-orange-600"
                >
                  View All
                </a>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-150">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Organization
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Admin
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        CreatedAt
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentOrganizationsLoading ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-8 text-center text-sm text-slate-500"
                        >
                          Loading organizations...
                        </td>
                      </tr>
                    ) : organizations.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-8 text-center text-sm text-slate-500"
                        >
                          No organizations found.
                        </td>
                      </tr>
                    ) : (
                      organizations.map(
                        (organization) => (
                          <tr
                            key={organization.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                              {organization.name}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {organization.users?.[0]?.name ||
                                "No Admin"}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  organization.status ===
                                  "ACTIVE"
                                    ? "bg-green-50 text-green-600"
                                    : organization.status ===
                                      "PENDING"
                                    ? "bg-yellow-50 text-yellow-600"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                {organization.status}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-500">
                              {new Date(
                                organization.createdAt
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Latest platform activity.
                </p>
              </div>

              <div className="mt-5 space-y-5">
                {recentActivitiesLoading ? (
                  <p className="text-sm text-slate-500">
                    Loading Activities...
                  </p>
                ) : activities.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No Recent Activity
                  </p>
                ) : (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex gap-3"
                    >
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500"></div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700">
                          {activity.message}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {timeAgo(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 `z-[100]` flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Confirm Logout
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to logout from your account?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowLogoutModal(false)
                }
                disabled={logoutMutation.isPending}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {logoutMutation.isPending && (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                )}

                {logoutMutation.isPending
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminDashboard;
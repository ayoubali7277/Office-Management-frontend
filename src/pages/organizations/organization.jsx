import {
  LayoutDashboard,
  Building2,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Check,
  XCircle,
  Ban,
  RotateCcw,
  LoaderCircle,
} from "lucide-react";

import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

const approveOrganization = async (organizationId) => {
  const response = await fetch(
    `http://localhost:3000/api/super-admin/organizations/${organizationId}/approve`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to approve organization."
    );
  }

  return data;
};

const rejectOrganization = async (organizationId) => {
  const response = await fetch(
    `http://localhost:3000/api/super-admin/organizations/${organizationId}/reject`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to reject organization."
    );
  }

  return data;
};

const getPendingOrganizations = async () => {
  const response = await fetch(
    "http://localhost:3000/api/super-admin/organizations/pending",
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch organizations."
    );
  }

  return data;
};

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
    throw new Error(
      data.message || "Unable to logout"
    );
  }

  return data;
};

function SuperAdminOrganizations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] =
    useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pending-organizations"],
    queryFn: getPendingOrganizations,
  });

  const organizations = data?.organizations || [];

  const approveMutation = useMutation({
    mutationFn: approveOrganization,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending-organizations"],
      });

      toast.success(
        "Organization approved successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error.message ||
          "Failed to approve organization."
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectOrganization,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending-organizations"],
      });

      toast.success(
        "Organization rejected successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error.message ||
          "Failed to reject organization."
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      setShowLogoutModal(false);

      queryClient.clear();

      window.location.href = "/login";
    },

    onError: (error) => {
      toast.error(
        error.message || "Unable to logout"
      );
    },
  });

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((organization) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        organization.name
          .toLowerCase()
          .includes(searchValue) ||
        organization.users?.[0]?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        organization.users?.[0]?.email
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        organization.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [organizations, search, statusFilter]);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  };

  const getStatusClasses = (status) => {
    if (status === "ACTIVE") {
      return "bg-green-50 text-green-600";
    }

    if (status === "PENDING") {
      return "bg-yellow-50 text-yellow-600";
    }

    if (status === "INACTIVE") {
      return "bg-slate-100 text-slate-600";
    }

    return "bg-red-50 text-red-600";
  };

  const getActionButton = (organization) => {
    const isAcceptLoading =
      approveMutation.isPending &&
      approveMutation.variables === organization.id;

    const isRejectLoading =
      rejectMutation.isPending &&
      rejectMutation.variables === organization.id;

    const isAnyActionLoading =
      isAcceptLoading || isRejectLoading;

    if (organization.status === "PENDING") {
      return (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isAnyActionLoading}
            onClick={() =>
              approveMutation.mutate(
                organization.id
              )
            }
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAcceptLoading ? (
              <LoaderCircle
                size={15}
                className="animate-spin"
              />
            ) : (
              <Check size={15} />
            )}

            {isAcceptLoading
              ? "Accepting..."
              : "Accept"}
          </button>

          <button
            type="button"
            disabled={isAnyActionLoading}
            onClick={() =>
              rejectMutation.mutate(
                organization.id
              )
            }
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRejectLoading ? (
              <LoaderCircle
                size={15}
                className="animate-spin"
              />
            ) : (
              <XCircle size={15} />
            )}

            {isRejectLoading
              ? "Rejecting..."
              : "Reject"}
          </button>
        </div>
      );
    }

    if (organization.status === "ACTIVE") {
      return (
        <span className="text-xs font-medium text-slate-400">
          No action
        </span>
      );
    }

    if (organization.status === "INACTIVE") {
      return (
        <span className="text-xs font-medium text-slate-400">
          No action
        </span>
      );
    }

    return (
      <span className="text-xs font-medium text-slate-400">
        No action
      </span>
    );
  };

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-red-600">
            Failed to load organizations
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
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-950 p-6 transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a
            href="/super-admin/organizations"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
            onClick={() =>
              setShowLogoutModal(true)
            }
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
                Organizations
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Manage organizations registered on your platform.
              </p>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
            AK
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Building2 size={21} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Organizations
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Search and manage platform organizations.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search organization, admin or email..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
              >
                <option value="ALL">
                  All Statuses
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>

                <option value="REJECTED">
                  Rejected
                </option>
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Organization List
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {isLoading
                  ? "Loading organizations..."
                  : `${filteredOrganizations.length} organizations found.`}
              </p>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-225">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Organization
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Admin
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Joined
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-12 text-center"
                      >
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                          <LoaderCircle
                            size={18}
                            className="animate-spin"
                          />
                          Loading organizations...
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrganizations.length > 0 ? (
                    filteredOrganizations.map(
                      (organization) => (
                        <tr
                          key={organization.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                <Building2 size={17} />
                              </div>

                              <span className="text-sm font-semibold text-slate-800">
                                {organization.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {organization.users?.[0]
                              ?.name || "N/A"}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-500">
                            {organization.users?.[0]
                              ?.email || "N/A"}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                organization.status
                              )}`}
                            >
                              {organization.status}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-500">
                            {formatDate(
                              organization.createdAt
                            )}
                          </td>

                          <td className="px-4 py-4">
                            {getActionButton(
                              organization
                            )}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-12 text-center"
                      >
                        <div className="flex flex-col items-center">
                          <Building2
                            size={28}
                            className="text-slate-300"
                          />

                          <p className="mt-3 text-sm font-medium text-slate-600">
                            No organizations found
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Try changing your search or status
                            filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                onClick={() =>
                  logoutMutation.mutate()
                }
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

export default SuperAdminOrganizations;
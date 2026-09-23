import {
  LayoutDashboard,
  Building2,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  LoaderCircle,
  CircleCheck,
  Clock3,
  Ban,
  XCircle,
} from "lucide-react";

import { useMemo, useState } from "react";
import {
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

function SuperAdminReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrganizationReports = async () => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/super-admin/organizations/reports",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return {
      ...data,
      organizations: data.organizations.map((organization) => ({
        ...organization,
        admin: organization.users?.[0]?.name || "_",
        email: organization.users?.[0]?.email || "_",
        joinedAt: organization.createdAt,
      })),
    };
  };

  const {
    data: organizationReportsData,
    isLoading: organizationsLoading,
    isError: organizationsError,
    error: organizationsErrorData,
    refetch,
  } = useQuery({
    queryKey: ["super-admin-organization-reports"],
    queryFn: fetchOrganizationReports,
  });

  const deactivateOrganization = async (organizationId) => {
    const response = await fetch(
      `https://office-management-backend-production.up.railway.app/api/super-admin/organizations/${organizationId}/deactivate`,
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

  const deactivateMutation = useMutation({
    mutationFn: deactivateOrganization,

    onSuccess: () => {
      toast.success("Organization deactivated successfully");

      queryClient.invalidateQueries({
        queryKey: ["super-admin-organization-reports"],
      });
    },

    onError: (error) => {
      toast.error(
        error.message || "Failed to deactivate organization"
      );
    },
  });

  const activateOrganization = async (organizationId) => {
    const response = await fetch(
      `https://office-management-backend-production.up.railway.app/api/super-admin/organizations/${organizationId}/activate`,
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

  const activateMutation = useMutation({
    mutationFn: activateOrganization,

    onSuccess: () => {
      toast.success("Organization activated successfully");

      queryClient.invalidateQueries({
        queryKey: ["super-admin-organization-reports"],
      });
    },

    onError: (error) => {
      toast.error(
        error.message || "Failed to activate organization"
      );
    },
  });

  const logoutUser = async () => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/auth/logout",
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

  const organizations =
    organizationReportsData?.organizations || [];

  const reportStats = useMemo(() => {
    return {
      total: organizations.length,

      active: organizations.filter(
        (organization) =>
          organization.status === "ACTIVE"
      ).length,

      pending: organizations.filter(
        (organization) =>
          organization.status === "PENDING"
      ).length,

      inactive: organizations.filter(
        (organization) =>
          organization.status === "INACTIVE"
      ).length,

      rejected: organizations.filter(
        (organization) =>
          organization.status === "REJECTED"
      ).length,
    };
  }, [organizations]);

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((organization) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        organization.name
          .toLowerCase()
          .includes(searchValue) ||
        organization.admin
          .toLowerCase()
          .includes(searchValue) ||
        organization.email
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        organization.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [organizations, search, statusFilter]);

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

  const getStatusIcon = (status) => {
    if (status === "ACTIVE") {
      return <CircleCheck size={16} />;
    }

    if (status === "PENDING") {
      return <Clock3 size={16} />;
    }

    if (status === "INACTIVE") {
      return <Ban size={16} />;
    }

    return <XCircle size={16} />;
  };

  const summaryCards = [
    {
      title: "Total Organizations",
      value: reportStats.total,
      icon: Building2,
      description: "All registered organizations",
    },
    {
      title: "Active Organizations",
      value: reportStats.active,
      icon: CircleCheck,
      description: "Currently active",
    },
    {
      title: "Pending Organizations",
      value: reportStats.pending,
      icon: Clock3,
      description: "Waiting for approval",
    },
    {
      title: "Inactive Organizations",
      value: reportStats.inactive,
      icon: Ban,
      description: "Not currently active",
    },
    {
      title: "Rejected Organizations",
      value: reportStats.rejected,
      icon: XCircle,
      description: "Rejected Organizations",
    },
  ];

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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Building2 size={19} />
            Pending Organizations
          </a>

          <a
            href="/super-admin/reports"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
                Reports
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                View a simple overview of your platform organizations.
              </p>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
            AK
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Organization Reports
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Platform-wide organization statistics and status overview.
            </p>
          </div>

          {organizationsLoading && (
            <div className="mt-6 flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
              <div className="flex flex-col items-center">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-orange-500"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading reports...
                </p>
              </div>
            </div>
          )}

          {!organizationsLoading && organizationsError && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-red-600">
                {organizationsErrorData.message}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Try Again
              </button>
            </div>
          )}

          {!organizationsLoading &&
            !organizationsError && (
              <>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
                  {summaryCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <div
                        key={card.title}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            <Icon size={21} />
                          </div>

                          <span className="text-2xl font-bold text-slate-900">
                            {card.value}
                          </span>
                        </div>

                        <h4 className="mt-5 text-sm font-semibold text-slate-800">
                          {card.title}
                        </h4>

                        <p className="mt-1 text-xs text-slate-400">
                          {card.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4 max-sm:flex-col">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Organization Summary
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {filteredOrganizations.length} organizations found.
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

                      <option value="ACTIVE">
                        Active
                      </option>

                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="INACTIVE">
                        Inactive
                      </option>

                      <option value="REJECTED">
                        Rejected
                      </option>
                    </select>
                  </div>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-212.5">
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
                        {filteredOrganizations.length > 0 ? (
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
                                  {organization.admin}
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-500">
                                  {organization.email}
                                </td>

                                <td className="px-4 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                      organization.status
                                    )}`}
                                  >
                                    {getStatusIcon(
                                      organization.status
                                    )}

                                    {organization.status}
                                  </span>
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-500">
                                  {new Date(
                                    organization.joinedAt
                                  ).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </td>

                                <td className="px-4 py-4">
                                  {organization.status ===
                                    "ACTIVE" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        deactivateMutation.mutate(
                                          organization.id
                                        )
                                      }
                                      disabled={
                                        deactivateMutation.isPending
                                      }
                                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {deactivateMutation.isPending &&
                                      deactivateMutation.variables ===
                                        organization.id
                                        ? "Deactivating..."
                                        : "Deactivate"}
                                    </button>
                                  )}

                                  {organization.status ===
                                    "INACTIVE" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        activateMutation.mutate(
                                          organization.id
                                        )
                                      }
                                      disabled={
                                        activateMutation.isPending
                                      }
                                      className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {activateMutation.isPending &&
                                      activateMutation.variables ===
                                        organization.id
                                        ? "Activating..."
                                        : "Activate"}
                                    </button>
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
                                  Try changing your search or status filter.
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
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

export default SuperAdminReports;

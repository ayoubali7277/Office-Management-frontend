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
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

const API_URL =
  "https://office-management-backend-production.up.railway.app";

function Leaves() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminLeaves"],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/leaves/admin`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch leave requests"
        );
      }

      return result;
    },
  });

  const leaveRequests = data?.leaves || [];

  const updateLeaveMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      const response = await fetch(
        `${API_URL}/api/leaves/admin/${id}/${action}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `Failed to ${action} leave`
        );
      }

      return result;
    },

    onSuccess: (result) => {
      toast.success(
        result.message || "Leave status updated successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["adminLeaves"],
      });
    },

    onError: (error) => {
      toast.error(
        error.message || "Something went wrong"
      );
    },
  });

  const handleLeaveAction = (id, action) => {
    updateLeaveMutation.mutate({
      id,
      action,
    });
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-GB");
  };

  const getLeaveType = (type) => {
    const leaveTypes = {
      CASUAL: "Casual Leave",
      SICK: "Sick Leave",
      ANNUAL: "Annual Leave",
      EMERGENCY: "Emergency Leave",
      OTHER: "Other",
    };

    return leaveTypes[type] || type;
  };

  const getInitials = (name) => {
    if (!name) {
      return "NA";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusClasses = (status) => {
    if (status === "PENDING") {
      return "bg-yellow-50 text-yellow-600";
    }

    if (status === "APPROVED") {
      return "bg-green-50 text-green-600";
    }

    return "bg-red-50 text-red-600";
  };

  const getStatusText = (status) => {
    if (status === "PENDING") {
      return "Pending";
    }

    if (status === "APPROVED") {
      return "Approved";
    }

    if (status === "REJECTED") {
      return "Rejected";
    }

    return status;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-600">
          Loading Leave Requests...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-red-600">
          {error?.message || "Failed to load leave requests."}
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
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Clock size={19} />
            Attendance
          </a>

          <a
            href="/leaves"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
          >
            <Calendar size={19} />
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
            <LucideCreditCard size={19} />
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
            <LogOutIcon size={19} />
            Logout
          </a>
        </div>
      </aside>

      <main className="ml-64 min-h-screen max-lg:ml-0">
        <header className="flex items-center bg-white px-8 py-5 max-md:px-5 max-sm:px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="hidden text-slate-600 transition hover:text-orange-600 max-lg:block"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 max-sm:text-xl">
                Leave Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Manage leave requests submitted by managers.
              </p>
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Manager Leave Requests
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Review and manage leave requests from department managers.
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Manager
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Leave Type
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Duration
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Reason
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {leaveRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-10 text-center text-sm text-slate-500"
                      >
                        No leave requests found.
                      </td>
                    </tr>
                  ) : (
                    leaveRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-600">
                              {getInitials(request.manager?.name)}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {request.manager?.name || "Unknown"}
                              </p>

                              <p className="text-xs text-slate-400">
                                Manager
                              </p>

                              <p className="text-xs text-slate-400">
                                {request.manager?.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {getLeaveType(request.type)}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div>
                            <p>
                              {formatDate(request.startDate)}
                            </p>

                            <p>
                              {formatDate(request.endDate)}
                            </p>
                          </div>
                        </td>

                        <td className="max-w-xs px-6 py-4 text-sm text-slate-600">
                          <p className="break-words">
                            {request.reason || "No reason provided"}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                              request.status
                            )}`}
                          >
                            {getStatusText(request.status)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {request.status === "PENDING" ? (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={updateLeaveMutation.isPending}
                                onClick={() =>
                                  handleLeaveAction(
                                    request.id,
                                    "approve"
                                  )
                                }
                                className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                disabled={updateLeaveMutation.isPending}
                                onClick={() =>
                                  handleLeaveAction(
                                    request.id,
                                    "reject"
                                  )
                                }
                                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Processed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
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

export default Leaves;
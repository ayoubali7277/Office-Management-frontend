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
  Search,
  Plus,
  LoaderCircle,
} from "lucide-react";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function LeaveRequests() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    startDate: "",
    endDate: "",
    type: "CASUAL",
    reason: "",
  });

  const queryClient = useQueryClient();

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
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
    data: leaveData,
    isLoading: leavesLoading,
    isError: leavesError,
  } = useQuery({
    queryKey: ["manager-leaves"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/leaves/manager",
        {
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

  const {
    data: myLeaveData,
    isLoading: myLeavesLoading,
  } = useQuery({
    queryKey: ["my-leaves"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/leaves/my",
        {
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch your leaves"
        );
      }

      return result;
    },
    enabled: leaveModalOpen,
  });

  const approveMutation = useMutation({
    mutationFn: async (leaveId) => {
      const response = await fetch(
        `http://localhost:3000/api/leaves/${leaveId}/approve`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to approve leave"
        );
      }

      return result;
    },

    onSuccess: (result) => {
      toast.success(result.message || "Leave approved successfully");

      queryClient.invalidateQueries({
        queryKey: ["manager-leaves"],
      });

      queryClient.invalidateQueries({
        queryKey: ["manager-dashboard"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (leaveId) => {
      const response = await fetch(
        `http://localhost:3000/api/leaves/${leaveId}/reject`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to reject leave"
        );
      }

      return result;
    },

    onSuccess: (result) => {
      toast.success(result.message || "Leave rejected successfully");

      queryClient.invalidateQueries({
        queryKey: ["manager-leaves"],
      });

      queryClient.invalidateQueries({
        queryKey: ["manager-dashboard"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createLeaveMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(
        "http://localhost:3000/api/leaves",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to submit leave request"
        );
      }

      return result;
    },

    onSuccess: (result) => {
      toast.success(
        result.message || "Leave request submitted successfully"
      );

      setLeaveForm({
        startDate: "",
        endDate: "",
        type: "CASUAL",
        reason: "",
      });

      setLeaveModalOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["my-leaves"],
      });

      queryClient.invalidateQueries({
        queryKey: ["manager-dashboard"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const manager = dashboardData?.manager;

  const leaveRequests = leaveData?.leaves || [];
  const myLeaves = myLeaveData?.leaves || [];

  const filteredLeaveRequests = leaveRequests.filter((request) => {
    const employeeName = request.employee?.name || "";

    const matchesSearch = employeeName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
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
      .toUpperCase();
  };

  const handleApprove = (leaveId) => {
    approveMutation.mutate(leaveId);
  };

  const handleReject = (leaveId) => {
    rejectMutation.mutate(leaveId);
  };

  const handleLeaveFormChange = (e) => {
    const { name, value } = e.target;

    setLeaveForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateLeave = (e) => {
    e.preventDefault();

    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast.error("Please fill all fields");
      return;
    }

    if (leaveForm.startDate > leaveForm.endDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    createLeaveMutation.mutate(leaveForm);
  };

  const handleCloseModal = () => {
    if (createLeaveMutation.isPending) {
      return;
    }

    setLeaveModalOpen(false);

    setLeaveForm({
      startDate: "",
      endDate: "",
      type: "CASUAL",
      reason: "",
    });
  };

  const isActionLoading =
    approveMutation.isPending || rejectMutation.isPending;

  if (dashboardLoading || leavesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <LoaderCircle
          size={32}
          className="animate-spin text-orange-500"
        />
      </div>
    );
  }

  if (leavesError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Failed to load leave requests
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Clock size={19} />
            Attendance
          </a>

          <a
            href="/manager/leaves"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
                Leave Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Manage and review leave requests from your team.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 max-sm:gap-2">
            <button
              type="button"
              onClick={() => setLeaveModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              <Plus size={18} />
              <span className="max-sm:hidden">My Leave</span>
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
              {getInitials(manager?.name)}
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Team Leave Requests
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review leave requests submitted by your team.
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

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-245">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Employee
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Leave Type
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Start Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      End Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Reason
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredLeaveRequests.length > 0 ? (
                    filteredLeaveRequests.map((request) => {
                      const isApproving =
                        approveMutation.isPending &&
                        approveMutation.variables === request.id;

                      const isRejecting =
                        rejectMutation.isPending &&
                        rejectMutation.variables === request.id;

                      return (
                        <tr
                          key={request.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-600">
                                {getInitials(request.employee?.name)}
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {request.employee?.name}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  {request.employee?.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {formatLeaveType(request.type)}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {formatDate(request.startDate)}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {formatDate(request.endDate)}
                          </td>

                          <td className="max-w-48 px-4 py-4 text-sm text-slate-600">
                            {request.reason}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                request.status === "PENDING"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : request.status === "APPROVED"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {request.status.charAt(0) +
                                request.status.slice(1).toLowerCase()}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            {request.status === "PENDING" ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  disabled={isActionLoading}
                                  onClick={() =>
                                    handleApprove(request.id)
                                  }
                                  className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isApproving && (
                                    <LoaderCircle
                                      size={14}
                                      className="animate-spin"
                                    />
                                  )}

                                  {isApproving
                                    ? "Approving..."
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  disabled={isActionLoading}
                                  onClick={() =>
                                    handleReject(request.id)
                                  }
                                  className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isRejecting && (
                                    <LoaderCircle
                                      size={14}
                                      className="animate-spin"
                                    />
                                  )}

                                  {isRejecting
                                    ? "Rejecting..."
                                    : "Reject"}
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">
                                No action
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        No leave requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {leaveModalOpen && (
        <div className="fixed inset-0 `z-[60]` flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  My Leave
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Submit a leave request or view your leave history.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 transition hover:text-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleCreateLeave}>
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Start Date
                    </label>

                    <input
                      type="date"
                      name="startDate"
                      value={leaveForm.startDate}
                      onChange={handleLeaveFormChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      End Date
                    </label>

                    <input
                      type="date"
                      name="endDate"
                      value={leaveForm.endDate}
                      onChange={handleLeaveFormChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Leave Type
                  </label>

                  <select
                    name="type"
                    value={leaveForm.type}
                    onChange={handleLeaveFormChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
                  >
                    <option value="CASUAL">Casual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="ANNUAL">Annual Leave</option>
                    <option value="EMERGENCY">Emergency Leave</option>
                    <option value="OTHER">Other Leave</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Reason
                  </label>

                  <textarea
                    name="reason"
                    value={leaveForm.reason}
                    onChange={handleLeaveFormChange}
                    rows="4"
                    placeholder="Enter reason for leave..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
                  ></textarea>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={createLeaveMutation.isPending}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={createLeaveMutation.isPending}
                    className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {createLeaveMutation.isPending && (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                    )}

                    {createLeaveMutation.isPending
                      ? "Submitting..."
                      : "Submit Leave"}
                  </button>
                </div>
              </form>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">
                    My Leave History
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Your submitted leave requests.
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {myLeavesLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <LoaderCircle
                        size={22}
                        className="animate-spin text-orange-500"
                      />
                    </div>
                  ) : myLeaves.length > 0 ? (
                    myLeaves.map((leave) => (
                      <div
                        key={leave.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {formatLeaveType(leave.type)}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(leave.startDate)} -{" "}
                              {formatDate(leave.endDate)}
                            </p>

                            <p className="mt-2 text-sm text-slate-600">
                              {leave.reason}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                              leave.status === "PENDING"
                                ? "bg-yellow-50 text-yellow-600"
                                : leave.status === "APPROVED"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {leave.status.charAt(0) +
                              leave.status.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-5 text-center text-sm text-slate-400">
                      You have not submitted any leave requests yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveRequests;
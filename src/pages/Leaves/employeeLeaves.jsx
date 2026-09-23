import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  CheckSquare2,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Send,
  LoaderCircle,
} from "lucide-react";

import { useState } from "react";

function EmployeeLeaveRequests() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const employee = {
    name: "Ahmed Raza",
    department: "IT Department",
  };

  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      leaveType: "Casual Leave",
      fromDate: "2026-08-18",
      toDate: "2026-08-19",
      reason: "Personal work",
      status: "APPROVED",
    },
    {
      id: 2,
      leaveType: "Sick Leave",
      fromDate: "2026-08-22",
      toDate: "2026-08-22",
      reason: "Not feeling well",
      status: "PENDING",
    },
    {
      id: 3,
      leaveType: "Annual Leave",
      fromDate: "2026-07-10",
      toDate: "2026-07-12",
      reason: "Family vacation",
      status: "REJECTED",
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();

    if (
      !formData.leaveType ||
      !formData.fromDate ||
      !formData.toDate ||
      !formData.reason.trim()
    ) {
      return;
    }

    if (formData.toDate < formData.fromDate) {
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newLeaveRequest = {
        id: Date.now(),
        leaveType:
          formData.leaveType === "CASUAL"
            ? "Casual Leave"
            : formData.leaveType === "SICK"
            ? "Sick Leave"
            : formData.leaveType === "ANNUAL"
            ? "Annual Leave"
            : "Emergency Leave",
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
        status: "PENDING",
      };

      setLeaveRequests((previousRequests) => [
        newLeaveRequest,
        ...previousRequests,
      ]);

      setFormData({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "APPROVED") {
      return "bg-green-50 text-green-600";
    }

    if (status === "REJECTED") {
      return "bg-red-50 text-red-600";
    }

    return "bg-yellow-50 text-yellow-600";
  };

  const getStatusLabel = (status) => {
    if (status === "APPROVED") {
      return "Approved";
    }

    if (status === "REJECTED") {
      return "Rejected";
    }

    return "Pending";
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

  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) {
      return 0;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const difference =
      (end - start) / (1000 * 60 * 60 * 24);

    return difference >= 0 ? difference + 1 : 0;
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Clock size={19} />
            Attendance
          </a>

          <a
            href="/employee/leaves"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
                Leave Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Apply for leave and track your leave requests.
              </p>
            </div>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
            {employee.name
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </div>

        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <CalendarDays size={20} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Apply for Leave
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Submit a new leave request for approval.
                </p>
              </div>

            </div>

            <form
              onSubmit={handleSubmitLeave}
              className="mt-6"
            >

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Leave Type
                  </label>

                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
                  >
                    <option value="">
                      Select leave type
                    </option>

                    <option value="CASUAL">
                      Casual Leave
                    </option>

                    <option value="SICK">
                      Sick Leave
                    </option>

                    <option value="ANNUAL">
                      Annual Leave
                    </option>

                    <option value="EMERGENCY">
                      Emergency Leave
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    From Date
                  </label>

                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    To Date
                  </label>

                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    min={formData.fromDate || undefined}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
                  />
                </div>

                <div className="flex items-end">

                  <div className="w-full rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium text-slate-400">
                      Leave Duration
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {calculateDays(
                        formData.fromDate,
                        formData.toDate
                      )}{" "}
                      {calculateDays(
                        formData.fromDate,
                        formData.toDate
                      ) === 1
                        ? "Day"
                        : "Days"}
                    </p>
                  </div>

                </div>

              </div>

              <div className="mt-5">

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Enter the reason for your leave..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-orange-400"
                ></textarea>

              </div>

              <div className="mt-5 flex justify-end">

                <button
                  type="submit"
                  disabled={loading}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Request
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between gap-4 max-sm:flex-col">

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  My Leave Requests
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  View the status of your previous leave requests.
                </p>
              </div>

              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                {leaveRequests.length} Requests
              </span>

            </div>

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-225">

                <thead className="border-b border-slate-200">

                  <tr>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Leave Type
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      From
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      To
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Duration
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Reason
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {leaveRequests.map((request) => (

                    <tr
                      key={request.id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                        {request.leaveType}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatDate(request.fromDate)}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatDate(request.toDate)}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {calculateDays(
                          request.fromDate,
                          request.toDate
                        )}{" "}
                        {calculateDays(
                          request.fromDate,
                          request.toDate
                        ) === 1
                          ? "Day"
                          : "Days"}
                      </td>

                      <td className="max-w-60 px-4 py-4 text-sm text-slate-500">
                        {request.reason}
                      </td>

                      <td className="px-4 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {getStatusLabel(request.status)}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default EmployeeLeaveRequests;
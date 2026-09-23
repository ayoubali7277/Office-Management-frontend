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
  LoaderCircle,
  Calendar,
  CircleCheck,
  FileText,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function EmployeePayroll() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchPayroll = async () => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/payroll/employee",
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch payroll");
    }

    return data;
  };

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employee-payroll"],
    queryFn: fetchPayroll,
  });

  const employee = data?.employee;
  const payrollHistory = data?.payrolls || [];

  const paidPayrolls = payrollHistory.filter(
    (payroll) => payroll.status === "PAID"
  );

  const lastPayment = paidPayrolls[0];

  const pendingPayment = payrollHistory.find(
    (payroll) => payroll.status === "PENDING"
  );

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "0";
    }

    return new Intl.NumberFormat("en-PK").format(amount);
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

  const getStatusClass = (status) => {
    if (status === "PAID") {
      return "bg-green-50 text-green-600";
    }

    if (status === "PENDING") {
      return "bg-yellow-50 text-yellow-600";
    }

    return "bg-slate-100 text-slate-600";
  };

  const getInitials = (name) => {
    if (!name) {
      return "EM";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
                Payroll
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                View your salary details and payment history.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
              {getInitials(employee?.name)}
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          {isLoading ? (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <LoaderCircle
                  size={30}
                  className="animate-spin text-orange-500"
                />

                <p className="text-sm text-slate-500">
                  Loading payroll information...
                </p>
              </div>
            </div>
          ) : isError ? (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-red-100 bg-white shadow-sm">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  Unable to load payroll
                </h3>

                <p className="mt-2 text-sm text-red-500">
                  {error?.message || "Something went wrong"}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600">
                    {getInitials(employee?.name)}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {employee?.name || "Employee"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {employee?.department?.name || "Department not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Current Salary
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-slate-900">
                        Rs. {formatAmount(employee?.salary)}
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 font-bold text-orange-600">
                      RS
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    Current monthly salary
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Last Payment
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-slate-900">
                        {lastPayment
                          ? `Rs. ${formatAmount(lastPayment.salary)}`
                          : "No Payment"}
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                      <CircleCheck size={21} />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    {lastPayment
                      ? `${lastPayment.month} • ${formatDate(
                          lastPayment.paymentDate
                        )}`
                      : "No paid payroll available"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Pending Payment
                      </p>

                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        {pendingPayment
                          ? pendingPayment.month
                          : "No Pending Payroll"}
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Calendar size={21} />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    {pendingPayment
                      ? `Amount: Rs. ${formatAmount(
                          pendingPayment.salary
                        )}`
                      : "No pending payment at the moment"}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 max-sm:flex-col">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <FileText size={20} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Salary History
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Your previous salary payments.
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                    {payrollHistory.length} Records
                  </span>
                </div>

                {payrollHistory.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center">
                    <FileText
                      size={32}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      No payroll records found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Your salary history will appear here once payroll is
                      created.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-190">
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
                        {payrollHistory.map((record) => (
                          <tr
                            key={record.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                              {record.month}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              Rs. {formatAmount(record.salary)}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {formatDate(record.paymentDate)}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                  record.status
                                )}`}
                              >
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default EmployeePayroll;


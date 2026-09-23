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

function Leaves() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      manager: "Ahmad Ali",
      department: "IT",
      leaveType: "Annual Leave",
      startDate: "Aug 26",
      endDate: "Aug 28",
      status: "PENDING",
    },
    {
      id: 2,
      manager: "Usman Khan",
      department: "HR",
      leaveType: "Sick Leave",
      startDate: "Aug 27",
      endDate: "Aug 27",
      status: "PENDING",
    },
  ]);

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

              <table className="w-full min-w-200px">

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
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {leaveRequests.map((request) => (

                    <tr
                      key={request.id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-600">
                            {request.manager
                              .split(" ")
                              .map((word) => word[0])
                              .join("")}
                          </div>

                          <div>

                            <p className="text-sm font-semibold text-slate-800">
                              {request.manager}
                            </p>

                            <p className="text-xs text-slate-400">
                              {request.department} Manager
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {request.leaveType}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {request.startDate} - {request.endDate}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium
                          ${
                            request.status === "PENDING"
                              ? "bg-yellow-50 text-yellow-600"
                              : request.status === "APPROVED"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {request.status === "PENDING"
                            ? "Pending"
                            : request.status === "APPROVED"
                            ? "Approved"
                            : "Rejected"}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex gap-2">

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

export default Leaves;
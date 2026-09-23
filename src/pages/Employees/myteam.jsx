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
  Eye,
} from "lucide-react";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

function MyTeam() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const {
    data: managerData,
    isLoading: managerLoading,
    isError: managerError,
  } = useQuery({
    queryKey: ["manager-dashboard"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/managers/dashboard",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch manager data"
        );
      }

      return data;
    },
  });

  const {
    data: teamData,
    isLoading: teamLoading,
    isError: teamError,
    error: teamErrorData,
    refetch: refetchTeam,
  } = useQuery({
    queryKey: ["manager-team"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/employees/manager-team",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch team employees"
        );
      }

      return data;
    },
  });

  const manager = managerData?.manager;

  const employees = teamData?.employees || [];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      employee.email
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      employee.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getInitials = (name) => {
    if (!name) return "";

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleRetry = async () => {
    const result = await refetchTeam();

    if (result.isError) {
      toast.error(
        result.error?.message || "Failed to fetch team"
      );
    } else {
      toast.success("Team data loaded successfully");
    }
  };

  const isLoading = managerLoading || teamLoading;

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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
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
                My Team
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Manage employees in your{" "}
                {manager?.department?.name || "department"}.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3 max-sm:gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
              {getInitials(manager?.name)}
            </div>

          </div>

        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">

          {isLoading ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>

              <p className="mt-4 text-sm text-slate-500">
                Loading team...
              </p>

            </div>

          ) : managerError || teamError ? (

            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <p className="text-sm font-medium text-red-500">
                {teamErrorData?.message ||
                  "Failed to load team data."}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Try Again
              </button>

            </div>

          ) : (

            <>

              <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm max-sm:flex-col max-sm:items-start max-sm:gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Users size={21} />
                  </div>

                  <div>

                    <p className="text-sm font-medium text-slate-500">
                      Team Members
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-slate-900">
                      {employees.length}
                    </h3>

                  </div>

                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                  {teamData?.department?.name ||
                    manager?.department?.name ||
                    "Department"}
                </span>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    Team Employees
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    View employees assigned to your department.
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
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search by name or email..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
                    />

                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-400"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>

                </div>

                <div className="mt-6 overflow-x-auto">

                  <table className="w-full min-w-175">

                    <thead className="border-b border-slate-200">

                      <tr>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Employee
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Email
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Phone
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

                      {filteredEmployees.length > 0 ? (

                        filteredEmployees.map((employee) => (

                          <tr
                            key={employee.id}
                            className="transition hover:bg-slate-50"
                          >

                            <td className="px-4 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-600">
                                  {getInitials(employee.name)}
                                </div>

                                <div>

                                  <p className="text-sm font-semibold text-slate-800">
                                    {employee.name}
                                  </p>

                                  <p className="text-xs text-slate-400">
                                    {employee.department?.name ||
                                      teamData?.department?.name ||
                                      "Department"}
                                  </p>

                                </div>

                              </div>

                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {employee.email}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {employee.phone}
                            </td>

                            <td className="px-4 py-4">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  employee.status === "ACTIVE"
                                    ? "bg-green-50 text-green-600"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                {employee.status === "ACTIVE"
                                  ? "Active"
                                  : "Inactive"}
                              </span>

                            </td>

                            <td className="px-4 py-4">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedEmployee(employee)
                                }
                                className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
                              >
                                <Eye size={15} />
                                View
                              </button>

                            </td>

                          </tr>

                        ))

                      ) : (

                        <tr>

                          <td
                            colSpan="5"
                            className="px-4 py-10 text-center text-sm text-slate-400"
                          >
                            No employees found.
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

      {selectedEmployee && (

        <div className="fixed inset-0 `z-[60]` flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div>

                <h3 className="text-lg font-semibold text-slate-900">
                  Employee Details
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Employee information
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            <div className="p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-600">
                  {getInitials(selectedEmployee.name)}
                </div>

                <div>

                  <h4 className="font-semibold text-slate-900">
                    {selectedEmployee.name}
                  </h4>

                  <p className="text-sm text-slate-500">
                    Employee #{selectedEmployee.id}
                  </p>

                </div>

              </div>

              <div className="mt-6 space-y-4">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {selectedEmployee.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {selectedEmployee.phone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Department
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {selectedEmployee.department?.name ||
                      teamData?.department?.name ||
                      "Department"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Joining Date
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {selectedEmployee.joiningDate
                      ? new Date(
                          selectedEmployee.joiningDate
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      selectedEmployee.status === "ACTIVE"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {selectedEmployee.status === "ACTIVE"
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

              </div>

            </div>

            <div className="flex justify-end border-t border-slate-200 p-5">

              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default MyTeam;

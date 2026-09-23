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
  Search,
  Plus,
  LoaderCircle,
  Wallet,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function Payroll() {
  const queryClient = useQueryClient();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState("ALL");
  const [employeeMonth, setEmployeeMonth] = useState("ALL");

  const [managerSearch, setManagerSearch] = useState("");
  const [managerStatus, setManagerStatus] = useState("ALL");
  const [managerMonth, setManagerMonth] = useState("ALL");

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);

  const [employeeSalaries, setEmployeeSalaries] = useState({});
  const [managerSalaries, setManagerSalaries] = useState({});

  const [modalEmployeeSearch, setModalEmployeeSearch] = useState("");
  const [modalManagerSearch, setModalManagerSearch] = useState("");

  const [modalEmployeeStatus, setModalEmployeeStatus] = useState("ALL");
  const [modalManagerStatus, setModalManagerStatus] = useState("ALL");

  const fetchPayroll = async () => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/payroll/admin",
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch payroll");
    }

    return data.payrolls || [];
  };

  const fetchSalaryMembers = async () => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/payroll/salary-members",
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch salary members"
      );
    }

    return data;
  };

  const {
    data: payrolls = [],
    isLoading: payrollLoading,
    isError: payrollError,
  } = useQuery({
    queryKey: ["admin-payroll"],
    queryFn: fetchPayroll,
  });

  const {
    data: salaryMembers,
    isLoading: membersLoading,
    isError: membersError,
  } = useQuery({
    queryKey: ["salary-members"],
    queryFn: fetchSalaryMembers,
  });

  const employees = salaryMembers?.employees || [];
  const managers = salaryMembers?.managers || [];

  const updateEmployeeSalaryMutation = useMutation({
    mutationFn: async ({ id, salary }) => {
      const response = await fetch(
        `https://office-management-backend-production.up.railway.app/api/payroll/employee/${id}/salary`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            salary: Number(salary),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update employee salary"
        );
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Employee salary updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["salary-members"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateManagerSalaryMutation = useMutation({
    mutationFn: async ({ id, salary }) => {
      const response = await fetch(
        `https://office-management-backend-production.up.railway.app/api/payroll/manager/${id}/salary`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            salary: Number(salary),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update manager salary"
        );
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Manager salary updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["salary-members"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createPayrollMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/payroll",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            month: selectedMonth,
            employeeIds: selectedEmployees,
            managerIds: selectedManagers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create payroll"
        );
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Payroll created successfully");

      setModalOpen(false);
      setSelectedMonth("");
      setSelectedEmployees([]);
      setSelectedManagers([]);

      queryClient.invalidateQueries({
        queryKey: ["admin-payroll"],
      });

      queryClient.invalidateQueries({
        queryKey: ["salary-members"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const payPayrollMutation = useMutation({
    mutationFn: async (payrollId) => {
      const response = await fetch(
        `https://office-management-backend-production.up.railway.app/api/payroll/${payrollId}/pay`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to pay salary"
        );
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Salary paid successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-payroll"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const employeePayrolls = useMemo(() => {
    return payrolls.filter((payroll) => payroll.employee);
  }, [payrolls]);

  const managerPayrolls = useMemo(() => {
    return payrolls.filter((payroll) => payroll.manager);
  }, [payrolls]);

  const filteredEmployeePayrolls = useMemo(() => {
    return employeePayrolls.filter((payroll) => {
      const employeeName =
        payroll.employee?.name?.toLowerCase() || "";

      const matchesSearch = employeeName.includes(
        employeeSearch.toLowerCase()
      );

      const matchesStatus =
        employeeStatus === "ALL" ||
        payroll.status === employeeStatus;

      const matchesMonth =
        employeeMonth === "ALL" ||
        payroll.month === employeeMonth;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMonth
      );
    });
  }, [
    employeePayrolls,
    employeeSearch,
    employeeStatus,
    employeeMonth,
  ]);

  const filteredManagerPayrolls = useMemo(() => {
    return managerPayrolls.filter((payroll) => {
      const managerName =
        payroll.manager?.name?.toLowerCase() || "";

      const matchesSearch = managerName.includes(
        managerSearch.toLowerCase()
      );

      const matchesStatus =
        managerStatus === "ALL" ||
        payroll.status === managerStatus;

      const matchesMonth =
        managerMonth === "ALL" ||
        payroll.month === managerMonth;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMonth
      );
    });
  }, [
    managerPayrolls,
    managerSearch,
    managerStatus,
    managerMonth,
  ]);

  const totalPayroll = payrolls.reduce(
    (total, payroll) => total + Number(payroll.salary || 0),
    0
  );

  const paidPayroll = payrolls
    .filter((payroll) => payroll.status === "PAID")
    .reduce(
      (total, payroll) => total + Number(payroll.salary || 0),
      0
    );

  const pendingPayroll = payrolls
    .filter((payroll) => payroll.status === "PENDING")
    .reduce(
      (total, payroll) => total + Number(payroll.salary || 0),
      0
    );

  const availableMonths = [
    ...new Set(payrolls.map((payroll) => payroll.month)),
  ];

  const existingEmployeePayrolls = employeePayrolls.filter(
    (payroll) => payroll.month === selectedMonth
  );

  const existingManagerPayrolls = managerPayrolls.filter(
    (payroll) => payroll.month === selectedMonth
  );

  const hasEmployeePayroll = (employeeId) => {
    return existingEmployeePayrolls.some(
      (payroll) => payroll.employeeId === employeeId
    );
  };

  const hasManagerPayroll = (managerId) => {
    return existingManagerPayrolls.some(
      (payroll) => payroll.managerId === managerId
    );
  };

  const filteredModalEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name
        .toLowerCase()
        .includes(modalEmployeeSearch.toLowerCase()) ||
      employee.email
        .toLowerCase()
        .includes(modalEmployeeSearch.toLowerCase());

    const matchesStatus =
      modalEmployeeStatus === "ALL" ||
      (modalEmployeeStatus === "SET" &&
        employee.salary !== null) ||
      (modalEmployeeStatus === "NOT_SET" &&
        employee.salary === null);

    return matchesSearch && matchesStatus;
  });

  const filteredModalManagers = managers.filter((manager) => {
    const matchesSearch =
      manager.name
        .toLowerCase()
        .includes(modalManagerSearch.toLowerCase()) ||
      manager.email
        .toLowerCase()
        .includes(modalManagerSearch.toLowerCase());

    const matchesStatus =
      modalManagerStatus === "ALL" ||
      (modalManagerStatus === "SET" &&
        manager.salary !== null) ||
      (modalManagerStatus === "NOT_SET" &&
        manager.salary === null);

    return matchesSearch && matchesStatus;
  });

  const toggleEmployee = (employeeId) => {
    setSelectedEmployees((current) =>
      current.includes(employeeId)
        ? current.filter((id) => id !== employeeId)
        : [...current, employeeId]
    );
  };

  const toggleManager = (managerId) => {
    setSelectedManagers((current) =>
      current.includes(managerId)
        ? current.filter((id) => id !== managerId)
        : [...current, managerId]
    );
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    setSelectedMonth("");
    setSelectedEmployees([]);
    setSelectedManagers([]);
    setModalEmployeeSearch("");
    setModalManagerSearch("");
    setModalEmployeeStatus("ALL");
    setModalManagerStatus("ALL");
  };

  const handleCreatePayroll = () => {
    if (!selectedMonth) {
      toast.error("Please select a month");
      return;
    }

    if (
      selectedEmployees.length === 0 &&
      selectedManagers.length === 0
    ) {
      toast.error("Please select at least one employee or manager");
      return;
    }

    const selectedEmployeesWithoutSalary =
      selectedEmployees.filter((employeeId) => {
        const employee = employees.find(
          (item) => item.id === employeeId
        );

        return !employee || employee.salary === null;
      });

    const selectedManagersWithoutSalary =
      selectedManagers.filter((managerId) => {
        const manager = managers.find(
          (item) => item.id === managerId
        );

        return !manager || manager.salary === null;
      });

    if (
      selectedEmployeesWithoutSalary.length > 0 ||
      selectedManagersWithoutSalary.length > 0
    ) {
      toast.error(
        "Please set salary for every selected person first"
      );
      return;
    }

    createPayrollMutation.mutate();
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-GB");
  };

  const formatSalary = (salary) => {
    return Number(salary || 0).toLocaleString();
  };

  const statusBadge = (status) => {
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          status === "PAID"
            ? "bg-green-50 text-green-600"
            : "bg-yellow-50 text-yellow-600"
        }`}
      >
        {status === "PAID" ? "Paid" : "Pending"}
      </span>
    );
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
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-950 p-6 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
                Manage employee and manager salary records.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 max-sm:px-3"
          >
            <Plus size={18} />
            <span className="max-sm:hidden">Create Payroll</span>
            <span className="hidden max-sm:inline">Create</span>
          </button>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Total Payroll
                </p>

                <Wallet className="text-orange-500" size={22} />
              </div>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Rs. {formatSalary(totalPayroll)}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Paid Payroll
                </p>

                <CheckCircle2 className="text-green-500" size={22} />
              </div>

              <h3 className="mt-2 text-2xl font-bold text-green-600">
                Rs. {formatSalary(paidPayroll)}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Pending Payroll
                </p>

                <Clock3 className="text-yellow-500" size={22} />
              </div>

              <h3 className="mt-2 text-2xl font-bold text-yellow-600">
                Rs. {formatSalary(pendingPayroll)}
              </h3>
            </div>
          </div>

          {payrollError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              Failed to load payroll records.
            </div>
          )}

          <div className="mt-8">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Employee Payroll
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Manage employee salary records and payments.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex gap-4 max-md:flex-col">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={employeeSearch}
                    onChange={(e) =>
                      setEmployeeSearch(e.target.value)
                    }
                    placeholder="Search employee..."
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <select
                  value={employeeMonth}
                  onChange={(e) =>
                    setEmployeeMonth(e.target.value)
                  }
                  className="w-48 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500 max-md:w-full"
                >
                  <option value="ALL">All Months</option>

                  {availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={employeeStatus}
                  onChange={(e) =>
                    setEmployeeStatus(e.target.value)
                  }
                  className="w-48 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500 max-md:w-full"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Employee
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Department
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Month
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Salary
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Payment Date
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {payrollLoading ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-10 text-center"
                        >
                          <LoaderCircle
                            className="mx-auto animate-spin text-orange-500"
                            size={24}
                          />
                        </td>
                      </tr>
                    ) : filteredEmployeePayrolls.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-10 text-center text-sm text-slate-500"
                        >
                          No employee payroll found.
                        </td>
                      </tr>
                    ) : (
                      filteredEmployeePayrolls.map((payroll) => (
                        <tr
                          key={payroll.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                            {payroll.employee?.name}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {payroll.employee?.department?.name || "—"}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {payroll.month}
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                            Rs. {formatSalary(payroll.salary)}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatDate(payroll.paymentDate)}
                          </td>

                          <td className="px-6 py-4">
                            {statusBadge(payroll.status)}
                          </td>

                          <td className="px-6 py-4">
                            {payroll.status === "PENDING" && (
                              <button
                                onClick={() =>
                                  payPayrollMutation.mutate(
                                    payroll.id
                                  )
                                }
                                disabled={
                                  payPayrollMutation.isPending
                                }
                                className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {payPayrollMutation.isPending
                                  ? "Paying..."
                                  : "Pay Salary"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Manager Payroll
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Manage manager salary records and payments.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex gap-4 max-md:flex-col">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={managerSearch}
                    onChange={(e) =>
                      setManagerSearch(e.target.value)
                    }
                    placeholder="Search manager..."
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <select
                  value={managerMonth}
                  onChange={(e) =>
                    setManagerMonth(e.target.value)
                  }
                  className="w-48 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500 max-md:w-full"
                >
                  <option value="ALL">All Months</option>

                  {availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={managerStatus}
                  onChange={(e) =>
                    setManagerStatus(e.target.value)
                  }
                  className="w-48 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500 max-md:w-full"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Manager
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Department
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Month
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Salary
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Payment Date
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {payrollLoading ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-10 text-center"
                        >
                          <LoaderCircle
                            className="mx-auto animate-spin text-orange-500"
                            size={24}
                          />
                        </td>
                      </tr>
                    ) : filteredManagerPayrolls.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-10 text-center text-sm text-slate-500"
                        >
                          No manager payroll found.
                        </td>
                      </tr>
                    ) : (
                      filteredManagerPayrolls.map((payroll) => (
                        <tr
                          key={payroll.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                            {payroll.manager?.name}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {payroll.manager?.managedDepartment?.name ||
                              "—"}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {payroll.month}
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                            Rs. {formatSalary(payroll.salary)}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatDate(payroll.paymentDate)}
                          </td>

                          <td className="px-6 py-4">
                            {statusBadge(payroll.status)}
                          </td>

                          <td className="px-6 py-4">
                            {payroll.status === "PENDING" && (
                              <button
                                onClick={() =>
                                  payPayrollMutation.mutate(
                                    payroll.id
                                  )
                                }
                                disabled={
                                  payPayrollMutation.isPending
                                }
                                className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {payPayrollMutation.isPending
                                  ? "Paying..."
                                  : "Pay Salary"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Create Payroll
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Select employees and managers for monthly payroll.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 transition hover:text-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-8 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payroll Month
                </label>

                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!value) {
                      setSelectedMonth("");
                      return;
                    }

                    const [year, month] = value.split("-");
                    const date = new Date(
                      Number(year),
                      Number(month) - 1
                    );

                    setSelectedMonth(
                      date.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    );
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                {selectedMonth && (
                  <p className="mt-2 text-xs text-slate-500">
                    Selected: {selectedMonth}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Employees
                    </h4>

                    <p className="text-sm text-slate-500">
                      Set salary and select employees.
                    </p>
                  </div>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {selectedEmployees.length} Selected
                  </span>
                </div>

                <div className="mb-4 flex gap-3 max-md:flex-col">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={modalEmployeeSearch}
                      onChange={(e) =>
                        setModalEmployeeSearch(e.target.value)
                      }
                      placeholder="Search employees..."
                      className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500"
                    />
                  </div>

                  <select
                    value={modalEmployeeStatus}
                    onChange={(e) =>
                      setModalEmployeeStatus(e.target.value)
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
                  >
                    <option value="ALL">All Salary Status</option>
                    <option value="SET">Salary Set</option>
                    <option value="NOT_SET">Salary Not Set</option>
                  </select>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[650px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Select
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Employee
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Salary
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Payroll Status
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {membersLoading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-8 text-center"
                          >
                            Loading employees...
                          </td>
                        </tr>
                      ) : (
                        filteredModalEmployees.map((employee) => {
                          const alreadyCreated =
                            selectedMonth &&
                            hasEmployeePayroll(employee.id);

                          const currentSalary =
                            employeeSalaries[employee.id] ??
                            employee.salary ??
                            "";

                          return (
                            <tr key={employee.id}>
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedEmployees.includes(
                                    employee.id
                                  )}
                                  disabled={
                                    alreadyCreated ||
                                    employee.salary === null
                                  }
                                  onChange={() =>
                                    toggleEmployee(employee.id)
                                  }
                                  className="h-4 w-4 accent-orange-500"
                                />
                              </td>

                              <td className="px-4 py-3">
                                <p className="text-sm font-semibold text-slate-800">
                                  {employee.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {employee.email}
                                </p>
                              </td>

                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={currentSalary}
                                  onChange={(e) =>
                                    setEmployeeSalaries((current) => ({
                                      ...current,
                                      [employee.id]: e.target.value,
                                    }))
                                  }
                                  className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                                />
                              </td>

                              <td className="px-4 py-3 text-xs">
                                {alreadyCreated ? (
                                  <span className="text-green-600">
                                    Already Created
                                  </span>
                                ) : employee.salary === null ? (
                                  <span className="text-red-500">
                                    Salary Not Set
                                  </span>
                                ) : (
                                  <span className="text-slate-500">
                                    Available
                                  </span>
                                )}
                              </td>

                              <td className="px-4 py-3">
                                <button
                                  onClick={() =>
                                    updateEmployeeSalaryMutation.mutate({
                                      id: employee.id,
                                      salary: currentSalary,
                                    })
                                  }
                                  disabled={
                                    !currentSalary ||
                                    updateEmployeeSalaryMutation.isPending
                                  }
                                  className="rounded-lg border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-50 disabled:opacity-50"
                                >
                                  Save Salary
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Managers
                    </h4>

                    <p className="text-sm text-slate-500">
                      Set salary and select managers.
                    </p>
                  </div>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {selectedManagers.length} Selected
                  </span>
                </div>

                <div className="mb-4 flex gap-3 max-md:flex-col">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={modalManagerSearch}
                      onChange={(e) =>
                        setModalManagerSearch(e.target.value)
                      }
                      placeholder="Search managers..."
                      className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500"
                    />
                  </div>

                  <select
                    value={modalManagerStatus}
                    onChange={(e) =>
                      setModalManagerStatus(e.target.value)
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
                  >
                    <option value="ALL">All Salary Status</option>
                    <option value="SET">Salary Set</option>
                    <option value="NOT_SET">Salary Not Set</option>
                  </select>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[650px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Select
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Manager
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Salary
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Payroll Status
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {membersLoading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-8 text-center"
                          >
                            Loading managers...
                          </td>
                        </tr>
                      ) : (
                        filteredModalManagers.map((manager) => {
                          const alreadyCreated =
                            selectedMonth &&
                            hasManagerPayroll(manager.id);

                          const currentSalary =
                            managerSalaries[manager.id] ??
                            manager.salary ??
                            "";

                          return (
                            <tr key={manager.id}>
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedManagers.includes(
                                    manager.id
                                  )}
                                  disabled={
                                    alreadyCreated ||
                                    manager.salary === null
                                  }
                                  onChange={() =>
                                    toggleManager(manager.id)
                                  }
                                  className="h-4 w-4 accent-orange-500"
                                />
                              </td>

                              <td className="px-4 py-3">
                                <p className="text-sm font-semibold text-slate-800">
                                  {manager.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {manager.email}
                                </p>
                              </td>

                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={currentSalary}
                                  onChange={(e) =>
                                    setManagerSalaries((current) => ({
                                      ...current,
                                      [manager.id]: e.target.value,
                                    }))
                                  }
                                  className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                                />
                              </td>

                              <td className="px-4 py-3 text-xs">
                                {alreadyCreated ? (
                                  <span className="text-green-600">
                                    Already Created
                                  </span>
                                ) : manager.salary === null ? (
                                  <span className="text-red-500">
                                    Salary Not Set
                                  </span>
                                ) : (
                                  <span className="text-slate-500">
                                    Available
                                  </span>
                                )}
                              </td>

                              <td className="px-4 py-3">
                                <button
                                  onClick={() =>
                                    updateManagerSalaryMutation.mutate({
                                      id: manager.id,
                                      salary: currentSalary,
                                    })
                                  }
                                  disabled={
                                    !currentSalary ||
                                    updateManagerSalaryMutation.isPending
                                  }
                                  className="rounded-lg border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-50 disabled:opacity-50"
                                >
                                  Save Salary
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleCreatePayroll}
                disabled={createPayrollMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createPayrollMutation.isPending && (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                )}

                {createPayrollMutation.isPending
                  ? "Creating..."
                  : "Create Payroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payroll;
import { useEffect, useState } from "react";
import AddEmployee from "./AddEmployee";

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
  UserPlus2,
  Search,
  LoaderCircle,
  AlertTriangle,
} from "lucide-react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

const getEmployees = async () => {
  const response = await fetch(
    "https://office-management-backend-production.up.railway.app/api/employees",
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch employees"
    );
  }

  return data.employees;
};

const getDepartments = async () => {
  const response = await fetch(
    "https://office-management-backend-production.up.railway.app/api/departments",
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch departments"
    );
  }

  return data.departments;
};

const createEmployee = async (formData) => {
  const response = await fetch(
    "https://office-management-backend-production.up.railway.app/api/employees",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create employee"
    );
  }

  return data;
};

const updateEmployee = async ({ id, formData }) => {
  const response = await fetch(
    `https://office-management-backend-production.up.railway.app/api/employees/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update employee"
    );
  }

  return data;
};

const deactivateEmployee = async (id) => {
  const response = await fetch(
    `https://office-management-backend-production.up.railway.app/api/employees/${id}/deactivate`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to deactivate employee"
    );
  }

  return data;
};

function Employees() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeToDeactivate, setEmployeeToDeactivate] =
    useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [deactivatingEmployeeId, setDeactivatingEmployeeId] =
    useState(null);

  const queryClient = useQueryClient();

  const {
    data: employees = [],
    isLoading: employeesLoading,
    isError: employeesError,
    error: employeesErrorData,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const {
    data: departments = [],
    isLoading: departmentsLoading,
    isError: departmentsError,
    error: departmentsErrorData,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  useEffect(() => {
    if (employeesError) {
      toast.error(
        employeesErrorData?.message ||
          "Failed to load employees"
      );
    }
  }, [employeesError, employeesErrorData]);

  useEffect(() => {
    if (departmentsError) {
      toast.error(
        departmentsErrorData?.message ||
          "Failed to load departments"
      );
    }
  }, [departmentsError, departmentsErrorData]);

  const createMutation = useMutation({
    mutationFn: createEmployee,

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      setShowForm(false);
      setEditingEmployee(null);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      setShowForm(false);
      setEditingEmployee(null);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateEmployee,

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      setEmployeeToDeactivate(null);
      setDeactivatingEmployeeId(null);
    },

    onError: (error) => {
      toast.error(error.message);
      setDeactivatingEmployeeId(null);
    },
  });

  const handleSaveEmployee = (formData) => {
    createMutation.mutate(formData);
  };

  const handleUpdateEmployee = (formData) => {
    updateMutation.mutate({
      id: editingEmployee.id,
      formData,
    });
  };

  const handleDeactivate = () => {
    if (!employeeToDeactivate) {
      return;
    }

    setDeactivatingEmployeeId(
      employeeToDeactivate.id
    );

    deactivateMutation.mutate(
      employeeToDeactivate.id
    );
  };

  const filteredEmployees = employees.filter(
    (employee) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        employee.name
          .toLowerCase()
          .includes(search) ||
        employee.email
          .toLowerCase()
          .includes(search) ||
        employee.phone
          .toLowerCase()
          .includes(search);

      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        employee.department?.name ===
          selectedDepartment;

      return (
        matchesSearch &&
        matchesDepartment
      );
    }
  );

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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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

        <header className="flex items-center justify-between bg-white px-8 py-5 max-md:px-5 max-sm:px-4">

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="hidden text-slate-600 transition hover:text-orange-600 max-lg:block"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 max-sm:text-xl">
                Employees
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Manage your organization employees.
              </p>
            </div>

          </div>

          <button
            onClick={() => {
              setEditingEmployee(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-medium text-white transition duration-200 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 max-sm:px-3 max-sm:py-2.5 max-sm:text-sm"
          >
            <UserPlus2 size={18} />

            <span className="max-sm:hidden">
              Add Employee
            </span>

            <span className="hidden max-sm:block">
              Add
            </span>
          </button>

        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4 max-md:flex-col">

              <div className="relative w-full">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

              </div>

              <select
                value={selectedDepartment}
                onChange={(event) =>
                  setSelectedDepartment(
                    event.target.value
                  )
                }
                className="w-52 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 max-md:w-full"
              >

                <option>
                  All Departments
                </option>

                {departments.map(
                  (department) => (
                    <option
                      key={department.id}
                      value={department.name}
                    >
                      {department.name}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-200">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Phone
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

                  {employeesLoading ? (

                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center"
                      >
                        <LoaderCircle
                          size={28}
                          className="mx-auto animate-spin text-orange-600"
                        />

                        <p className="mt-2 text-sm text-slate-500">
                          Loading employees...
                        </p>
                      </td>
                    </tr>

                  ) : employeesError ? (

                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center"
                      >
                        <p className="text-sm text-red-500">
                          Failed to load employees.
                        </p>
                      </td>
                    </tr>

                  ) : filteredEmployees.length === 0 ? (

                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        No employees found.
                      </td>
                    </tr>

                  ) : (

                    filteredEmployees.map(
                      (employee) => (

                        <tr
                          key={employee.id}
                          className="transition hover:bg-slate-100"
                        >

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-600">
                                {employee.name
                                  .split(" ")
                                  .map(
                                    (word) =>
                                      word[0]
                                  )
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>

                              <div>

                                <p className="text-sm font-semibold text-slate-800">
                                  {employee.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {employee.email}
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {employee.department?.name ||
                              "No Department"}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {employee.phone}
                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                employee.status ===
                                "ACTIVE"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {employee.status ===
                              "ACTIVE"
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </td>

                          <td className="px-6 py-4">

                            <div className="flex gap-2">

                              <button
                                onClick={() => {
                                  setEditingEmployee(
                                    employee
                                  );
                                  setShowForm(true);
                                }}
                                className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                              >
                                Edit
                              </button>

                              {employee.status ===
                                "ACTIVE" && (

                                <button
                                  onClick={() =>
                                    setEmployeeToDeactivate(
                                      employee
                                    )
                                  }
                                  disabled={
                                    deactivateMutation.isPending
                                  }
                                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {deactivatingEmployeeId ===
                                  employee.id
                                    ? "Deactivating..."
                                    : "Deactivate"}
                                </button>

                              )}

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </main>

      {showForm && (
        <AddEmployee
          onclose={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
          editingEmployee={
            editingEmployee
          }
          departments={departments}
          departmentsLoading={
            departmentsLoading
          }
          onSave={
            editingEmployee
              ? handleUpdateEmployee
              : handleSaveEmployee
          }
          isSaving={
            createMutation.isPending ||
            updateMutation.isPending
          }
        />
      )}

      {employeeToDeactivate && (
        <div className="fixed inset-0 `z-[100]` flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle size={23} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Deactivate Employee?
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Are you sure you want to deactivate{" "}
                  <span className="font-semibold text-slate-700">
                    {employeeToDeactivate.name}
                  </span>
                  ?
                </p>
              </div>

            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">

              <p className="text-sm leading-6 text-slate-500">
                This employee will remain in the
                system, but their status will change
                from Active to Inactive.
              </p>

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() =>
                  setEmployeeToDeactivate(null)
                }
                disabled={
                  deactivateMutation.isPending
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeactivate}
                disabled={
                  deactivateMutation.isPending
                }
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {deactivateMutation.isPending && (
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />
                )}

                {deactivateMutation.isPending
                  ? "Deactivating..."
                  : "Deactivate"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Employees;
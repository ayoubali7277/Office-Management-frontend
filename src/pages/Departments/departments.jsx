import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  Calendar,
  CheckSquare2,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  UserPlus,
  Pencil,
  UserCheck,
  UserX,
  LoaderCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { useEffect, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import AddDepartment from "./AddDepartment";
import AddManager from "./AddManager";
import AssignManager from "./AssignManager";

const getDepartments = async () => {
  const response = await fetch(
    "http://localhost:3000/api/departments",
    {
      method: "GET",
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

const getManagers = async () => {
  const response = await fetch(
    "http://localhost:3000/api/managers",
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch managers"
    );
  }

  return data.managers;
};

const createDepartment = async (formData) => {
  const response = await fetch(
    "http://localhost:3000/api/departments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: formData.name,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create department"
    );
  }

  return data;
};

const updateDepartment = async (formData) => {
  const response = await fetch(
    `http://localhost:3000/api/departments/${formData.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: formData.name,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update department"
    );
  }

  return data;
};

const deleteDepartment = async (id) => {
  const response = await fetch(
    `http://localhost:3000/api/departments/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete department"
    );
  }

  return data;
};

const createManager = async (formData) => {
  const response = await fetch(
    "http://localhost:3000/api/managers",
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
      data.message || "Failed to create manager"
    );
  }

  return data;
};

const updateManager = async (formData) => {
  const response = await fetch(
    `http://localhost:3000/api/managers/${formData.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        departmentId: formData.departmentId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update manager"
    );
  }

  return data;
};

const assignManager = async ({
  managerId,
  departmentId,
}) => {
  const response = await fetch(
    `http://localhost:3000/api/managers/${managerId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        departmentId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to assign manager"
    );
  }

  return data;
};

const deactivateManager = async (id) => {
  const response = await fetch(
    `http://localhost:3000/api/managers/${id}/deactivate`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to deactivate manager"
    );
  }

  return data;
};

const activateManager = async (id) => {
  const response = await fetch(
    `http://localhost:3000/api/managers/${id}/activate`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to activate manager"
    );
  }

  return data;
};

function Departments() {
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [showManagerForm, setShowManagerForm] = useState(false);
  const [editingManager, setEditingManager] = useState(null);

  const [assigningDepartment, setAssigningDepartment] =
    useState(null);

  const [deletingDepartment, setDeletingDepartment] =
    useState(null);

  const [processingManagerId, setProcessingManagerId] =
    useState(null);

  const [managerAction, setManagerAction] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: departments = [],
    isLoading: departmentsLoading,
    isError: departmentsError,
    error: departmentsErrorMessage,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const {
    data: managers = [],
    isLoading: managersLoading,
    isError: managersError,
    error: managersErrorMessage,
  } = useQuery({
    queryKey: ["managers"],
    queryFn: getManagers,
  });

  const createDepartmentMutation = useMutation({
    mutationFn: createDepartment,

    onSuccess: () => {
      toast.success("Department created successfully");

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      setShowForm(false);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,

    onSuccess: () => {
      toast.success("Department updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      setEditingDepartment(null);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: deleteDepartment,

    onSuccess: () => {
      toast.success("Department deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["managers"],
      });

      setDeletingDepartment(null);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createManagerMutation = useMutation({
    mutationFn: createManager,

    onSuccess: () => {
      toast.success("Manager created successfully");

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["managers"],
      });

      setShowManagerForm(false);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateManagerMutation = useMutation({
    mutationFn: updateManager,

    onSuccess: () => {
      toast.success("Manager updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["managers"],
      });

      setShowManagerForm(false);
      setEditingManager(null);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const assignManagerMutation = useMutation({
    mutationFn: assignManager,

    onSuccess: () => {
      toast.success("Manager assigned successfully");

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["managers"],
      });

      setAssigningDepartment(null);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deactivateManagerMutation = useMutation({
    mutationFn: deactivateManager,

    onSuccess: () => {
      toast.success("Manager deactivated successfully");

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["managers"],
      });

      setProcessingManagerId(null);
      setManagerAction(null);
    },

    onError: (error) => {
      toast.error(error.message);

      setProcessingManagerId(null);
      setManagerAction(null);
    },
  });

  const activateManagerMutation = useMutation({
    mutationFn: activateManager,

    onSuccess: () => {
      toast.success("Manager activated successfully");

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["managers"],
      });

      setProcessingManagerId(null);
    },

    onError: (error) => {
      toast.error(error.message);

      setProcessingManagerId(null);
    },
  });

  useEffect(() => {
    if (departmentsError) {
      toast.error(departmentsErrorMessage.message);
    }
  }, [departmentsError, departmentsErrorMessage]);

  useEffect(() => {
    if (managersError) {
      toast.error(managersErrorMessage.message);
    }
  }, [managersError, managersErrorMessage]);

  const handleSaveDepartment = (formData) => {
    createDepartmentMutation.mutate(formData);
  };

  const handleUpdateDepartment = (formData) => {
    updateDepartmentMutation.mutate({
      id: editingDepartment.id,
      name: formData.name,
    });
  };

  const handleDeleteDepartment = () => {
    if (!deletingDepartment) {
      return;
    }

    deleteDepartmentMutation.mutate(
      deletingDepartment.id
    );
  };

  const handleAddManager = () => {
    setEditingManager(null);
    setShowManagerForm(true);
  };

  const handleEditManager = (manager) => {
    setEditingManager(manager);
    setShowManagerForm(true);
  };

  const handleAssignManager = (department) => {
    const availableManagers = managers.filter(
      (manager) =>
        manager.isActive &&
        !manager.managedDepartment
    );

    if (availableManagers.length === 0) {
      toast.error("No active and available managers to assign");
      return;
    }

    setAssigningDepartment(department);
  };

  const handleSaveManager = (formData) => {
    if (editingManager) {
      updateManagerMutation.mutate({
        id: editingManager.id,
        name: formData.name,
        email: formData.email,
        departmentId: formData.departmentId,
      });

      return;
    }

    createManagerMutation.mutate(formData);
  };

  const handleSaveAssignment = (formData) => {
    assignManagerMutation.mutate(formData);
  };

  const handleDeactivateManager = (id) => {
    setProcessingManagerId(id);
    setManagerAction("deactivate");
  };

  const handleActivateManager = (id) => {
    setProcessingManagerId(id);

    activateManagerMutation.mutate(id);
  };

  const handleConfirmManagerAction = () => {
    if (
      !processingManagerId ||
      managerAction !== "deactivate"
    ) {
      return;
    }

    deactivateManagerMutation.mutate(
      processingManagerId
    );
  };

  const managerMutationPending =
    createManagerMutation.isPending ||
    updateManagerMutation.isPending;

  const pageLoading =
    departmentsLoading || managersLoading;

  const actionLoading =
    deleteDepartmentMutation.isPending ||
    managerMutationPending ||
    assignManagerMutation.isPending ||
    activateManagerMutation.isPending ||
    deactivateManagerMutation.isPending;

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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
            <CreditCard size={19} />
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
            <LogOut size={19} />
            Logout
          </a>

        </div>
      </aside>

      <main className="ml-64 min-h-screen max-lg:ml-0">

        <header className="flex items-center justify-between gap-4 bg-white px-8 py-5 max-md:flex-col max-md:items-stretch max-md:px-5 max-sm:px-4">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="hidden text-slate-600 transition hover:text-orange-600 max-lg:block"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 max-sm:text-xl">
                Departments
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Manage your organization departments and managers.
              </p>
            </div>

          </div>

          <div className="flex gap-3 max-md:w-full">

            <button
              onClick={() => setShowForm(true)}
              disabled={actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Building2 size={17} />
              Add Department
            </button>

            <button
              onClick={handleAddManager}
              disabled={actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-1 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus size={17} />
              Add Manager
            </button>

          </div>

        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">

          {pageLoading ? (
            <div className="flex min-h-60 items-center justify-center">
              <LoaderCircle
                size={28}
                className="animate-spin text-orange-600"
              />
            </div>
          ) : (
            <>

              <div>

                <div className="mb-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Departments
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage departments and their assigned managers.
                  </p>
                </div>

                {departments.length === 0 ? (
                  <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
                    <p className="text-sm text-slate-500">
                      No departments found.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                    {departments.map((department) => {

                      const manager = department.manager;

                      return (
                        <div
                          key={department.id}
                          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                        >

                          <div className="flex items-start justify-between">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 font-bold text-orange-600">
                              {department.name.charAt(0)}
                            </div>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                              {department._count.employees} Employees
                            </span>

                          </div>

                          <div className="mt-5">

                            <h3 className="text-lg font-bold text-slate-900">
                              {department.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Department
                            </p>

                          </div>

                          <div className="mt-5 rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Manager Assigned
                            </p>

                            {manager ? (
                              <div className="mt-3 flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                                  {manager.name
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-slate-800">
                                    {manager.name}
                                  </p>

                                  <p className="text-xs text-slate-400">
                                    {manager.isActive
                                      ? "Active"
                                      : "Inactive"}
                                  </p>
                                </div>

                              </div>
                            ) : (
                              <div className="mt-3 flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-400">
                                  <Users size={18} />
                                </div>

                                <div>
                                  <p className="text-sm font-semibold text-slate-700">
                                    No manager assigned
                                  </p>

                                  <button
                                    onClick={() =>
                                      handleAssignManager(
                                        department
                                      )
                                    }
                                    disabled={actionLoading}
                                    className="mt-1 text-xs font-medium text-orange-600 transition hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    Assign Manager
                                  </button>
                                </div>

                              </div>
                            )}

                          </div>

                          <div className="mt-6 flex gap-2 border-t border-slate-100 pt-4">

                            <button
                              onClick={() =>
                                setEditingDepartment(
                                  department
                                )
                              }
                              disabled={actionLoading}
                              className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Edit Department
                            </button>

                            <button
                              onClick={() =>
                                setDeletingDepartment(
                                  department
                                )
                              }
                              disabled={
                                actionLoading
                              }
                              className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>

              <div className="mt-10">

                <div className="mb-5 flex items-end justify-between gap-4">

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Managers
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage all managers in your organization.
                    </p>
                  </div>

                  <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600">
                    {managers.length} Managers
                  </span>

                </div>

                {managers.length === 0 ? (
                  <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
                    <p className="text-sm text-slate-500">
                      No managers found.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                      <table className="w-full min-w-187.5">

                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Manager
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Email
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Department
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Status
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Actions
                            </th>

                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">

                          {managers.map((manager) => (

                            <tr
                              key={manager.id}
                              className="transition hover:bg-slate-50"
                            >

                              <td className="px-6 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                                    {manager.name
                                      .split(" ")
                                      .map((word) => word[0])
                                      .join("")}
                                  </div>

                                  <p className="text-sm font-semibold text-slate-800">
                                    {manager.name}
                                  </p>

                                </div>

                              </td>

                              <td className="px-6 py-4 text-sm text-slate-500">
                                {manager.email}
                              </td>

                              <td className="px-6 py-4">

                                {manager.managedDepartment ? (
                                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                                    {manager.managedDepartment.name}
                                  </span>
                                ) : (
                                  <span className="text-sm text-slate-400">
                                    No department
                                  </span>
                                )}

                              </td>

                              <td className="px-6 py-4">

                                <span
                                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                    manager.isActive
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {manager.isActive
                                    ? "Active"
                                    : "Inactive"}
                                </span>

                              </td>

                              <td className="px-6 py-4">

                                <div className="flex justify-end gap-2">

                                  <button
                                    onClick={() =>
                                      handleEditManager(
                                        manager
                                      )
                                    }
                                    disabled={
                                      actionLoading
                                    }
                                    className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <Pencil size={14} />
                                    Edit
                                  </button>

                                  {manager.isActive ? (
                                    <button
                                      onClick={() =>
                                        handleDeactivateManager(
                                          manager.id
                                        )
                                      }
                                      disabled={
                                        actionLoading
                                      }
                                      className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {deactivateManagerMutation.isPending &&
                                      processingManagerId ===
                                        manager.id ? (
                                        <LoaderCircle
                                          size={14}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <UserX size={14} />
                                      )}

                                      {deactivateManagerMutation.isPending &&
                                      processingManagerId ===
                                        manager.id
                                        ? "Deactivating..."
                                        : "Deactivate"}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleActivateManager(
                                          manager.id
                                        )
                                      }
                                      disabled={
                                        actionLoading
                                      }
                                      className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {activateManagerMutation.isPending &&
                                      processingManagerId ===
                                        manager.id ? (
                                        <LoaderCircle
                                          size={14}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <UserCheck size={14} />
                                      )}

                                      {activateManagerMutation.isPending &&
                                      processingManagerId ===
                                        manager.id
                                        ? "Activating..."
                                        : "Activate"}
                                    </button>
                                  )}

                                </div>

                              </td>

                            </tr>

                          ))}

                        </tbody>

                      </table>

                    </div>

                  </div>
                )}

              </div>

            </>
          )}

        </section>

      </main>

      {showForm && (
        <AddDepartment
          onclose={() => setShowForm(false)}
          onSave={handleSaveDepartment}
          isSaving={
            createDepartmentMutation.isPending
          }
        />
      )}

      {editingDepartment && (
        <AddDepartment
          onclose={() =>
            setEditingDepartment(null)
          }
          editDepartment={editingDepartment}
          onSave={handleUpdateDepartment}
          isSaving={
            updateDepartmentMutation.isPending
          }
        />
      )}

      {showManagerForm && (
        <AddManager
          onclose={() => {
            setShowManagerForm(false);
            setEditingManager(null);
          }}
          onSave={handleSaveManager}
          editManager={editingManager}
          departments={departments}
          isSaving={managerMutationPending}
        />
      )}

      {assigningDepartment && (
        <AssignManager
          department={assigningDepartment}
          managers={managers}
          onclose={() =>
            setAssigningDepartment(null)
          }
          onAssign={handleSaveAssignment}
          isSaving={
            assignManagerMutation.isPending
          }
        />
      )}

      {deletingDepartment && (
        <div className="fixed inset-0 `z-[110]` flex items-center justify-center bg-slate-950/50 px-4 py-6">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            <div className="p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={23} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Delete Department?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  {deletingDepartment.name}
                </span>
                ? This action cannot be undone.
              </p>

              {deletingDepartment._count.employees > 0 && (
                <div className="mt-4 rounded-xl bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-700">
                    This department currently has{" "}
                    {deletingDepartment._count.employees}{" "}
                    employee
                    {deletingDepartment._count.employees !==
                    1
                      ? "s"
                      : ""}
                    .
                  </p>

                  <p className="mt-1 text-xs text-amber-600">
                    A department can only be deleted when it has no employees.
                  </p>
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5 max-sm:flex-col-reverse">

              <button
                type="button"
                onClick={() =>
                  setDeletingDepartment(null)
                }
                disabled={
                  deleteDepartmentMutation.isPending
                }
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteDepartment}
                disabled={
                  deleteDepartmentMutation.isPending
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
              >
                {deleteDepartmentMutation.isPending && (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                )}

                {deleteDepartmentMutation.isPending
                  ? "Deleting..."
                  : "Delete Department"}
              </button>

            </div>

          </div>

        </div>
      )}

      {managerAction === "deactivate" &&
        processingManagerId && (
          <div className="fixed inset-0 `z-[110]` flex items-center justify-center bg-slate-950/50 px-4 py-6">

            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

              <div className="p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <UserX size={23} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  Deactivate Manager?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This manager will become inactive and will be removed from their current department.
                </p>

              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5 max-sm:flex-col-reverse">

                <button
                  type="button"
                  onClick={() => {
                    setProcessingManagerId(null);
                    setManagerAction(null);
                  }}
                  disabled={
                    deactivateManagerMutation.isPending
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmManagerAction}
                  disabled={
                    deactivateManagerMutation.isPending
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
                >
                  {deactivateManagerMutation.isPending && (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {deactivateManagerMutation.isPending
                    ? "Deactivating..."
                    : "Deactivate Manager"}
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}

export default Departments;

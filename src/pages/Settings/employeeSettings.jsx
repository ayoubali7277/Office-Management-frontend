
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
  User,
  Save,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
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

function EmployeeSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profileName, setProfileName] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const queryClient = useQueryClient();

  const {
    data: employee,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["employeeSettingsProfile"],
    queryFn: async () => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/employees/settings/profile",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch employee profile");
      }

      return data.employee;
    },
  });

  useEffect(() => {
    if (employee) {
      setProfileName(employee.name || "");
    }
  }, [employee]);

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/employees/settings/profile",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["employeeSettingsProfile"],
      });
    },

    onError: (error) => {
      toast.error(error.message || "Unable to update profile");
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (passwordData) => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/employees/settings/password",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwordData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },

    onError: (error) => {
      toast.error(error.message || "Unable to update password");
    },
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (!profileName.trim()) {
      toast.error("Name is required");
      return;
    }

    updateProfileMutation.mutate({
      name: profileName.trim(),
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    updatePasswordMutation.mutate(passwordData);
  };

  const isProfileUpdating = updateProfileMutation.isPending;
  const isPasswordUpdating = updatePasswordMutation.isPending;

  if (isProfileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <LoaderCircle size={20} className="animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  if (isProfileError || !employee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Unable to load settings
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
            Leave Requests
          </a>

          <a
            href="/employee/tasks"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <CheckSquare2 size={19} />
            Tasks
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
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
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
                Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
                Manage your personal information.
              </p>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
            {getInitials(employee.name)}
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <User size={20} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Update your basic personal details.
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isProfileUpdating}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProfileUpdating ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Update Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <User size={20} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Account Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Managed by your organization.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Employee ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {employee.id}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Email Address
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {employee.email}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Department
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {employee.department?.name || "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Role
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {employee.role || "EMPLOYEE"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Joining Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(employee.joiningDate)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {employee.status || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <LockKeyhole size={20} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Change Password
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Update your account password securely.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Current Password
                  </label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    placeholder="Current password"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    placeholder="New password"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    placeholder="Confirm password"
                  />
                </div>

                <div className="flex justify-end md:col-span-3">
                  <button
                    type="submit"
                    disabled={isPasswordUpdating}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPasswordUpdating ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EmployeeSettings;
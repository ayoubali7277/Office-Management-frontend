import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  Calendar,
  CheckSquare2,
  LucideCreditCard,
  BarChart2,
  Settings as SettingsIcon,
  LogOutIcon,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSetting, setActiveSetting] = useState("organization");

  const [formData, setFormData] = useState({
    companyName: "",
    timezone: "Pakistan Standard Time",
    address: "",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const queryClient = useQueryClient();

  const {
    data: organizationData,
    isLoading: organizationLoading,
    isError: organizationIsError,
    error: organizationError,
  } = useQuery({
    queryKey: ["organizationSettings"],
    queryFn: async () => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/organization-admin/settings/organization",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch organization settings"
        );
      }

      return result;
    },
  });

  const {
    data: profileResponse,
    isLoading: profileLoading,
    isError: profileIsError,
    error: profileError,
  } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: async () => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/organization-admin/settings/profile",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch admin profile");
      }

      return result;
    },
  });

  useEffect(() => {
    if (organizationData?.organization) {
      setFormData({
        companyName: organizationData.organization.name || "",
        timezone:
          organizationData.organization.timezone ||
          "Pakistan Standard Time",
        address: organizationData.organization.address || "",
      });
    }
  }, [organizationData]);

  useEffect(() => {
    if (profileResponse?.user) {
      setProfileData({
        name: profileResponse.user.name || "",
        email: profileResponse.user.email || "",
      });
    }
  }, [profileResponse]);

  useEffect(() => {
    if (organizationIsError) {
      toast.error(
        organizationError?.message || "Failed to fetch organization settings"
      );
    }
  }, [organizationIsError, organizationError]);

  useEffect(() => {
    if (profileIsError) {
      toast.error(profileError?.message || "Failed to fetch admin profile");
    }
  }, [profileIsError, profileError]);

  const updateOrganizationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/organization-admin/settings/organization",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.companyName,
            timezone: formData.timezone,
            address: formData.address,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update organization settings"
        );
      }

      return result;
    },
    onSuccess: (data) => {
      toast.success(
        data.message || "Organization settings updated successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["organizationSettings"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to update organization settings"
      );
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/organization-admin/settings/profile",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update admin profile");
      }

      return result;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Admin profile updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["adminProfile"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update admin profile");
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/organization-admin/settings/password",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwordData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to change password");
      }

      return result;
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
      toast.error(error.message || "Failed to change password");
    },
  });

  const handleOrganizationSubmit = (e) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      toast.error("Organization name is required");
      return;
    }

    updateOrganizationMutation.mutate();
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    updateProfileMutation.mutate();
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    updatePasswordMutation.mutate();
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
          className="absolute right-4 top-4 text-slate-400 hover:text-white lg:hidden"
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a
            href="/employees"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <Users size={19} />
            Employees
          </a>

          <a
            href="/departments"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <Building2 size={19} />
            Departments
          </a>

          <a
            href="/attendance"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <Clock size={19} />
            Attendance
          </a>

          <a
            href="/leaves"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <Calendar size={19} />
            Leaves
          </a>

          <a
            href="/tasks"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <CheckSquare2 size={19} />
            Tasks
          </a>

          <a
            href="/payroll"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <LucideCreditCard size={19} />
            Payroll
          </a>

          <a
            href="/reports"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <BarChart2 size={19} />
            Reports
          </a>
        </nav>

        <div className="mt-auto space-y-2">
          <a
            href="/settings"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
          >
            <SettingsIcon size={19} />
            Settings
          </a>

          <a
            href=""
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <LogOutIcon size={19} />
            Logout
          </a>
        </div>
      </aside>

      <main className="ml-64 min-h-screen max-lg:ml-0">
        <header className="flex items-center bg-white px-8 py-5 max-md:px-5 max-sm:px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-3 hidden text-slate-600 transition hover:text-orange-600 max-lg:block"
          >
            <Menu size={24} />
          </button>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 max-sm:text-xl">
              Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500 max-sm:text-xs">
              Manage your organization and account settings.
            </p>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[230px_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
              <button
                onClick={() => setActiveSetting("organization")}
                className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
                ${
                  activeSetting === "organization"
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                }`}
              >
                <Building2 size={18} />
                Organization
              </button>

              <button
                onClick={() => setActiveSetting("profile")}
                className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
                ${
                  activeSetting === "profile"
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                }`}
              >
                <User size={18} />
                Admin Profile
              </button>

              <button
                onClick={() => setActiveSetting("security")}
                className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
                ${
                  activeSetting === "security"
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                }`}
              >
                <ShieldCheck size={18} />
                Security
              </button>
            </div>

            <div>
              {activeSetting === "organization" && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Organization Settings
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage your organization's basic information.
                    </p>
                  </div>

                  <form onSubmit={handleOrganizationSubmit} className="p-6">
                    {organizationLoading ? (
                      <p className="text-sm text-slate-500">
                        Loading organization settings...
                      </p>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Company Name
                            </label>

                            <input
                              type="text"
                              value={formData.companyName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  companyName: e.target.value,
                                })
                              }
                              placeholder="Enter company name"
                              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Timezone
                            </label>

                            <select
                              value={formData.timezone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  timezone: e.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            >
                              <option>Pakistan Standard Time</option>
                              <option>USA Standard Time</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-5">
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Address
                          </label>

                          <textarea
                            rows="4"
                            value={formData.address}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: e.target.value,
                              })
                            }
                            placeholder="Enter organization address"
                            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                          ></textarea>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <button
                            type="submit"
                            disabled={updateOrganizationMutation.isPending}
                            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updateOrganizationMutation.isPending
                              ? "Saving..."
                              : "Save Changes"}
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              )}

              {activeSetting === "profile" && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Admin Profile
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage your administrator account information.
                    </p>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="p-6">
                    {profileLoading ? (
                      <p className="text-sm text-slate-500">
                        Loading admin profile...
                      </p>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Full Name
                            </label>

                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Enter your name"
                              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Email
                            </label>

                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  email: e.target.value,
                                })
                              }
                              placeholder="admin@example.com"
                              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updateProfileMutation.isPending
                              ? "Updating..."
                              : "Update Profile"}
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              )}

              {activeSetting === "security" && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Security
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Update your password and keep your account secure.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="p-6">
                    <div className="max-w-xl space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Current Password
                        </label>

                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="Enter current password"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          New Password
                        </label>

                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder="Enter new password"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Confirm New Password
                        </label>

                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="Confirm new password"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={updatePasswordMutation.isPending}
                        className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatePasswordMutation.isPending
                          ? "Changing..."
                          : "Change Password"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Settings;
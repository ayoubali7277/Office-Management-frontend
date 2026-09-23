import {
  LayoutDashboard,
  Building2,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  LockKeyhole,
  Globe2,
  Save,
  LoaderCircle,
  Eye,
  EyeOff,
} from "lucide-react";

import { useState, useEffect } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

function PasswordInput({
  label,
  name,
  value,
  show,
  onChange,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function SuperAdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [platform, setPlatform] = useState({
    name: "",
    email: "",
    maintenanceMode: false,
    allowRegistrations: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const fetchSuperAdminProfile = async () => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/super-admin/dashboard",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Unable to fetch profile data");
    }

    return data;
  };

  const fetchPlatformSettings = async () => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/super-admin/platform-settings",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to fetch platform settings"
      );
    }

    return data;
  };

  const updatePlatformSettings = async (platformData) => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/super-admin/update/platform-settings",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(platformData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to update platform settings"
      );
    }

    return data;
  };

  const updateProfile = async (profileData) => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/super-admin/profile",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update profile");
    }

    return data;
  };

  const updatePassword = async (passwordData) => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/super-admin/change-password",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to change password");
    }

    return data;
  };

  const logoutUser = async () => {
    const response = await fetch(
      "https://office-management-backend-production.up.railway.app/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to logout");
    }

    return data;
  };

  const {
    data: profileData,
    isLoading: profileFetching,
  } = useQuery({
    queryKey: ["super-admin-profile"],
    queryFn: fetchSuperAdminProfile,
  });

  const {
    data: platformData,
    isLoading: platformFetching,
  } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: fetchPlatformSettings,
  });

  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      setShowLogoutModal(false);
      window.location.href = "/login";
    },

    onError: (error) => {
      toast.error(error.message || "Unable to logout");
    },
  });

  const profileMutation = useMutation({
    mutationFn: updateProfile,

    onSuccess: (data) => {
      setProfile({
        name: data.user.name || "",
        email: data.user.email || "",
      });

      queryClient.invalidateQueries({
        queryKey: ["super-admin-profile"],
      });

      toast.success("Profile updated successfully.");
    },

    onError: (error) => {
      toast.error(
        error.message || "Unable to update profile."
      );
    },
  });

  const platformMutation = useMutation({
    mutationFn: updatePlatformSettings,

    onSuccess: (data) => {
      setPlatform({
        name: data.settings.name || "",
        email: data.settings.email || "",
        maintenanceMode: data.settings.maintenanceMode,
        allowRegistrations: data.settings.allowRegistrations,
      });

      queryClient.invalidateQueries({
        queryKey: ["platform-settings"],
      });

      toast.success(
        "Platform Settings Updated Successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error.message || "Unable to update platform settings."
      );
    },
  });

  const passwordMutation = useMutation({
    mutationFn: updatePassword,

    onSuccess: () => {
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password updated successfully");
    },

    onError: (error) => {
      toast.error(
        error.message || "Unable to change password"
      );
    },
  });

  useEffect(() => {
    if (profileData?.admin) {
      setProfile({
        name: profileData.admin.name || "",
        email: profileData.admin.email || "",
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (platformData?.settings) {
      setPlatform({
        name: platformData.settings.name || "",
        email: platformData.settings.email || "",
        maintenanceMode: platformData.settings.maintenanceMode,
        allowRegistrations: platformData.settings.allowRegistrations,
      });
    }
  }, [platformData]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));
  };

  const handlePlatformChange = (event) => {
    const { name, value, type, checked } = event.target;

    setPlatform((previousPlatform) => ({
      ...previousPlatform,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previousPasswords) => ({
      ...previousPasswords,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();

    profileMutation.mutate(profile);
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      toast.error(
        "New password and confirm password do not match."
      );
      return;
    }

    passwordMutation.mutate({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
  };

  const handlePlatformSubmit = (event) => {
    event.preventDefault();

    platformMutation.mutate({
      name: platform.name,
      email: platform.email,
      maintenanceMode: platform.maintenanceMode,
      allowRegistrations: platform.allowRegistrations,
    });
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
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <button
          type="button"
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

          <p className="ml-12 mt-1 text-sm font-medium text-slate-400">
            Super Admin Panel
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          <a
            href="/super-admin"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a
            href="/super-admin/organizations"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Building2 size={19} />
            Pending Organizations
          </a>

          <a
            href="/super-admin/reports"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <BarChart2 size={19} />
            Reports
          </a>
        </nav>

        <div className="mt-auto space-y-2">
          <a
            href="/super-admin/settings"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
          >
            <Settings size={19} />
            Settings
          </a>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen max-lg:ml-0">
        <header className="flex items-center justify-between bg-white px-8 py-5 max-md:px-5 max-sm:px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
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
                Manage your account and platform settings.
              </p>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
            AK
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <User size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Profile
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Update your Super Admin account information.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleProfileSubmit}
                className="mt-6"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your name"
                      required
                      disabled={profileFetching}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email"
                      required
                      disabled={profileFetching}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      profileMutation.isPending ||
                      profileFetching
                    }
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {profileMutation.isPending ? (
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={17} />
                    )}

                    {profileMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <LockKeyhole size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Security
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Change your account password.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="mt-6"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <PasswordInput
                    label="Current Password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    show={showPasswords.current}
                    onChange={handlePasswordChange}
                    onToggle={() =>
                      setShowPasswords((previous) => ({
                        ...previous,
                        current: !previous.current,
                      }))
                    }
                  />

                  <PasswordInput
                    label="New Password"
                    name="newPassword"
                    value={passwords.newPassword}
                    show={showPasswords.new}
                    onChange={handlePasswordChange}
                    onToggle={() =>
                      setShowPasswords((previous) => ({
                        ...previous,
                        new: !previous.new,
                      }))
                    }
                  />

                  <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    show={showPasswords.confirm}
                    onChange={handlePasswordChange}
                    onToggle={() =>
                      setShowPasswords((previous) => ({
                        ...previous,
                        confirm: !previous.confirm,
                      }))
                    }
                  />
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Use at least 8 characters for your new password.
                </p>

                <div className="mt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordMutation.isPending}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {passwordMutation.isPending ? (
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <LockKeyhole size={17} />
                    )}

                    {passwordMutation.isPending
                      ? "Changing..."
                      : "Change Password"}
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Globe2 size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Platform
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage basic platform-level settings.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handlePlatformSubmit}
                className="mt-6"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Platform Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={platform.name}
                      onChange={handlePlatformChange}
                      placeholder="Enter platform name"
                      required
                      disabled={platformFetching}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Platform Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={platform.email}
                      onChange={handlePlatformChange}
                      placeholder="Enter platform email"
                      required
                      disabled={platformFetching}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="pr-4">
                      <p className="text-sm font-medium text-slate-800">
                        Maintenance Mode
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Temporarily restrict access to the platform.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={platform.maintenanceMode}
                      onChange={handlePlatformChange}
                      disabled={platformFetching}
                      className="h-4 w-4 cursor-pointer accent-orange-500"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="pr-4">
                      <p className="text-sm font-medium text-slate-800">
                        Allow Organization Registrations
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Allow new organizations to register on the platform.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="allowRegistrations"
                      checked={platform.allowRegistrations}
                      onChange={handlePlatformChange}
                      disabled={platformFetching}
                      className="h-4 w-4 cursor-pointer accent-orange-500"
                    />
                  </label>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      platformMutation.isPending ||
                      platformFetching
                    }
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {platformMutation.isPending ? (
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={17} />
                    )}

                    {platformMutation.isPending
                      ? "Saving..."
                      : "Save Settings"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 `z-[100]` flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Confirm Logout
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to logout from your account?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={logoutMutation.isPending}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {logoutMutation.isPending && (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                )}

                {logoutMutation.isPending
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminSettings;
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CheckSquare2,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  UserRound,
  ShieldCheck,
  ArrowLeft,
  Save,
  LockKeyhole,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";

import { useState } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

function ManagerSettings() {
  const queryClient = useQueryClient();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSetting, setActiveSetting] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const {
    data: profileResponse,
    isLoading: profileFetching,
    isError: profileIsError,
    error: profileError,
  } = useQuery({
    queryKey: ["manager-profile"],
    queryFn: async () => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/managers/settings/profile",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch manager profile"
        );
      }

      return data;
    },
  });

  const manager = profileResponse?.manager;

  const departmentName =
    manager?.managedDepartment?.name || "Not Assigned";

  const managerInitials = manager?.name
    ? manager.name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
        .map((word) => word[0].toUpperCase())
        .join("")
    : "";

  const profileMutation = useMutation({
    mutationFn: async (updatedProfile) => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/managers/settings/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedProfile),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      setProfileMessage(data.message);

      queryClient.setQueryData(
        ["manager-profile"],
        data
      );

      queryClient.invalidateQueries({
        queryKey: ["manager-profile"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
      setProfileMessage("");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (passwordDetails) => {
      const response = await fetch(
        "https://office-management-backend-production.up.railway.app/api/managers/settings/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(passwordDetails),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update password"
        );
      }

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      setPasswordMessage(data.message);
      setPasswordError("");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    },

    onError: (error) => {
      toast.error(error.message);
      setPasswordError(error.message);
      setPasswordMessage("");
    },
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setProfileMessage("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordMessage("");
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    setProfileMessage("");

    profileMutation.mutate({
      name: profileData.name,
      email: profileData.email,
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordMessage("");

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters."
      );
      return;
    }

    passwordMutation.mutate(passwordData);
  };

  const handleProfileOpen = () => {
    setProfileData({
      name: manager?.name || "",
      email: manager?.email || "",
    });

    setProfileMessage("");
    setActiveSetting("profile");
  };

  const handleBack = () => {
    setActiveSetting(null);
    setProfileMessage("");
    setPasswordMessage("");
    setPasswordError("");
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
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
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
                Manage your account and security settings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 max-sm:gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
              {profileFetching
                ? "..."
                : managerInitials || "?"}
            </div>
          </div>
        </header>

        <section className="p-8 max-md:p-5 max-sm:p-4">
          {profileIsError && (
            <div className="mx-auto mb-6 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-600">
                {profileError?.message ||
                  "Failed to load manager profile."}
              </p>
            </div>
          )}

          {activeSetting === null && (
            <div className="mx-auto max-w-3xl">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Account Settings
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Choose what you want to manage.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleProfileOpen}
                  className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-100">
                      <UserRound size={22} />
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-slate-900">
                        Profile & Personal Information
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        Manage your name, email and department information.
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-medium text-orange-600 transition group-hover:translate-x-1">
                    Open →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSetting("security")}
                  className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-200">
                      <ShieldCheck size={22} />
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-slate-900">
                        Password & Security
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        Manage your account password and security.
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-medium text-slate-700 transition group-hover:translate-x-1">
                    Open →
                  </span>
                </button>
              </div>
            </div>
          )}

          {activeSetting === "profile" && (
            <div className="mx-auto max-w-3xl">
              <button
                type="button"
                onClick={handleBack}
                className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-600"
              >
                <ArrowLeft size={17} />
                Back to Settings
              </button>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <UserRound size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Profile & Personal Information
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Update your personal information.
                      </p>
                    </div>
                  </div>
                </div>

                {profileFetching ? (
                  <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500">
                    <LoaderCircle
                      size={20}
                      className="animate-spin"
                    />
                    Loading profile...
                  </div>
                ) : profileIsError ? (
                  <div className="p-6">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-medium text-red-600">
                        {profileError?.message ||
                          "Unable to load profile."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleProfileSubmit}
                    className="p-6"
                  >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          required
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          required
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Department
                        </label>

                        <input
                          type="text"
                          value={departmentName}
                          readOnly
                          className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                      <div>
                        {profileMessage && (
                          <p className="text-sm font-medium text-green-600">
                            {profileMessage}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={profileMutation.isPending}
                        className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {profileMutation.isPending ? (
                          <>
                            <LoaderCircle
                              size={18}
                              className="animate-spin"
                            />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeSetting === "security" && (
            <div className="mx-auto max-w-3xl">
              <button
                type="button"
                onClick={handleBack}
                className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-600"
              >
                <ArrowLeft size={17} />
                Back to Settings
              </button>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <ShieldCheck size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Password & Security
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Update your account password.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-5 p-6"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Current Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showCurrentPassword
                            ? "text"
                            : "password"
                        }
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            !showCurrentPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(!showNewPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-600"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Confirm New Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <p className="text-sm font-medium text-red-600">
                      {passwordError}
                    </p>
                  )}

                  {passwordMessage && (
                    <p className="text-sm font-medium text-green-600">
                      {passwordMessage}
                    </p>
                  )}

                  <div className="flex justify-end border-t border-slate-100 pt-5">
                    <button
                      type="submit"
                      disabled={passwordMutation.isPending}
                      className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {passwordMutation.isPending ? (
                        <>
                          <LoaderCircle
                            size={18}
                            className="animate-spin"
                          />
                          Updating...
                        </>
                      ) : (
                        <>
                          <LockKeyhole size={18} />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ManagerSettings;

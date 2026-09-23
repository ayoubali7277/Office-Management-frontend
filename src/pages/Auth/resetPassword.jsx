import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, LoaderCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage({
      type: "",
      text: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Please fill in all fields.",
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match.",
      });
      return;
    }

    try {
      setLoading(true);

      setMessage({
        type: "",
        text: "",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log({
        token,
        newPassword: formData.newPassword,
      });

      setMessage({
        type: "success",
        text: "Your password has been reset successfully.",
      });

      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-stone-200 bg-white p-8 shadow-xl shadow-stone-200/40 sm:p-10">

          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <LockKeyhole size={26} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Reset Password
            </h1>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Create a new password for your account.
            </p>
          </div>

          {message.text && (
            <div
              className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pr-12 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-700"
                >
                  {showNewPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-stone-400">
                Password must be at least 8 characters.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pr-12 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
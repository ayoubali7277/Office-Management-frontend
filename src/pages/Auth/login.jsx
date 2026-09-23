import { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const loginUser = async(loginData) => {
  const response = await fetch(
    "https://office-management-backend-production.up.railway.app/api/auth/login",{
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },

      credentials: "include",
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    }
  );

  const data = await response.json();

  if(!response.ok){
    throw new Error(
      data.message || "Invalid Email or Password."
    );
  }

  return data;
}

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

 const loginMutation = useMutation({
  mutationFn: loginUser,

  onSuccess: (data) => {
    if(data.user.role === "SUPER_ADMIN"){
      navigate("/super-admin");
    }
    else if(data.user.role === "ORGANIZATION_ADMIN" ){
      navigate("/admin");
    }
    else if(data.user.role === "MANAGER"){
      navigate("/manager");
    }
    else if(data.user.role === "EMPLOYEE"){
      navigate("/employee");
    }
  },

  onError: (error) => {
    setLoginMessage({
      type: "error",
      text: error.message || "Something went wrong. Please try again.",
    });
  },
 });
 

 const loginLoading = loginMutation.isPending;

  const [forgotEmail, setForgotEmail] = useState("");

  
  const [forgotLoading, setForgotLoading] = useState(false);

  const [loginMessage, setLoginMessage] = useState({
    type: "",
    text: "",
  });

  const [forgotMessage, setForgotMessage] = useState({
    type: "",
    text: "",
  });

  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setLoginMessage({
      type: "",
      text: "",
    });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    setLoginMessage({
      type: "",
      text: "",
    });

    loginMutation.mutate(loginData);
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    setForgotLoading(true);
    setForgotMessage({
      type: "",
      text: "",
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setForgotMessage({
        type: "success",
        text: "If this email is registered, a password reset link will be sent.",
      });

      setForgotEmail("");
    } catch (error) {
      setForgotMessage({
        type: "error",
        text:
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotOpen = () => {
    setShowForgotPassword(true);
    setForgotMessage({
      type: "",
      text: "",
    });
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotEmail("");
    setForgotMessage({
      type: "",
      text: "",
    });
  };

  const Message = ({ message }) => {
    if (!message.text) {
      return null;
    }

    return (
      <div
        className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
          message.type === "success"
            ? "bg-green-50 text-green-600"
            : "bg-red-50 text-red-600"
        }`}
      >
        {message.type === "success" ? (
          <CheckCircle2 size={17} />
        ) : (
          <AlertCircle size={17} />
        )}

        <span>{message.text}</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-6">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <p className="text-lg font-bold uppercase tracking-widest text-orange-500">
            Office Management
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-10">

          {!showForgotPassword ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                  Welcome Back
                </h1>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Sign in to access your Office Management dashboard.
                </p>
              </div>

              <form
                onSubmit={handleLoginSubmit}
                className="space-y-5"
              >

                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F4] px-4 py-3.5 text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-sm font-semibold text-stone-700">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={handleForgotOpen}
                      className="cursor-pointer text-sm font-medium text-orange-500 transition hover:text-orange-600"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF8F4] px-4 py-3.5 pr-12 text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-stone-400 transition hover:text-stone-700"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>
                </div>

                {loginMessage.text && (
                  <Message message={loginMessage} />
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-semibold text-white transition hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loginLoading ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login

                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

              </form>

              <p className="mt-8 text-center text-sm text-stone-500">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-semibold text-orange-500 hover:text-orange-600"
                >
                  Create an account
                </a>
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-orange-600"
              >
                <ArrowLeft size={17} />
                Back to Login
              </button>

              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                  Forgot Password?
                </h1>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Enter your email and we'll send you a password reset link.
                </p>
              </div>

              <form
                onSubmit={handleForgotPassword}
                className="space-y-5"
              >

                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(event) => {
                      setForgotEmail(event.target.value);
                      setForgotMessage({
                        type: "",
                        text: "",
                      });
                    }}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F4] px-4 py-3.5 text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                {forgotMessage.text && (
                  <Message message={forgotMessage} />
                )}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-semibold text-white transition hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {forgotLoading ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [organizationName, setOrganizationName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerOrganization = async (formData) => {
    const response = await fetch(
      "http://localhost:3000/api/organization-admin/register",{
      method: "POST",
      headers : {
        "Content-Type" :"application/json",
      },
      body: JSON.stringify({
        organizationName: formData.organizationName,
        name: formData.name,
        email: formData.email,
        password: formData.password
      }),
      }
    );

    const data = await response.json();

    if(!response.ok){
      throw new Error(data.message);
    }

    return data;
  }

  const {
    mutate,isPending, isError, error, isSuccess, data,
  } = useMutation({
    mutationFn: registerOrganization,

     onSuccess: (data) => {
    alert(data.message);
  },
  onError: (error) => {
    alert(error.message);
  },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-6 py-12">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Office Management
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-10">


          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Create Your Account
            </h1>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Create your Office Management account and get started.
            </p>
          </div>


          <form className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();

            if(password !== confirmPassword){
              alert("Passwords must be same");
              return;
            }
            mutate({
              organizationName,
              email,
              name,
              password
            });

          }}
          >

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Organization Name
              </label>

              <input
                type="text"
                placeholder="Enter your company name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#FAF8F4] px-4 py-3.5 text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>


            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Admin Name
              </label>

              <input
                type="text"
                placeholder="Enter Admin name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#FAF8F4] px-4 py-3.5 text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-[#FAF8F4] px-4 py-3.5 text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F4] px-4 py-3.5 pr-12 text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F4] px-4 py-3.5 pr-12 text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
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
              disabled={isPending}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-semibold text-white transition hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20"
            >
              {isPending ? "Creating Account..." : "Create Account" }

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-stone-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Login
            </a>
          </p>
          <div className="mt-4 text-center">
            <a href="/" className="text-sm font-medium text-stone-500 transition hover:text-orange-500">← Back to Home</a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
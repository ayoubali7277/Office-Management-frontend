import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";

function Landing() {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-stone-900">

      <Navbar />

      <section className="relative overflow-hidden px-6 py-20 sm:py-28 lg:py-32">


        <div className="relative mx-auto max-w-4xl text-center">

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            Modern Office Management
          </div>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
            Run your office
            <span className="block text-orange-600">
              without the chaos
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-stone-600">
            Bring employees, attendance, leave requests, tasks and
            payroll together in one organized workspace
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="/register"
              className="rounded-lg bg-stone-900 px-7 py-3.5 text-center text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-600/10"
            >
              Create Your Workspace
            </a>

            <a
              href="/login"
              className="rounded-lg border border-stone-300 bg-white px-7 py-3.5 text-center text-sm font-semibold text-stone-700 transition duration-300 hover:-translate-y-1 hover:border-stone-400 hover:bg-stone-50"
            >
              Sign In
            </a>

          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm text-stone-500">

            <span>✓ Employee Management</span>
            <span>✓ Attendance</span>
            <span>✓ Payroll</span>

          </div>

        </div>
      </section>

      <Features />

      <Footer />

    </div>
  );
}

export default Landing;
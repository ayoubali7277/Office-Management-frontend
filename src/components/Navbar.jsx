import logo from "../assets/om-logo2.png";

function Navbar() {
  return (
    <nav className="w-full border-b border-stone-200 bg-[#f7f4ee]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Office Management"
            className="h-20 w-auto"
          />

          <div className="hidden border-l border-stone-300 pl-3 sm:block">
            <p className="text-sm font-bold tracking-wide text-stone-800">
              Office Management
            </p>
            <p className="text-xs text-stone-500">
              Work smarter. Together.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <a
            href="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-stone-700 transition duration-200 hover:bg-stone-200 hover:text-stone-950"
          >
            Login
          </a>

          <a
            href="/register"
            className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-600/10 mr-6"
          >
            Get Started
          </a>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
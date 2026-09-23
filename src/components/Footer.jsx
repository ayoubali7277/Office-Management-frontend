function Footer() {
  return (
    <footer className="bg-stone-950 px-6 py-16 text-stone-300">

      <div className="mx-auto max-w-7xl">

        <div className="grid gap-12 md:grid-cols-2">

          <div>

            <h2 className="text-2xl font-bold text-white">
              Office Management
            </h2>

            <p className="mt-4 max-w-md leading-7 text-stone-500">
              A simple workspace for organizations that want to
              spend less time managing paperwork and more time
              managing people.
            </p>

          </div>

          {/* <div className="flex flex-col gap-4 md:items-end">

            <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">
              Get started
            </p>

            <div className="flex gap-3">

              <a
                href="/login"
                className="rounded-lg border border-stone-700 px-5 py-2.5 text-sm font-medium text-stone-300 transition hover:border-stone-500 hover:bg-stone-900"
              >
                Login
              </a>

              <a
                href="/register"
                className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-orange-400"
              >
                Create Account
              </a>

            </div>

          </div> */}

        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-stone-800 pt-6 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 Office Management.
          </p>

          <p>
            Built for modern teams.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
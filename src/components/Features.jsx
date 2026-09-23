function Features() {
  const features = [
    {
      number: "01",
      title: "Employees",
      description:
        "Keep employee profiles, departments, roles and status organized in one place.",
    },
    {
      number: "02",
      title: "Attendance",
      description:
        "Track daily attendance, check-ins and check-outs without messy spreadsheets.",
    },
    {
      number: "03",
      title: "Leave Management",
      description:
        "Handle leave requests and approvals with a simple, transparent workflow.",
    },
    {
      number: "04",
      title: "Tasks",
      description:
        "Assign work, set priorities and keep track of progress across your team.",
    },
    {
      number: "05",
      title: "Payroll",
      description:
        "Keep salaries, payment information and payroll status organized.",
    },
    {
      number: "06",
      title: "Reports",
      description:
        "Turn your office data into useful insights for better decisions.",
    },
  ];

  return (
    <section className="border-y border-stone-200 bg-white px-6 py-24 sm:py-28">

      <div className="mx-auto max-w-7xl">

        <div className="max-w-2xl">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
            One workspace
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Everything your team needs to stay organized.
          </h2>

          <p className="mt-5 text-base leading-7 text-stone-500 sm:text-lg">
            Replace scattered tools and spreadsheets with one clear
            system for managing your entire organization.
          </p>

        </div>

        <div className="mt-14 grid border-l border-t border-stone-200 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => (
            <div
              key={feature.number}
              className="group border-b border-r border-stone-200 bg-[#f7f4ee] p-7 transition duration-300 hover:bg-stone-950"
            >

              <div className="flex items-start justify-between">

                <span className="text-sm font-bold text-orange-600">
                  {feature.number}
                </span>

                <span className="text-stone-300 transition group-hover:text-stone-700">
                  ↗
                </span>

              </div>

              <h3 className="mt-14 text-xl font-bold text-stone-900 transition group-hover:text-white">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-stone-500 transition group-hover:text-stone-400">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;
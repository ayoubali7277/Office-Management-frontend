import { X, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

function AddEmployee({
  onclose,
  editingEmployee,
  onSave,
  departments,
  departmentsLoading,
  isSaving,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    joiningDate: "",
    departmentId: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name || "",
        email: editingEmployee.email || "",
        password: "",
        phone: editingEmployee.phone || "",
        joiningDate: editingEmployee.joiningDate
          ? editingEmployee.joiningDate.split("T")[0]
          : "",
        departmentId: editingEmployee.department?.id
          ? String(editingEmployee.department.id)
          : "",
        status: editingEmployee.status || "ACTIVE",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        joiningDate: "",
        departmentId: "",
        status: "ACTIVE",
      });
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (editingEmployee) {
      onSave({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        joiningDate: formData.joiningDate,
        departmentId: formData.departmentId,
        status: formData.status,
      });

      return;
    }

    onSave({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      joiningDate: formData.joiningDate,
      departmentId: formData.departmentId,
    });
  };

  return (
    <div className="fixed inset-0 `z-[100]` flex items-center justify-center bg-slate-950/50 px-4 py-6">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingEmployee
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingEmployee
                ? "Update employee information."
                : "Add a new employee to your organization."}
            </p>
          </div>

          <button
            onClick={onclose}
            disabled={isSaving}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={22} />
          </button>

        </div>

        <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6">

          <div className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter employee email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {!editingEmployee && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Employee Password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter employee phone"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Joining Date
              </label>

              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department
              </label>

              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                disabled={departmentsLoading || isSaving}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">
                  {departmentsLoading
                    ? "Loading Departments..."
                    : "Select Department"}
                </option>

                {departments?.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            {editingEmployee && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>
            )}

          </div>

          <div className="mt-7 flex justify-end gap-3 border-t border-slate-200 pt-5 max-sm:flex-col-reverse">

            <button
              type="button"
              onClick={onclose}
              disabled={isSaving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || departmentsLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
            >
              {isSaving && (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              )}

              {isSaving
                ? editingEmployee
                  ? "Updating..."
                  : "Saving..."
                : editingEmployee
                ? "Update Employee"
                : "Save Employee"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AddEmployee;

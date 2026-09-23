import { LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

function AddManager({
  onclose,
  onSave,
  editManager,
  departments,
  isSaving,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    departmentId: "",
  });

  useEffect(() => {
    if (editManager) {
      setFormData({
        name: editManager.name || "",
        email: editManager.email || "",
        password: "",
        departmentId: editManager.managedDepartment?.id || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        departmentId: "",
      });
    }
  }, [editManager]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      return;
    }

    if (!formData.email.trim()) {
      return;
    }

    if (!editManager && !formData.password.trim()) {
      return;
    }

    if (editManager) {
      if (!formData.departmentId) {
        return;
      }

      onSave({
        name: formData.name,
        email: formData.email,
        departmentId: Number(formData.departmentId),
      });

      return;
    }

    onSave({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="fixed inset-0 `z-[100]` flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editManager ? "Edit Manager" : "Add Manager"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editManager
                ? "Update manager information and department."
                : "Create a new manager."}
            </p>
          </div>

          <button
            type="button"
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
                placeholder="Enter manager name"
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
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
                placeholder="Enter manager email"
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            {!editManager && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter manager password"
                  disabled={isSaving}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

                <p className="mt-2 text-xs text-slate-400">
                  This password will be used by the manager to log in.
                </p>
              </div>
            )}

            {editManager && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Department
                </label>

                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="">Select department</option>

                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ))}
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
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
            >
              {isSaving && (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              )}

              {isSaving
                ? editManager
                  ? "Updating..."
                  : "Saving..."
                : editManager
                ? "Update Manager"
                : "Save Manager"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddManager;
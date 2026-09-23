import { X, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

function AddDepartment({
  onclose,
  onSave,
  editDepartment,
  isSaving,
}) {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    setFormData({
      name: editDepartment?.name || "",
    });
  }, [editDepartment]);

  const handleSave = () => {
    onSave({
      name: formData.name,
    });
  };

  return (
    <div className="fixed inset-0 `z-[100]` flex items-center justify-center bg-slate-950/50 px-4 py-6">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editDepartment
                ? "Edit Department"
                : "Add Department"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editDepartment
                ? "Update department information."
                : "Create a new department for your organization."}
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

        <div className="p-6">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Department Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Enter department name"
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
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
                ? editDepartment
                  ? "Updating..."
                  : "Saving..."
                : editDepartment
                ? "Update Department"
                : "Save Department"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AddDepartment;
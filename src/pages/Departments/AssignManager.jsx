import { LoaderCircle, X } from "lucide-react";
import { useState } from "react";

function AssignManager({
  department,
  managers,
  onclose,
  onAssign,
  isSaving,
}) {
  const [managerId, setManagerId] = useState("");

  const availableManagers = managers.filter(
    (manager) =>
      manager.isActive && !manager.managedDepartment
  );

  const handleAssign = () => {
    if (!managerId) {
      return;
    }

    onAssign({
      managerId: Number(managerId),
      departmentId: department.id,
    });
  };

  return (
    <div className="fixed inset-0 `z-[100]` flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Assign Manager
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select an active manager for {department.name}.
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

        <div className="p-6">

          {availableManagers.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                No available managers
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Create an active manager first or free a manager from another department.
              </p>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Select Manager
              </label>

              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">
                  Select manager
                </option>

                {availableManagers.map((manager) => (
                  <option
                    key={manager.id}
                    value={manager.id}
                  >
                    {manager.name} — {manager.email}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              onClick={handleAssign}
              disabled={
                isSaving ||
                !managerId ||
                availableManagers.length === 0
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
            >
              {isSaving && (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              )}

              {isSaving
                ? "Assigning..."
                : "Assign Manager"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AssignManager;

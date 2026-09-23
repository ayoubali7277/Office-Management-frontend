import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const getCurrentUser = async () => {
  const response = await fetch(
    "https://office-management-backend-production.up.railway.app/api/auth/current-user",
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unauthorized");
  }

  return data.user;
};

function ProtectedRoute({ allowedRole, children }) {

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    if (user.role === "SUPER_ADMIN") {
      return <Navigate to="/super-admin" replace />;
    }

    if (user.role === "ORGANIZATION_ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "MANAGER") {
      return <Navigate to="/manager" replace />;
    }

    if (user.role === "EMPLOYEE") {
      return <Navigate to="/employee" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
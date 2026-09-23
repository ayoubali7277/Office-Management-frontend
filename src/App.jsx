import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/landing";
import Register from "./pages/Auth/register";
import Login from "./pages/Auth/login";
import ResetPassword from "./pages/Auth/resetPassword";
import Dashboard from "./pages/Admin/Dashboard";
import Employees from "./pages/Employees/employees";
import Departments from "./pages/Departments/departments";
import Attendance from "./pages/Attendance/attendance";
import Leaves from "./pages/Leaves/leaves";
import Tasks from "./pages/Tasks/tasks";
import Payroll from "./pages/Payroll/payroll";
import Reports from "./pages/Reports/report";
import Settings from "./pages/Settings/settings";
import ManagerDashboard from "./pages/Admin/managerDashboard";
import MyTeam from "./pages/Employees/myteam";
import ManagerAttendance from "./pages/Attendance/managerAttendance";
import LeaveRequests from "./pages/Leaves/managerLeave";
import ManagerTasks from "./pages/Tasks/managerTasks";
import ManagerReports from "./pages/Reports/managerReport";
import ManagerSettings from "./pages/Settings/managerSettings";
import EmployeeDashboard from "./pages/Admin/employeeDashboard";
import EmployeeAttendance from "./pages/Attendance/employeeAttendance";
import EmployeeTasks from "./pages/Tasks/employeeTasks";
import EmployeeLeaveRequests from "./pages/Leaves/employeeLeaves";
import EmployeePayroll from "./pages/Payroll/employeePayroll";
import EmployeeSettings from "./pages/Settings/employeeSettings";
import SuperAdminDashboard from "./pages/Admin/superAdminDashboard";
import SuperAdminOrganizations from "./pages/organizations/organization";
import SuperAdminReports from "./pages/Reports/superAdminReports";
import SuperAdminSettings from "./pages/Settings/superAdminSettings";


function App(){
  return(
    <>
    <Toaster position="top-right" />
    <BrowserRouter>
  <Routes>

   
    <Route path="/" element={<Landing />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/reset" element={<ResetPassword />} />


    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRole="ORGANIZATION_ADMIN">
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employees"
      element={
        <ProtectedRoute allowedRole="ORGANIZATION_ADMIN">
          <Employees />
        </ProtectedRoute>
      }
    />

    <Route
      path="/departments"
      element={
        <ProtectedRoute allowedRole="ORGANIZATION_ADMIN">
          <Departments />
        </ProtectedRoute>
      }
    />

    <Route
      path="/attendance"
      element={
        <ProtectedRoute allowedRole="ORGANIZATION_ADMIN">
          <Attendance />
        </ProtectedRoute>
      }
    />

    <Route
      path="/leaves"
      element={
        <ProtectedRoute allowedRole="ORGANIZATION_ADMIN">
          <Leaves />
        </ProtectedRoute>
      }
    />

    <Route
      path="/tasks"
      element={
        <ProtectedRoute allowedRole="ORGANIZATION_ADMIN">
          <Tasks />
        </ProtectedRoute>
      }
    />

    <Route
      path="/payroll"
      element={
        <ProtectedRoute allowedRole="ORGANIZATION_ADMIN">
          <Payroll />
        </ProtectedRoute>
      }
    />

    <Route
      path="/reports"
      element={
        <ProtectedRoute allowedRole="ORGANIZATION_ADMIN">
          <Reports />
        </ProtectedRoute>
      }
    />

    <Route
      path="/settings"
      element={
        <ProtectedRoute allowedRole="ORGANIZATION_ADMIN">
          <Settings />
        </ProtectedRoute>
      }
    />


    <Route
      path="/manager"
      element={
        <ProtectedRoute allowedRole="MANAGER">
          <ManagerDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/manager/team"
      element={
        <ProtectedRoute allowedRole="MANAGER">
          <MyTeam />
        </ProtectedRoute>
      }
    />

    <Route
      path="/manager/attendance"
      element={
        <ProtectedRoute allowedRole="MANAGER">
          <ManagerAttendance />
        </ProtectedRoute>
      }
    />

    <Route
      path="/manager/leaves"
      element={
        <ProtectedRoute allowedRole="MANAGER">
          <LeaveRequests />
        </ProtectedRoute>
      }
    />

    <Route
      path="/manager/tasks"
      element={
        <ProtectedRoute allowedRole="MANAGER">
          <ManagerTasks />
        </ProtectedRoute>
      }
    />

    <Route
      path="/manager/reports"
      element={
        <ProtectedRoute allowedRole="MANAGER">
          <ManagerReports />
        </ProtectedRoute>
      }
    />

    <Route
      path="/manager/settings"
      element={
        <ProtectedRoute allowedRole="MANAGER">
          <ManagerSettings />
        </ProtectedRoute>
      }
    />


    <Route
      path="/employee"
      element={
        <ProtectedRoute allowedRole="EMPLOYEE">
          <EmployeeDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employee/attendance"
      element={
        <ProtectedRoute allowedRole="EMPLOYEE">
          <EmployeeAttendance />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employee/tasks"
      element={
        <ProtectedRoute allowedRole="EMPLOYEE">
          <EmployeeTasks />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employee/leaves"
      element={
        <ProtectedRoute allowedRole="EMPLOYEE">
          <EmployeeLeaveRequests />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employee/payroll"
      element={
        <ProtectedRoute allowedRole="EMPLOYEE">
          <EmployeePayroll />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employee/settings"
      element={
        <ProtectedRoute allowedRole="EMPLOYEE">
          <EmployeeSettings />
        </ProtectedRoute>
      }
    />


    <Route
      path="/super-admin"
      element={
        <ProtectedRoute allowedRole="SUPER_ADMIN">
          <SuperAdminDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/super-admin/organizations"
      element={
        <ProtectedRoute allowedRole="SUPER_ADMIN">
          <SuperAdminOrganizations />
        </ProtectedRoute>
      }
    />

    <Route
      path="/super-admin/reports"
      element={
        <ProtectedRoute allowedRole="SUPER_ADMIN">
          <SuperAdminReports />
        </ProtectedRoute>
      }
    />

    <Route
      path="/super-admin/settings"
      element={
        <ProtectedRoute allowedRole="SUPER_ADMIN">
          <SuperAdminSettings />
        </ProtectedRoute>
      }
    />

  </Routes>
</BrowserRouter>
    </>
  )
}

export default App
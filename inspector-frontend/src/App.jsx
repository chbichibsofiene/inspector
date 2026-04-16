import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forbidden from "./pages/Forbidden";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminHome from "./pages/AdminHome";
import InspectorHome from "./pages/InspectorHome";
import InspectorCalendar from "./pages/InspectorCalendar";
import InspectorReports from "./pages/InspectorReports";
import InspectorPowerBi from "./pages/InspectorPowerBi";
import TeacherHome from "./pages/TeacherHome";
import ResponsibleHome from "./pages/ResponsibleHome";
import ProfileSetup from "./pages/ProfileSetup";
import Messenger from "./pages/Messenger";

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-shell-inner">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forbidden" element={<Forbidden />} />

            <Route
              path="/profile/setup"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowRoles={["ADMIN"]}>
                  <AdminHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inspector"
              element={
                <ProtectedRoute allowRoles={["INSPECTOR"]}>
                  <InspectorHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inspector/calendar"
              element={
                <ProtectedRoute allowRoles={["INSPECTOR"]}>
                  <InspectorCalendar />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inspector/reports"
              element={
                <ProtectedRoute allowRoles={["INSPECTOR"]}>
                  <InspectorReports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inspector/powerbi"
              element={
                <ProtectedRoute allowRoles={["INSPECTOR"]}>
                  <InspectorPowerBi />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowRoles={["TEACHER"]}>
                  <TeacherHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/responsible"
              element={
                <ProtectedRoute allowRoles={["PEDAGOGICAL_RESPONSIBLE"]}>
                  <ResponsibleHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messenger />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

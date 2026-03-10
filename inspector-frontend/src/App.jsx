import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forbidden from "./pages/Forbidden";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminHome from "./pages/AdminHome";
import InspectorHome from "./pages/InspectorHome";
import TeacherHome from "./pages/TeacherHome";
import ResponsibleHome from "./pages/ResponsibleHome";

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

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
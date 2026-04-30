import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Forbidden from "./pages/Forbidden";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ActionLogs from "./pages/ActionLogs";
import UserHistory from "./pages/UserHistory";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminUsers from "./pages/AdminUsers";
import InspectorHome from "./pages/InspectorHome";
import InspectorCalendar from "./pages/InspectorCalendar";
import InspectorReports from "./pages/InspectorReports";
import InspectorPowerBi from "./pages/InspectorPowerBi";
import InspectorTeachers from "./pages/InspectorTeachers";
import InspectorQuizzes from "./pages/InspectorQuizzes";
import InspectorCourses from "./pages/InspectorCourses";
import TeacherHome from "./pages/TeacherHome";
import TeacherReports from "./pages/TeacherReports";
import TeacherCalendar from "./pages/TeacherCalendar";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import TeacherCourses from "./pages/TeacherCourses";
import ResponsibleHome from "./pages/ResponsibleHome";
import ProfileSetup from "./pages/ProfileSetup";
import Messenger from "./pages/Messenger";
import Welcome from "./pages/Welcome";

import AdminLayout from "./components/AdminLayout";

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-shell-inner">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forbidden" element={<Forbidden />} />

            <Route
              path="/profile/setup"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />

            {/* Admin Module */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowRoles={["ADMIN"]}>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowRoles={["ADMIN"]}>
                  <AdminLayout><AdminUsers /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute allowRoles={["ADMIN"]}>
                  <AdminLayout><ActionLogs /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/history"
              element={
                <ProtectedRoute allowRoles={["ADMIN"]}>
                  <AdminLayout><UserHistory /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowRoles={["ADMIN"]}>
                  <AdminLayout><AdminAnalytics /></AdminLayout>
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
              path="/inspector/teachers"
              element={
                <ProtectedRoute allowRoles={["INSPECTOR"]}>
                  <InspectorTeachers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inspector/quizzes"
              element={
                <ProtectedRoute allowRoles={["INSPECTOR"]}>
                  <InspectorQuizzes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inspector/courses"
              element={
                <ProtectedRoute allowRoles={["INSPECTOR"]}>
                  <InspectorCourses />
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
              path="/reports"
              element={
                <ProtectedRoute allowRoles={["TEACHER"]}>
                  <TeacherReports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/calendar"
              element={
                <ProtectedRoute allowRoles={["TEACHER"]}>
                  <TeacherCalendar />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/quizzes"
              element={
                <ProtectedRoute allowRoles={["TEACHER"]}>
                  <TeacherQuizzes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/courses"
              element={
                <ProtectedRoute allowRoles={["TEACHER"]}>
                  <TeacherCourses />
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

            <Route path="/" element={<Welcome />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

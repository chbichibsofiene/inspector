import http from "./http";

export const getAdminDashboard = () => http.get("/api/dashboard/admin");
export const getInspectorDashboard = () => http.get("/api/dashboard/inspector");
export const getTeacherDashboard = () => http.get("/api/dashboard/teacher");
export const getResponsibleDashboard = () => http.get("/api/dashboard/responsible");
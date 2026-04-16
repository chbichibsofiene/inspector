import http from "./http";

export const getAdminDashboard = () => http.get("/dashboard/admin");
export const getInspectorDashboard = () => http.get("/dashboard/inspector");
export const getTeacherDashboard = () => http.get("/dashboard/teacher");
export const getResponsibleDashboard = () => http.get("/dashboard/responsible");
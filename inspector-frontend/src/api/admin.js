import http from "./http";

// User Management
export const getAdminUsers = () => http.get("/admin/users");
export const getPendingUsers = () => http.get("/admin/users/pending");
export const verifyUserAccount = (userId) => http.put(`/admin/verify/${userId}`);
export const assignUserRole = (userId, role) => 
  http.put(`/admin/role/${userId}?role=${role}`);
export const deleteUserAccount = (userId) => http.delete(`/admin/users/${userId}`);

// Audit and Monitoring
export const getActionLogs = (params) => http.get("/admin/logs", { params });
export const getUserHistory = (userId) => http.get(`/admin/users/${userId}/history`);

// Location Helpers for Dropdowns (Direct from DB)
export const getRegions = () => http.get("/admin/regions");
export const getDelegations = (regionId) => 
  http.get("/admin/delegations" + (regionId && regionId !== "" ? `?regionId=${regionId}` : ""));

// Analytics Dashboard
export const getAdminEvaluationAnalytics = (subject, regionId, delegationId) => {
  let url = "/admin/analytics/kpis?";
  if (subject) url += `subject=${encodeURIComponent(subject)}&`;
  if (regionId && regionId !== "") url += `regionId=${regionId}&`;
  if (delegationId && delegationId !== "") url += `delegationId=${delegationId}&`;
  return http.get(url);
};

export const getAdminTrends = (subject, regionId, delegationId) => {
  let url = "/admin/analytics/trends?";
  if (subject) url += `subject=${encodeURIComponent(subject)}&`;
  if (regionId && regionId !== "") url += `regionId=${regionId}&`;
  if (delegationId && delegationId !== "") url += `delegationId=${delegationId}&`;
  return http.get(url);
};

export const getRegionAnalytics = (subject) => 
  http.get("/admin/analytics/regions" + (subject ? `?subject=${encodeURIComponent(subject)}` : ""));
export const getDelegationAnalytics = (subject) => 
  http.get("/admin/analytics/delegations" + (subject ? `?subject=${encodeURIComponent(subject)}` : ""));

// Misc
export const getUserAnalytics = () => http.get("/admin/analytics/users");
export const getAdminKpis = () => http.get("/admin/dashboard/kpis");
export const getAdminAlerts = () => http.get("/admin/alerts");
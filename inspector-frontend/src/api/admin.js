import http from "./http";

export const getAllUsers = () => http.get("/api/admin/users");
export const getPendingUsers = () => http.get("/api/admin/users/pending");
export const verifyUser = (userId) => http.put(`/api/admin/verify/${userId}`);
export const assignRole = (userId, role) =>
  http.put(`/api/admin/role/${userId}?role=${encodeURIComponent(role)}`);
export const deleteUser = (userId) => http.delete(`/api/admin/users/${userId}`);
import http from "./http";

export const getAllUsers = () => http.get("/admin/users");
export const getPendingUsers = () => http.get("/admin/users/pending");
export const verifyUser = (userId) => http.put(`/admin/verify/${userId}`);
export const assignRole = (userId, role) =>
  http.put(`/admin/role/${userId}?role=${encodeURIComponent(role)}`);
export const deleteUser = (userId) => http.delete(`/admin/users/${userId}`);
import http from "./http";

export const getReports = (activityId) =>
  http.get("/inspector/reports", {
    params: activityId ? { activityId } : {},
  });

export const createReport = (payload) => http.post("/inspector/reports", payload);

export const updateReport = (reportId, payload) =>
  http.put(`/inspector/reports/${reportId}`, payload);

export const deleteReport = (reportId) => http.delete(`/inspector/reports/${reportId}`);

export const downloadReportPdf = (reportId) =>
  http.get(`/inspector/reports/${reportId}/pdf`, {
    responseType: "blob",
  });

export const importReportPdf = (reportId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.post(`/inspector/reports/${reportId}/pdf-import`, formData);
};

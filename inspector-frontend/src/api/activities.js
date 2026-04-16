import http from "./http";

export const getActivities = () => http.get("/inspector/activities");
export const getActivityTeachers = () => http.get("/inspector/activities/teachers");
export const createActivity = (payload) => http.post("/inspector/activities", payload);
export const updateActivity = (activityId, payload) =>
  http.put(`/inspector/activities/${activityId}`, payload);
export const deleteActivity = (activityId) => http.delete(`/inspector/activities/${activityId}`);

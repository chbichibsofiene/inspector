import http from "./http";

// ─── Inspector API ──────────────────────────────────────────────────────────

export const createCourse = (data) => http.post("/inspector/courses", data);
export const getInspectorCourses = () => http.get("/inspector/courses");
export const getInspectorCourseDetail = (courseId) => http.get(`/inspector/courses/${courseId}`);
export const publishCourse = (courseId) => http.patch(`/inspector/courses/${courseId}/publish`);
export const addModuleToCourse = (courseId, data) => http.post(`/inspector/courses/${courseId}/modules`, data);
export const assignTeacher = (courseId, teacherUserId) => http.post(`/inspector/courses/${courseId}/assign/${teacherUserId}`);
export const unassignTeacher = (courseId, teacherUserId) => http.delete(`/inspector/courses/${courseId}/assign/${teacherUserId}`);
export const getCourseProgress = (courseId) => http.get(`/inspector/courses/${courseId}/progress`);
export const deleteCourse = (courseId) => http.delete(`/inspector/courses/${courseId}`);
export const deleteModuleFromCourse = (courseId, moduleId) => http.delete(`/inspector/courses/${courseId}/modules/${moduleId}`);

// ─── Teacher API ─────────────────────────────────────────────────────────────

export const getTeacherCourses = () => http.get("/teacher/courses");
export const getTeacherCourseDetail = (courseId) => http.get(`/teacher/courses/${courseId}`);
export const markLessonComplete = (lessonId, score = null) =>
  http.post(`/teacher/courses/lessons/${lessonId}/complete`, score != null ? { score } : {});

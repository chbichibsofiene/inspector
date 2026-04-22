import http from "./http";

export const generateQuiz = (topic, subject) => 
  http.post(`/inspector/quizzes/generate?topic=${encodeURIComponent(topic)}&subject=${encodeURIComponent(subject)}`);

export const saveQuiz = (payload) => 
  http.post("/inspector/quizzes", payload);

export const getInspectorQuizzes = () =>
  http.get("/inspector/quizzes");

export const getTeacherQuizzes = () => 
  http.get("/teacher/quizzes");

export const submitQuiz = (quizId, answers) => 
  http.post(`/teacher/quizzes/${quizId}/submit`, answers);

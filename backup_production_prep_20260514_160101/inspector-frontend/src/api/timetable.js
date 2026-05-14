import http from "./http";

export function getTimetable() {
    return http.get("/teacher/timetable");
}

export function addTimetableSlot(payload) {
    return http.post("/teacher/timetable", payload);
}

export function deleteTimetableSlot(id) {
    return http.delete(`/teacher/timetable/${id}`);
}

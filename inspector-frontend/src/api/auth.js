import http from "./http";

export function login(payload) {
   return http.post("/api/auth/login" , payload);
}

export function register(payload) {
    return http.post("/api/auth/register" , payload);
}
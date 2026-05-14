import http from "./http";

export function login(payload) {
   return http.post("/auth/login" , payload);
}

export function register(payload) {
    return http.post("/auth/register" , payload);
}

export function forgotPassword(payload) {
    return http.post("/auth/forgot-password", payload);
}

export function resetPassword(payload) {
    return http.post("/auth/reset-password", payload);
}
import http from "./http";

export const getPowerBiDataset = () => http.get("/api/inspector/analytics/powerbi");

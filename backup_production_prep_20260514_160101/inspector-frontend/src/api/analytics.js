import http from "./http";

export const getPowerBiDataset = () => http.get("/inspector/analytics/powerbi");

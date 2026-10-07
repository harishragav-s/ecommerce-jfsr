import client from "./client";

export const getFeatureImages = () => client.get("/api/common/feature/get");
export const addFeatureImage = (image) => client.post("/api/common/feature/add", { image });

import client from "./client";

export const getReviews = (productId) => client.get(`/api/shop/review/${productId}`);
export const addReview = (data) => client.post("/api/shop/review/add", data);

import client from "./client";

export const getCart = (userId) => client.get(`/api/shop/cart/get/${userId}`);
export const addToCart = (data) => client.post("/api/shop/cart/add", data);
export const updateCart = (data) => client.put("/api/shop/cart/update-cart", data);
export const removeFromCart = (userId, productId) =>
  client.delete(`/api/shop/cart/${userId}/${productId}`);

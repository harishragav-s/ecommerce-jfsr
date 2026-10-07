import client from "./client";

export const createOrder = (data) => client.post("/api/shop/order/create", data);
export const capturePayment = (data) => client.post("/api/shop/order/capture", data);
export const getOrders = (userId) => client.get(`/api/shop/order/list/${userId}`);
export const getOrder = (id) => client.get(`/api/shop/order/details/${id}`);

export const adminGetOrders = () => client.get("/api/admin/orders/get");
export const adminGetOrder = (id) => client.get(`/api/admin/orders/details/${id}`);
export const adminUpdateOrderStatus = (id, orderStatus) =>
  client.put(`/api/admin/orders/update/${id}`, { orderStatus });

import client from "./client";

export const getProducts = (params) =>
  client.get(`/api/shop/products/get?${new URLSearchParams(params)}`);
export const getProduct = (id) => client.get(`/api/shop/products/get/${id}`);
export const searchProducts = (keyword) => client.get(`/api/shop/search/${keyword}`);

export const adminGetProducts = () => client.get("/api/admin/products/get");
export const adminAddProduct = (data) => client.post("/api/admin/products/add", data);
export const adminEditProduct = (id, data) =>
  client.put(`/api/admin/products/edit/${id}`, data);
export const adminDeleteProduct = (id) => client.delete(`/api/admin/products/delete/${id}`);

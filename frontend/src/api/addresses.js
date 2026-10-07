import client from "./client";

export const getAddresses = (userId) => client.get(`/api/shop/address/get/${userId}`);
export const addAddress = (data) => client.post("/api/shop/address/add", data);
export const updateAddress = (userId, addressId, data) =>
  client.put(`/api/shop/address/update/${userId}/${addressId}`, data);
export const deleteAddress = (userId, addressId) =>
  client.delete(`/api/shop/address/delete/${userId}/${addressId}`);

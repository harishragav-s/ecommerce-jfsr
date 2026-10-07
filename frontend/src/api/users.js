import client from "./client";

export const adminGetUsers = () => client.get("/api/admin/users");
export const adminDeleteUser = (id) => client.delete(`/api/admin/users/${id}`);

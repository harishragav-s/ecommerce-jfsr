import client from "./client";

export const register = (formData) => client.post("/api/auth/register", formData);
export const login = (formData) => client.post("/api/auth/login", formData);
export const logout = () => client.post("/api/auth/logout");
export const checkAuth = () =>
  client.get("/api/auth/check-auth", {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });

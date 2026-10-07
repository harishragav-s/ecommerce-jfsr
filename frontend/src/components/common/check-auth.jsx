import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;
  const isAdmin = user?.role === "ADMIN";
  const home = isAdmin ? "/admin/dashboard" : "/shop/home";
  const onAuthPage = path.includes("/login") || path.includes("/register");

  if (path === "/") return <Navigate to={isAuthenticated ? home : "/auth/login"} replace />;
  if (!isAuthenticated && !onAuthPage) return <Navigate to="/auth/login" replace />;
  if (isAuthenticated && onAuthPage) return <Navigate to={home} replace />;
  if (isAuthenticated && !isAdmin && path.startsWith("/admin")) return <Navigate to="/unauth-page" replace />;

  return <>{children}</>;
}

export default CheckAuth;

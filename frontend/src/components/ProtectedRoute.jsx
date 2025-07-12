import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // while still checking auth status
  }

  if (user) {
    return <Outlet />; // placeholder where actual protected routes will be rendered
  }

  return <Navigate to="/login" />; // redirect to login if not logged in
}

export default ProtectedRoute;

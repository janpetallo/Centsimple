import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // while still checking auth status
  }

  if (!user) {
    // if no user is logged in, render PUBLIC routes
    return <Outlet />; // placeholder where actual PUBLIC routes will be rendered
  }

  return <Navigate to="/dashboard" />; // redirect to dashboard if logged in
}

export default PublicRoute;

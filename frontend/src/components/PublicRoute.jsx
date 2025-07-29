import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex grow items-center justify-center">
        <LoadingSpinner className="text-on-primary-container bg-primary-container h-16 w-16 rounded-full" />
      </div>
    ); // while still checking auth status
  }

  if (!user) {
    // if no user is logged in, render PUBLIC routes
    return <Outlet />; // placeholder where actual PUBLIC routes will be rendered
  }

  return <Navigate to="/dashboard" />; // redirect to dashboard if logged in
}

export default PublicRoute;

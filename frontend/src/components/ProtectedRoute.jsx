import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex grow items-center justify-center">
        <LoadingSpinner className="text-on-primary-container bg-primary-container h-16 w-16 rounded-full" />
      </div>
    ); // while still checking auth status
  }

  if (user) {
    // if user is logged in, render PROTECTED routes
    return <Outlet />; // placeholder where actual protected routes will be rendered
  }

  return <Navigate to="/login" />; // redirect to login if not logged in
}

export default ProtectedRoute;

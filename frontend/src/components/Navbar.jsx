import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b p-4">
      <div className="text-lg font-bold">
        <Link to={user ? '/dashboard' : '/'}>Momentum Money</Link>
      </div>

      {user ? (
        <ul className="flex items-center gap-4">
          <li className="font-medium text-gray-600 transition-colors hover:text-gray-900">
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      ) : (
        <ul className="flex items-center gap-4">
          <li className="font-medium text-gray-600 transition-colors hover:text-gray-900">
            <Link to="/register">Register</Link>
          </li>
          <li className="font-medium text-gray-600 transition-colors hover:text-gray-900">
            <Link to="/login">Login</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
export default Navbar;

import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-full transition-colors text-label-large hover:bg-primary-container hover:text-on-primary-container ${
      isActive ? 'text-primary' : 'text-on-surface-variant'
    }`;

  const textButtonClasses =
    'cursor-pointer bg-transparent border-none px-3 py-2 rounded-full transition-colors text-label-large text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container';

  return (
    <nav className="bg-surface flex h-16 items-center justify-between p-4 shadow-sm">
      {/* Brand/Logo Link */}
      <Link
        to={user ? '/dashboard' : '/'}
        className="text-primary text-title-large"
      >
        Centsimple
      </Link>

      {/* Action Links Container */}
      <div>
        {user ? (
          // Logged-in links
          <ul className="flex items-center gap-2">
            <li>
              <NavLink to="/dashboard" className={navLinkClasses}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <button onClick={logout} className={textButtonClasses}>
                Logout
              </button>
            </li>
          </ul>
        ) : (
          // Logged-out links
          <ul className="flex items-center gap-2">
            <li>
              <NavLink to="/register" className={navLinkClasses}>
                Register
              </NavLink>
            </li>
            <li>
              <Link
                to="/login"
                className="text-label-large bg-primary-container text-on-primary-container rounded-full px-4 py-2 transition-colors hover:opacity-90 hover:shadow-md"
              >
                Login
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

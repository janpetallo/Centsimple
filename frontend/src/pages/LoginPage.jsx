import { useState } from 'react';
import * as apiService from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showResendLink, setShowResendLink] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setInfoMessage('');
    setLoading(true);

    try {
      const userData = await apiService.loginUser(formData);
      console.log('User logged in successfully', userData);
      // Pass the user data to the auth provider login function
      // This will update the user state in the context
      login(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in user', error.message);
      if (error.message == 'Please verify your email to log in.') {
        setShowResendLink(true);
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setInfoMessage('');
    setLoading(true);

    try {
      const data = await apiService.resendVerificationEmail(formData.email);
      setInfoMessage(data.message); // if successful, show message
      setError(null); // only if successful, clear error to avoid layout shift
    } catch (error) {
      console.error('Error resending verification email', error.message);
      setError(error.message);
    } finally {
      setShowResendLink(false);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <h2 className="text-headline-medium mb-8 text-left">Login</h2>

      <div className="bg-surface-container rounded-2xl p-8 shadow-sm">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="text-label-large text-on-surface-variant"
          >
            Email
          </label>
          <input
            className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            required
          />

          <label
            htmlFor="password"
            className="text-label-large text-on-surface-variant"
          >
            Password
          </label>
          <input
            className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            required
          />

          {error && (
            <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
              {error}
            </p>
          )}

          {infoMessage && (
            <p className="bg-primary-container text-on-primary-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
              {infoMessage}
            </p>
          )}

          {showResendLink && (
            <button
              type="button"
              disabled={loading}
              onClick={handleResend}
              className="text-on-secondary bg-secondary text-label-large mt-4 inline-block cursor-pointer rounded-full px-8 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex grow items-center justify-center">
                  <LoadingSpinner className="text-on-primary-container bg-primary-container h-6 w-6 rounded-full" />
                </div>
              ) : (
                'Resend Verification Email'
              )}
            </button>
          )}

          {!showResendLink && !infoMessage && (
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-on-primary text-label-large mt-4 inline-block cursor-pointer rounded-full px-8 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex grow items-center justify-center">
                  <LoadingSpinner className="text-on-primary-container bg-primary-container h-6 w-6 rounded-full" />
                </div>
              ) : (
                'Login'
              )}
            </button>
          )}
        </form>
        <p className="text-on-surface-variant text-label-large mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

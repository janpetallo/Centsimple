import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as apiService from '../services/api.service';
import LoadingSpinner from '../components/LoadingSpinner';

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function validatePassword() {
      // The `!` is removed. Now it checks if confirmPassword has a value.
      if (
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        setError('Passwords do not match');
      } else {
        setError(null);
      }
    }

    validatePassword();
  }, [formData.confirmPassword, formData.password]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (error) return;

    setError(null);
    setLoading(true);

    try {
      const userData = await apiService.registerUser(formData);
      console.log('User registered successfully', userData);
      // Here we will redirect the user to the login page or show a success message
    } catch (error) {
      console.error('Error registering user', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <h2 className="text-headline-medium mb-8 text-left">Register</h2>
      <div className="bg-surface-container rounded-2xl p-8 shadow-sm">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label
            htmlFor="firstName"
            className="text-label-large text-on-surface-variant"
          >
            First Name
          </label>
          <input
            className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label
            htmlFor="lastName"
            className="text-label-large text-on-surface-variant"
          >
            Last Name
          </label>
          <input
            className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

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
            value={formData.email}
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
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label
            htmlFor="confirmPassword"
            className="text-label-large text-on-surface-variant"
          >
            Confirm Password
          </label>
          <input
            className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
              {error}
            </p>
          )}

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
              'Register'
            )}
          </button>
        </form>
        <p className="text-on-surface-variant text-label-large mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

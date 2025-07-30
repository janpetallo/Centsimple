import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as apiService from '../services/api.service';
import LoadingSpinner from '../components/LoadingSpinner';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import ErrorIcon from '../icons/ErrorIcon';

function VerifyEmailPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const [searchParams] = useSearchParams();
  const effectRan = useRef(false);
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // In development, with StrictMode, this effect runs twice.
    // This check ensures the verification logic only runs once.
    if (effectRan.current) {
      return;
    }
    effectRan.current = true;

    const token = searchParams.get('token');

    if (!token) {
      setLoading(false);
      setStatus('error');
      setMessage('Verification token not found.');
      return;
    }

    async function verifyEmail() {
      try {
        const response = await apiService.verifyEmail(token);
        setMessage(response.message || 'Email verified successfully!');
        setStatus('success');
      } catch (error) {
        console.error('Error verifying email:', error.message);
        setMessage(error.message || 'Email verification failed.');
        setStatus('error');
      } finally {
        setLoading(false);
      }
    }

    verifyEmail();
  }, [searchParams]); // Depend on searchParams to re-run if the URL changes

  function handleChange(e) {
    setEmail(e.target.value);
  }

  async function handleResend(e) {
    e.preventDefault();
    setIsResending(true);
    setError(null);
    setInfoMessage('');

    try {
      const data = await apiService.resendVerificationEmail(email);
      setInfoMessage(data.message); // if successful, show message
    } catch (error) {
      console.error('Error resending verification email', error.message);
      setError(error.message);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex grow flex-col items-center justify-center p-4 text-center">
      <div className="bg-surface-container border-outline/10 flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl border p-8 shadow-sm">
        {loading && (
          <>
            <h2 className="text-headline-medium">Verifying...</h2>
            <LoadingSpinner className="text-on-primary-container bg-primary-container h-16 w-16 rounded-full" />
            <p className="text-body-large">{message}</p>
          </>
        )}

        {!loading && status === 'success' && (
          <>
            <CheckCircleIcon className="text-primary h-16 w-16" />
            <h2 className="text-headline-medium">Verification Successful!</h2>
            <p className="text-body-large">{message}</p>
            <Link
              to="/login"
              className="bg-primary text-on-primary mt-4 w-full rounded-full px-6 py-2 text-center font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
            >
              Proceed to Login
            </Link>
          </>
        )}

        {!loading && status === 'error' && (
          <>
            {!infoMessage && (
              <>
                <ErrorIcon className="text-error h-16 w-16" />
                <h2 className="text-headline-medium">Verification Failed</h2>
                <p className="text-body-large">{message}</p>

                <form
                  className="mt-8 flex w-full flex-col gap-4 text-left"
                  onSubmit={handleResend}
                >
                  <label
                    htmlFor="email"
                    className="text-label-large text-on-surface-variant hidden"
                  >
                    Email
                  </label>
                  <input
                    className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
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
                    disabled={isResending}
                    className="text-on-secondary bg-secondary text-label-large mt-4 inline-block cursor-pointer rounded-full px-8 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isResending ? (
                      <div className="flex grow items-center justify-center">
                        <LoadingSpinner className="text-on-primary-container bg-primary-container h-6 w-6 rounded-full" />
                      </div>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                </form>
              </>
            )}

            {infoMessage && (
              <>
                <CheckCircleIcon className="text-primary h-16 w-16" />

                <h2 className="text-headline-medium">
                  Verification Email Sent
                </h2>

                <p className="bg-primary-container text-on-primary-container mt-2 w-full rounded-2xl p-2 text-center text-sm">
                  {infoMessage}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;

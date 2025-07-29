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
      setMessage('Verification token not found. Please check your email link.');
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

  return (
    <div className="flex grow flex-col items-center justify-center p-4 text-center">
      <div className="bg-surface-container border-outline/10 flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border p-8 shadow-sm">
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
            <ErrorIcon className="text-error h-16 w-16" />
            <h2 className="text-headline-medium">Verification Failed</h2>
            <p className="text-body-large">{message}</p>
            <p className="text-body-large mt-4">
              Need a new verification link?{' '}
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline"
              >
                Register again.
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;

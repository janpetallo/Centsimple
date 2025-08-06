import LoadingSpinner from './LoadingSpinner';

function AiSummary({ summary, isLoading, error }) {
  return (
    <>
      <p className="text-on-surface-variant text-sm">AI Summary</p>

      {isLoading ? (
        <div className="flex grow items-center justify-center">
          <LoadingSpinner className="text-on-primary-container bg-primary-container h-12 w-12 rounded-full" />
        </div>
      ) : (
        <div className="text-on-primary-container">
          <p>{summary}</p>
        </div>
      )}

      {error && (
        <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
          {error}
        </p>
      )}
    </>
  );
}

export default AiSummary;

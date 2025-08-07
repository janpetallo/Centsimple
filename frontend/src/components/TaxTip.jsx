import CloseIcon from '../icons/CloseIcon';
import LoadingSpinner from './LoadingSpinner';

function TaxTip({ tip, onDismiss, isLoading, error }) {
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <p className="text-on-surface-variant text-sm">Tax Tip</p>
        {!isLoading && (
          <button onClick={onDismiss}>
            <CloseIcon className="hover:text-primary h-5 w-5 cursor-pointer" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex grow items-center justify-center">
          <LoadingSpinner className="text-on-primary-container bg-primary-container h-12 w-12 rounded-full" />
        </div>
      ) : (
        <div className="text-on-primary-container">
          <p className="break-words whitespace-pre-line">{tip}</p>
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

export default TaxTip;

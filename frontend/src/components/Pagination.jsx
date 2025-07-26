import BackIcon from '../icons/BackIcon';
import ForwardIcon from '../icons/ForwardIcon';

function Pagination({ pagination, onPageChange }) {
  function handlePrevBtnClick() {
    onPageChange(pagination.page - 1);
  }

  function handleNextBtnClick() {
    onPageChange(pagination.page + 1);
  }

  // Do not render anything if there's only one page or no pagination data
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <button
        onClick={handlePrevBtnClick}
        disabled={pagination.page === 1}
        className="bg-surface-container hover:bg-surface-variant text-on-surface-variant cursor-pointer rounded-full px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        <BackIcon className="h-6 w-6" />
      </button>

      <span className="bg-tertiary-container text-on-tertiary-container rounded-2xl px-6 py-4 text-sm">
        Page {pagination.page} of {pagination.totalPages}
      </span>

      <button
        onClick={handleNextBtnClick}
        disabled={pagination.page === pagination.totalPages}
        className="bg-surface-container hover:bg-surface-variant text-on-surface-variant cursor-pointer rounded-full px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ForwardIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default Pagination;

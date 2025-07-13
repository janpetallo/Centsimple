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
    <div>
      <button onClick={handlePrevBtnClick} disabled={pagination.page === 1}>
        Previous
      </button>

      <span>
        Page {pagination.page} of {pagination.totalPages}
      </span>

      <button
        onClick={handleNextBtnClick}
        disabled={pagination.page === pagination.totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;

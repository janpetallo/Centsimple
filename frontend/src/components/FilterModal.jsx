import { useState, useEffect } from 'react';
import Modal from './Modal';

function FilterModal({ categories, currentFilters, onApply, onClose }) {
  const [draftFilters, setDraftFilters] = useState(currentFilters);

  // This effect will run whenever the modal is opened or the parent's filters change.
  // It ensures our draft state is always up-to-date with the "live" state.
  useEffect(() => {
    setDraftFilters(currentFilters);
  }, [currentFilters]);

  function handleDraftFiltersChange(e) {
    setDraftFilters({
      ...draftFilters,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onApply(draftFilters);
  }

  return (
    <Modal title="Filters" onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label
          htmlFor="dateRange"
          className="text-label-large text-on-surface-variant"
        >
          Date Range
        </label>
        <select
          className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
          id="dateRange"
          name="dateRangeFilter"
          value={draftFilters.dateRangeFilter}
          onChange={handleDraftFiltersChange}
        >
          <option value="">All Time</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="last90days">Last 90 Days</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="thisYear">This Year</option>
          <option value="lastYear">Last Year</option>
        </select>

        <label
          htmlFor="categoryId"
          className="text-label-large text-on-surface-variant"
        >
          Category
        </label>
        <select
          className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
          id="categoryId"
          name="categoryFilter"
          value={draftFilters.categoryFilter}
          onChange={handleDraftFiltersChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="mt-6 flex grow flex-col items-center gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border-outline text-label-large hover:bg-surface-container w-full cursor-pointer rounded-full border px-6 py-2 transition-colors sm:w-fit sm:border-none"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-primary text-on-primary text-label-large inline-block w-full cursor-pointer rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg sm:w-fit"
          >
            Apply
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default FilterModal;

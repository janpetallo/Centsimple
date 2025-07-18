import { useState, useEffect } from "react";

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
    <div>
      <h2>Filter Transactions</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="dateRange">Date Range:</label>
        <select
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

        <label htmlFor="category">Category:</label>
        <select
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

        <button type="button" onClick={onClose}>
          Cancel
        </button>

        <button type="submit">Apply</button>
      </form>
    </div>
  );
}

export default FilterModal;

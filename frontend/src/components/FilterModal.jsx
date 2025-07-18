function FilterModal({
  categories,
  dateRangeFilter,
  categoryFilter,
  handleDateRangeChange,
  handleCategoryChange,
  onApply,
  onClose,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onApply();
  }

  return (
    <div>
      <h2>Filter Transactions</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="dateRange">Date Range:</label>
        <select
          id="dateRange"
          name="dateRange"
          value={dateRangeFilter}
          onChange={handleDateRangeChange}
          
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
          name="categoryId"
          value={categoryFilter}
          onChange={handleCategoryChange}
          
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

        <button type="submit">
          Apply
        </button>
      </form>
    </div>
  );
}

export default FilterModal;

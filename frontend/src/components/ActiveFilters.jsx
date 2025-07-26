import { useMemo } from 'react';
import FilterPill from './FilterPill';

function ActiveFilters({ categories, filters, searchTerm, onClearFilter }) {
  // Create a category map only when the categories array changes
  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => {
      map.set(category.id, category.name);
    });
    return map;
  }, [categories]);

  function findCategoryName(categoryId) {
    const filterCategoryId = parseInt(categoryId, 10);
    const category = categoryMap.get(filterCategoryId) || 'Unknown';
    return category;
  }
  function findDateRange(dateRange) {
    let range = 'Unknown';
    const now = new Date();
    let startDate = null;

    switch (dateRange) {
      case 'last7days':
        range = 'Last 7 Days';
        break;
      case 'last30days':
        range = 'Last 30 Days';
        break;
      case 'last90days':
        range = 'Last 90 Days';
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        range =
          startDate.toLocaleString('default', { month: 'long' }) +
          ' ' +
          startDate.getFullYear();
        break;
      case 'lastMonth':
        // First day of the previous month
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        range =
          startDate.toLocaleString('default', { month: 'long' }) +
          ' ' +
          startDate.getFullYear();
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        range = startDate.getFullYear();
        break;
      case 'lastYear':
        // First day of the previous year
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        range = startDate.getFullYear();
        break;
      default:
        break;
    }
    return range;
  }

  return (
    <div className="flex gap-2">
      {searchTerm && (
        <FilterPill
          label={`"${searchTerm}"`}
          onClear={() => onClearFilter('searchTerm')}
        />
      )}

      {filters.dateRangeFilter && (
        <FilterPill
          label={` ${findDateRange(filters.dateRangeFilter)}`}
          onClear={() => onClearFilter('dateRangeFilter')}
        />
      )}

      {filters.categoryFilter && (
        <FilterPill
          label={`${findCategoryName(filters.categoryFilter)}`}
          onClear={() => onClearFilter('categoryFilter')}
        />
      )}
    </div>
  );
}

export default ActiveFilters;

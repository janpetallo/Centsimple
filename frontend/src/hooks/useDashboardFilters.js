import { useState, useRef } from 'react';
import useDebounce from './useDebounce';

export function useDashboardFilters(onFilterChange) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRangeFilter: '',
    categoryFilter: '',
  });

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 500);
  const searchInputRef = useRef(null);

  function handleSearchInputChange(e) {
    setSearchInput(e.target.value);
    onFilterChange();
  }

  function openFilterModal() {
    setIsFilterModalOpen(true);
  }

  function closeFilterModal() {
    setIsFilterModalOpen(false);
  }

  function applyFilters(draftFilters) {
    setFilters(draftFilters);
    onFilterChange();
    closeFilterModal();
  }

  function clearFilter(filterName) {
    if (filterName === 'searchTerm') {
      setSearchInput('');
    } else {
      setFilters((prevFilters) => ({ ...prevFilters, [filterName]: '' }));
    }
    onFilterChange();
  }

  return {
    isFilterModalOpen,
    filters,
    searchInput,
    debouncedSearchTerm,
    searchInputRef,
    handleSearchInputChange,
    openFilterModal,
    closeFilterModal,
    applyFilters,
    clearFilter,
  };
}

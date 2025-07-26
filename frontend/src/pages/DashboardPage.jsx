import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as apiService from '../services/api.service';
import * as formatter from '../utils/format';
import Pagination from '../components/Pagination';
import ActionMenu from '../components/ActionMenu';
import ManageCategoriesModal from '../components/ManageCategoriesModal';
import AddCategoryModal from '../components/AddCategoryModal';
import EditCategoryModal from '../components/EditCategoryModal';
import AddTransactionModal from '../components/AddTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';
import ConfirmationDialog from '../components/ConfirmationDialog';

import SearchIcon from '../icons/SearchIcon';
import useDebounce from '../hooks/useDebounce';
import FilterListIcon from '../icons/FilterListIcon';
import FilterModal from '../components/FilterModal';
import AddIcon from '../icons/AddIcon';

function DashboardPage() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] =
    useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryError, setCategoryError] = useState({ id: null, message: '' });

  const [isTransactionModelOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionError, setTransactionError] = useState({
    id: null,
    message: '',
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRangeFilter: '',
    categoryFilter: '',
  });

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 1000);
  const searchInputRef = useRef(null);

  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  useEffect(() => {
    // This effect runs every time the transactions list is updated.
    // We check if the search input is the currently active element.
    // If it's not, we re-apply focus to it.
    if (document.activeElement !== searchInputRef.current) {
      // We can add a check here to only re-focus if there was a search term
      if (searchInput) {
        searchInputRef.current.focus();
      }
    }
  }, [transactions, searchInput]); // Run this effect when transactions or searchInput changes

  // Wrap fetchData in useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesData, transactionsData] = await Promise.all([
        apiService.getCategories(),
        apiService.getTransactions(
          currentPage,
          filters.categoryFilter,
          filters.dateRangeFilter,
          debouncedSearchTerm
        ),
      ]);

      setCategories(categoriesData.categories);
      setTransactions(transactionsData.transactions);
      setBalance(transactionsData.balance);
      setPagination(transactionsData.pagination);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, debouncedSearchTerm]); // fetchData will only be re-created if any of these changes

  useEffect(() => {
    fetchData();
  }, [fetchData]); // only run useEffect when fetchData changes/recreated

  const navigate = useNavigate();

  function handleViewFinancialInsights() {
    console.log('View Financial Insights');
    navigate('/insights');
  }

  function handlePageChange(newPageNumber) {
    setCurrentPage(newPageNumber);
  }

  function handleSearchInputChange(e) {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  }

  function handleFilterModalOpen() {
    setIsFilterModalOpen(true);
  }

  function handleFilterModalClose() {
    setIsFilterModalOpen(false);
  }

  function handleFilterApplied(draftFilters) {
    setFilters(draftFilters);
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  }

  // MANAGE CATEGORIES
  function handleManageCategoriesModalOpen() {
    setCategoryError({ id: null, message: '' });
    setIsManageCategoriesModalOpen(true);
  }

  function handleCloseManageCategoriesModal() {
    setCategoryError({ id: null, message: '' });
    setIsManageCategoriesModalOpen(false);
  }

  // Closes the main modal and opens the "Add" modal
  function handleOpenAddCategoryModal() {
    setIsManageCategoriesModalOpen(false);
    setIsAddCategoryModalOpen(true);
  }

  // Closes the main modal and opens the "Edit" modal
  function handleOpenEditCategoryModal(category) {
    setIsManageCategoriesModalOpen(false);
    setEditingCategory(category);
  }

  // This function will close the "Add" or "Edit" modal and re-open the "Manage" modal
  function handleReturnToManageCategories() {
    setIsAddCategoryModalOpen(false);
    setEditingCategory(null);
    handleManageCategoriesModalOpen();
  }

  function handleCategoryCreated() {
    setIsAddCategoryModalOpen(false);
    setIsManageCategoriesModalOpen(true);
    fetchData();
  }

  function handleCategoryUpdated() {
    setEditingCategory(null);
    setIsManageCategoriesModalOpen(true);
    fetchData();
  }

  // DELETE CATEGORY
  function handleDeleteCategoryConfirmation(categoryId) {
    setConfirmationState({
      isOpen: true,
      title: 'Delete Category?',
      message: 'This will permanently delete the category.',
      onConfirm: () => handleDeleteCategory(categoryId),
    });
  }

  function handleCloseConfirmationDialog() {
    setConfirmationState({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
    });
  }

  async function handleDeleteCategory(categoryId) {
    setCategoryError({ id: null, message: '' });

    try {
      const categoryData = await apiService.deleteCategory(categoryId);
      console.log('Category deleted successfully', categoryData);
      handleCloseConfirmationDialog();
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error.message);
      setCategoryError({ id: categoryId, message: error.message });
    }
  }

  // ADD TRANSACTION
  function handleAddTransaction() {
    setIsTransactionModalOpen(true);
  }

  function handleCloseTransactionModal() {
    setIsTransactionModalOpen(false);
  }

  function handleTransactionCreated() {
    setIsTransactionModalOpen(false);
    // By setting the page to 1, we trigger the useEffect to run again automatically.
    // If we are already on page 1, we can call fetchData directly.
    if (currentPage === 1) {
      fetchData();
    } else {
      setCurrentPage(1);
    }
  }

  // EDIT TRANSACTION
  function handleEditTransaction(transaction) {
    setEditingTransaction(transaction);
  }

  function handleCloseEditTransactionModal() {
    setEditingTransaction(null);
  }

  function handleTransactionUpdated() {
    setEditingTransaction(null);
    fetchData();
  }

  // DELETE TRANSACTION
  function handleDeleteTransactionConfirmation(transactionId) {
    setConfirmationState({
      isOpen: true,
      title: 'Delete Transaction?',
      message: 'This will permanently delete the transaction.',
      onConfirm: () => handleDeleteTransaction(transactionId),
    });
  }

  async function handleDeleteTransaction(transactionId) {
    try {
      const transactionData = await apiService.deleteTransaction(transactionId);
      console.log('Transaction deleted successfully', transactionData);
      handleCloseConfirmationDialog();
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
      setTransactionError({ id: transactionId, message: error.message });
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-headline-medium text-left">Dashboard</h2>

        <div className="flex grow flex-col gap-4 sm:flex-row md:grow-0">
          <button
            onClick={handleViewFinancialInsights}
            className="border-outline text-on-secondary bg-secondary grow cursor-pointer rounded-full border px-4 py-2 transition-all duration-300 hover:scale-105 md:grow-0"
          >
            View Financial Insights
          </button>

          <button
            onClick={handleManageCategoriesModalOpen}
            className="border-outline text-primary grow cursor-pointer rounded-full border px-4 py-2 transition-all duration-300 hover:scale-105 md:grow-0"
          >
            Manage Categories
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex grow items-center justify-center">
          <h3>Loading...</h3>
        </div>
      ) : (
        <div className="flex grow flex-col">
          <div className="grow">
            <div className="bg-surface-container flex flex-col items-start justify-between gap-1 rounded-2xl p-6 shadow-sm">
              <p className="text-on-surface-variant text-sm">Balance</p>
              <p className="text-headline-medium text-on-surface">
                {formatter.formatCurrency(balance)}
              </p>
            </div>
            {isManageCategoriesModalOpen && (
              <ManageCategoriesModal
                categories={categories}
                error={categoryError}
                onClose={handleCloseManageCategoriesModal}
                onAddNew={handleOpenAddCategoryModal}
                onEdit={handleOpenEditCategoryModal}
                onDelete={handleDeleteCategoryConfirmation}
              />
            )}

            {isAddCategoryModalOpen && (
              <AddCategoryModal
                onCategoryCreated={handleCategoryCreated}
                onClose={handleReturnToManageCategories}
              />
            )}

            {editingCategory && (
              <EditCategoryModal
                category={editingCategory}
                onCategoryUpdated={handleCategoryUpdated}
                onClose={handleReturnToManageCategories}
              />
            )}

            <div className="my-4 flex items-center gap-2 sm:gap-4">
              {/* Search Bar Container */}
              <div className="relative flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  id="searchInput"
                  className="bg-surface-variant text-on-surface-variant placeholder:text-on-surface-variant/70 focus:ring-inverse-surface block w-full rounded-full border-0 py-2 pr-3 pl-10 focus:ring-1 focus:ring-inset sm:text-sm"
                  placeholder="Search transactions..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
              </div>

              {/* Filters Button */}
              <button
                onClick={handleFilterModalOpen}
                className="border-outline hover:bg-primary-container hover:text-on-primary-container inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 transition-colors"
              >
                <FilterListIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {/* Add Transaction Button (medium screens)*/}
              <button
                onClick={handleAddTransaction}
                className="bg-primary border-primary text-label-large text-on-primary hidden cursor-pointer items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg md:inline-flex"
              >
                <AddIcon className="h-5 w-5" />
                <span>Add Transaction</span>
              </button>
            </div>

            {isFilterModalOpen && (
              <FilterModal
                categories={categories}
                currentFilters={filters}
                onApply={handleFilterApplied}
                onClose={handleFilterModalClose}
              />
            )}

            {transactions.length === 0 && (
              <p className="bg-surface-container border-outline/10 mt-4 rounded-xl border p-8">
                <span className="md:hidden">
                  No transactions yet. Click the "+" button to get started!
                </span>
                {/* This span is HIDDEN by default and only appears on medium screens and up */}
                <span className="hidden md:inline">
                  No transactions yet. Click "Add Transaction" to get started!
                </span>
              </p>
            )}

            {transactions.length > 0 && (
              <ul className="mt-4 flex flex-col gap-2">
                {transactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="bg-surface-container border-outline/10 hover:bg-surface-variant hover:text-on-surface-variant rounded-xl border p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex grow flex-col gap-4 md:flex-row">
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2">
                          <p className="bg-secondary-container text-on-secondary-container max-w-fit rounded-full px-2 py-1 text-xs whitespace-nowrap">
                            {formatter.formatDate(transaction.date)}
                          </p>
                          <p className="bg-tertiary-container text-on-tertiary-container rounded-full px-2 py-1 text-xs">
                            {transaction.category.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-shrink-0 gap-4">
                        <p className="text-label-large p-1 text-right md:w-28">
                          {formatter.formatCurrency(
                            transaction.type === 'EXPENSE'
                              ? -transaction.amount
                              : transaction.amount
                          )}
                        </p>

                        <ActionMenu
                          onDelete={() =>
                            handleDeleteTransactionConfirmation(transaction.id)
                          }
                          onEdit={() => handleEditTransaction(transaction)}
                        />
                      </div>
                    </div>

                    <div>
                      {editingTransaction?.id === transaction.id && (
                        <EditTransactionModal
                          transaction={transaction}
                          categories={categories}
                          onTransactionUpdated={handleTransactionUpdated}
                          onClose={handleCloseEditTransactionModal}
                        />
                      )}

                      {transactionError.id === transaction.id && (
                        <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
                          {transactionError.message}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Add Transaction Button (small screens)*/}
            <button
              onClick={handleAddTransaction}
              className="bg-primary text-on-primary fixed right-8 bottom-8 cursor-pointer rounded-3xl px-4 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg md:hidden"
            >
              <AddIcon className="h-8 w-8" />
            </button>

            {isTransactionModelOpen && (
              <AddTransactionModal
                categories={categories}
                onTransactionCreated={handleTransactionCreated}
                onClose={handleCloseTransactionModal}
              />
            )}
          </div>
          <div>
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
      {confirmationState.isOpen && (
        <ConfirmationDialog
          isOpen={confirmationState.isOpen}
          title={confirmationState.title}
          message={confirmationState.message}
          onConfirm={confirmationState.onConfirm}
          onCancel={handleCloseConfirmationDialog}
        />
      )}
    </>
  );
}

export default DashboardPage;

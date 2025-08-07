import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as apiService from '../services/api.service';
import * as formatter from '../utils/format';
import Pagination from '../components/Pagination';
import ManageCategoriesModal from '../components/ManageCategoriesModal';
import AddCategoryModal from '../components/AddCategoryModal';
import EditCategoryModal from '../components/EditCategoryModal';
import AddTransactionModal from '../components/AddTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import TaxTip from '../components/TaxTip';
import TransactionListItem from '../components/TransactionListItem';
import SearchIcon from '../icons/SearchIcon';
import FilterListIcon from '../icons/FilterListIcon';
import FilterModal from '../components/FilterModal';
import ActiveFilters from '../components/ActiveFilters';
import AddIcon from '../icons/AddIcon';
import InsightsIcon from '../icons/InsightsIcon';
import CategoryIcon from '../icons/CategoryIcon';
import { useCategoryManager } from '../hooks/useCategoryManager';
import { useTransactionManager } from '../hooks/useTransactionManager';
import { useConfirmationDialog } from '../hooks/useConfirmationDialog';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import LoadingSpinner from '../components/LoadingSpinner';

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [activeTaxTip, setActiveTaxTip] = useState(null);
  const [isTipLoading, setIsTipLoading] = useState(false);
  const [isTipError, setIsTipError] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [pinnedCategoryIds, setPinnedCategoryIds] = useState(new Set());

  const { confirmationState, askForConfirmation, closeConfirmationDialog } =
    useConfirmationDialog();

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const {
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
  } = useDashboardFilters(handleFilterChange);

  // This new success handler can be passed to both hooks.
  // It intelligently handles data refreshing, including resetting to page 1.
  const handleSuccess = async ({
    transactionData = null,
    shouldResetPage = false,
  } = {}) => {
    if (transactionData && transactionData.isPotentiallyDeductible) {
      setActiveTaxTip(null);
      setIsTipLoading(true);
      setIsTipError(null);

      try {
        // Destructure here to make it clear what you need
        const { description, category } = transactionData.transaction;
        const taxTip = await apiService.generateTaxTip(
          description,
          category.name
        );
        setActiveTaxTip(taxTip.tip);
      } catch (error) {
        console.error('Error fetching tax tip:', error.message);
        setIsTipError(error.message);
      } finally {
        setIsTipLoading(false);
      }
    } else {
      setActiveTaxTip(null);
      setIsTipLoading(false);
      setIsTipError(null);
    }

    if (shouldResetPage && currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchData(false);
    }
  };

  // Wrap fetchData in useCallback
  const fetchData = useCallback(
    async (showPageLoader = true) => {
      if (showPageLoader) {
        setLoading(true);
      }

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
        setPinnedCategoryIds(new Set(categoriesData.pinnedIds));
        setTransactions(transactionsData.transactions);
        setBalance(transactionsData.balance);
        setPagination(transactionsData.pagination);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, filters, debouncedSearchTerm]
  ); // fetchData will only be re-created if any of these changes

  const {
    isManageCategoriesModalOpen,
    isAddCategoryModalOpen,
    editingCategory,
    categoryError,
    handleManageCategoriesModalOpen,
    handleCloseManageCategoriesModal,
    handleOpenAddCategoryModal,
    handleOpenEditCategoryModal,
    handleReturnToManageCategories,
    handleCategoryCreated,
    handleCategoryUpdated,
    handleDeleteCategory,
    handleTogglePinCategory,
  } = useCategoryManager(handleSuccess);

  const {
    isTransactionModalOpen,
    editingTransaction,
    transactionError,
    handleAddTransaction,
    handleCloseTransactionModal,
    handleTransactionCreated,
    handleEditTransaction,
    handleCloseEditTransactionModal,
    handleTransactionUpdated,
    handleDeleteTransaction,
  } = useTransactionManager(handleSuccess);

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
  }, [transactions, searchInput, searchInputRef]); // Run this effect when transactions or searchInput changes

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

  // DELETE CATEGORY CONFIRMATION
  function handleDeleteCategoryConfirmation(categoryId) {
    askForConfirmation({
      title: 'Delete category?',
      message:
        'This will permanently delete the category. This action cannot be undone.',
      onConfirm: () => handleDeleteCategory(categoryId),
    });
  }

  // DELETE TRANSACTION
  function handleDeleteTransactionConfirmation(transactionId) {
    askForConfirmation({
      title: 'Delete transaction?',
      message:
        'This will permanently delete the transaction. This action cannot be undone.',
      onConfirm: () => handleDeleteTransaction(transactionId),
    });
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-headline-medium text-left">Dashboard</h2>

        <div className="flex grow flex-col gap-4 sm:flex-row md:grow-0">
          <button
            onClick={handleViewFinancialInsights}
            className="border-outline text-on-secondary bg-secondary flex grow cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 hover:scale-105 md:grow-0"
          >
            <InsightsIcon className="h-5 w-5" />
            View Financial Insights
          </button>

          <button
            onClick={handleManageCategoriesModalOpen}
            className="border-outline text-primary flex grow cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 hover:scale-105 md:grow-0"
          >
            <CategoryIcon className="h-5 w-5" />
            Manage Categories
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex grow items-center justify-center">
          <LoadingSpinner className="text-on-primary-container bg-primary-container h-16 w-16 rounded-full" />
        </div>
      ) : (
        // Add padding to the bottom on mobile, and remove it on medium screens and up.
        <div className="flex grow flex-col pb-24 xl:pb-0">
          <div className="grow">
            <div className="bg-surface-container flex flex-col items-start justify-between gap-1 rounded-2xl p-6 shadow-sm">
              <p className="text-on-surface-variant text-sm">Balance</p>
              <p className="text-headline-medium text-on-surface">
                {formatter.formatCurrency(balance)}
              </p>
            </div>

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
                onClick={openFilterModal}
                className="border-outline hover:bg-primary-container hover:text-on-primary-container inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 transition-colors"
              >
                <FilterListIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {/* Add Transaction Button (medium screens)*/}
              <button
                onClick={handleAddTransaction}
                className="bg-primary border-primary text-label-large text-on-primary hidden cursor-pointer items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg xl:inline-flex"
              >
                <AddIcon className="h-5 w-5" />
                <span>Add Transaction</span>
              </button>
            </div>

            <div>
              <ActiveFilters
                categories={categories}
                filters={filters}
                searchTerm={debouncedSearchTerm}
                onClearFilter={clearFilter}
              />
            </div>

            {(isTipLoading || activeTaxTip || isTipError) && (
              <div className="bg-primary-container mt-4 flex flex-col items-start justify-between gap-1 rounded-2xl p-6 shadow-sm">
                <TaxTip
                  tip={activeTaxTip}
                  onDismiss={() => setActiveTaxTip(null)}
                  isLoading={isTipLoading}
                  error={isTipError}
                />
              </div>
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
                  <TransactionListItem
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransactionConfirmation}
                    error={transactionError}
                  />
                ))}
              </ul>
            )}

            {/* Add Transaction Button (small screens)*/}
            <button
              onClick={handleAddTransaction}
              className="bg-primary text-on-primary fixed right-8 bottom-8 cursor-pointer rounded-3xl px-4 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg xl:hidden"
            >
              <AddIcon className="h-12 w-12 md:h-16 md:w-16" />
            </button>
          </div>
          <div>
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
      {/* All modals are now rendered by this single, clean component */}
      <DashboardModals
        // Category Modals
        isManageCategoriesModalOpen={isManageCategoriesModalOpen}
        isAddCategoryModalOpen={isAddCategoryModalOpen}
        editingCategory={editingCategory}
        categoryError={categoryError}
        pinnedCategoryIds={pinnedCategoryIds}
        handleCloseManageCategoriesModal={handleCloseManageCategoriesModal}
        handleOpenAddCategoryModal={handleOpenAddCategoryModal}
        handleOpenEditCategoryModal={handleOpenEditCategoryModal}
        handleDeleteCategoryConfirmation={handleDeleteCategoryConfirmation}
        handleCategoryCreated={handleCategoryCreated}
        handleReturnToManageCategories={handleReturnToManageCategories}
        handleCategoryUpdated={handleCategoryUpdated}
        handleTogglePinCategory={handleTogglePinCategory}
        // Transaction Modals
        isTransactionModalOpen={isTransactionModalOpen}
        editingTransaction={editingTransaction}
        handleTransactionCreated={handleTransactionCreated}
        handleCloseTransactionModal={handleCloseTransactionModal}
        handleTransactionUpdated={handleTransactionUpdated}
        handleCloseEditTransactionModal={handleCloseEditTransactionModal}
        // Filter Modal
        isFilterModalOpen={isFilterModalOpen}
        filters={filters}
        applyFilters={applyFilters}
        closeFilterModal={closeFilterModal}
        // Confirmation Dialog
        confirmationState={confirmationState}
        closeConfirmationDialog={closeConfirmationDialog}
        // Shared Data
        categories={categories}
      />
    </>
  );
}

function DashboardModals({
  // Category Modals
  isManageCategoriesModalOpen,
  isAddCategoryModalOpen,
  editingCategory,
  categoryError,
  pinnedCategoryIds,
  handleCloseManageCategoriesModal,
  handleOpenAddCategoryModal,
  handleOpenEditCategoryModal,
  handleDeleteCategoryConfirmation,
  handleCategoryCreated,
  handleReturnToManageCategories,
  handleCategoryUpdated,
  handleTogglePinCategory,
  // Transaction Modals
  isTransactionModalOpen,
  editingTransaction,
  handleTransactionCreated,
  handleCloseTransactionModal,
  handleTransactionUpdated,
  handleCloseEditTransactionModal,
  // Filter Modal
  isFilterModalOpen,
  filters,
  applyFilters,
  closeFilterModal,
  // Confirmation Dialog
  confirmationState,
  closeConfirmationDialog,
  // Shared Data
  categories,
}) {
  return (
    <>
      {isManageCategoriesModalOpen && (
        <ManageCategoriesModal
          categories={categories}
          pinnedCategoryIds={pinnedCategoryIds}
          error={categoryError}
          onClose={handleCloseManageCategoriesModal}
          onAddNew={handleOpenAddCategoryModal}
          onEdit={handleOpenEditCategoryModal}
          onDelete={handleDeleteCategoryConfirmation}
          onTogglePin={handleTogglePinCategory}
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

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          categories={categories}
          onTransactionUpdated={handleTransactionUpdated}
          onClose={handleCloseEditTransactionModal}
        />
      )}

      {isTransactionModalOpen && (
        <AddTransactionModal
          categories={categories}
          onTransactionCreated={handleTransactionCreated}
          onClose={handleCloseTransactionModal}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal
          categories={categories}
          currentFilters={filters}
          onApply={applyFilters}
          onClose={closeFilterModal}
        />
      )}

      {confirmationState.isOpen && (
        <ConfirmationDialog
          isOpen={confirmationState.isOpen}
          title={confirmationState.title}
          message={confirmationState.message}
          onConfirm={confirmationState.onConfirm}
          onCancel={closeConfirmationDialog}
        />
      )}
    </>
  );
}

export default DashboardPage;

import { useState, useEffect, useCallback, useRef } from "react";
import * as apiService from "../services/api.service";
import * as formatter from "../utils/format";
import Pagination from "../components/Pagination";
import ActionMenu from "../components/ActionMenu";
import ManageCategoriesModal from "../components/ManageCategoriesModal";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";

import SearchIcon from "../icons/SearchIcon";
import useDebounce from "../hooks/useDebounce";
import FilterListIcon from "../icons/FilterListIcon";
import FilterModal from "../components/FilterModal";

function DashboardPage() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [isTransactionModelOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionError, setTransactionError] = useState({
    id: null,
    message: "",
  });

  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] =
    useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categoryError, setCategoryError] = useState({ id: null, message: "" });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRangeFilter: "",
    categoryFilter: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 1000);
  const searchInputRef = useRef(null);

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
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, debouncedSearchTerm]); // fetchData will only be re-created if any of these changes

  useEffect(() => {
    fetchData();
  }, [fetchData]); // only run useEffect when fetchData changes/recreated

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
    setIsManageCategoriesModalOpen(true);
  }

  function handleCloseManageCategoriesModal() {
    setIsManageCategoriesModalOpen(false);
  }

  function handleCategoryDataRefresh() {
    fetchData();
  }

  // DELETE CATEGORY
  async function handleDeleteCategory(categoryId) {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this category?"
      );
      if (!isConfirmed) {
        return;
      }

      const categoryData = await apiService.deleteCategory(categoryId);
      console.log("Category deleted successfully", categoryData);

      fetchData();
    } catch (error) {
      console.error("Error deleting category:", error.message);
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
  async function handleDeleteTransaction(transactionId) {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (!isConfirmed) {
        return;
      }

      const transactionData = await apiService.deleteTransaction(transactionId);
      console.log("Transaction deleted successfully", transactionData);

      fetchData();
    } catch (error) {
      console.error("Error deleting transaction:", error.message);
      setTransactionError({ id: transactionId, message: error.message });
    }
  }

  return (
    <div>
      <h2>Dashboard Page</h2>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div>
          <h3>Balance: {formatter.formatCurrency(balance)}</h3>

          <button onClick={handleManageCategoriesModalOpen}>
            Manage Categories
          </button>

          {isManageCategoriesModalOpen && (
            <ManageCategoriesModal
              categories={categories}
              error={categoryError}
              onDataRefresh={handleCategoryDataRefresh}
              onDeleteCategory={handleDeleteCategory}
              onClose={handleCloseManageCategoriesModal}
            />
          )}

          <h3>Transactions</h3>
          <button onClick={handleAddTransaction}>Add Transaction</button>
          {isTransactionModelOpen && (
            <AddTransactionModal
              categories={categories}
              onTransactionCreated={handleTransactionCreated}
              onClose={handleCloseTransactionModal}
            />
          )}

          {
            <div>
              <div>
                <label htmlFor="searchInput">Search:</label>
                <input
                  ref={searchInputRef}
                  type="text"
                  id="searchInput"
                  placeholder="Search by description or category"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <SearchIcon
                  className="h-5 w-5"
                  style={{ width: "24px", height: "24px" }}
                />
              </div>
              <button onClick={handleFilterModalOpen}>
                <div>
                  <FilterListIcon className="h-5 w-5" />
                  <span>Filters</span>
                </div>
              </button>
            </div>
          }

          {isFilterModalOpen && (
            <FilterModal
              categories={categories}
              currentFilters={filters}
              onApply={handleFilterApplied}
              onClose={handleFilterModalClose}
            />
          )}

          {transactions.length === 0 && (
            <p>No transactions yet. Click "Add Transaction" to get started!</p>
          )}

          {transactions.length > 0 && (
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.id}>
                  <div>
                    <div>
                      <div>{transaction.description}</div>
                      <div>{formatter.formatDate(transaction.date)}</div>
                      <div>{transaction.category.name}</div>
                      <div>
                        {formatter.formatCurrency(
                          transaction.type === "EXPENSE"
                            ? -transaction.amount
                            : transaction.amount
                        )}
                      </div>
                    </div>
                    {
                      <div>
                        <ActionMenu
                          onDelete={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                          onEdit={() => handleEditTransaction(transaction)}
                        />

                        {editingTransaction?.id === transaction.id && (
                          <EditTransactionModal
                            transaction={transaction}
                            categories={categories}
                            onTransactionUpdated={handleTransactionUpdated}
                            onClose={handleCloseEditTransactionModal}
                          />
                        )}
                      </div>
                    }
                    {transactionError.id === transaction.id && (
                      <p style={{ color: "red" }}>{transactionError.message}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

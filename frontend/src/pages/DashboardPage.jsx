import { useState, useEffect, useCallback } from "react";
import * as apiService from "../services/api.service";
import Pagination from "../components/Pagination";
import AddTransactionModal from "../components/AddTransactionModal";

function DashboardPage() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Wrap fetchData in useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesData, transactionsData] = await Promise.all([
        apiService.getCategories(),
        apiService.getTransactions(currentPage),
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
  }, [currentPage]); // fetchData will only be re-created if currentPage changes

  useEffect(() => {
    fetchData();
  }, [fetchData]); // only run useEffect when fetchData changes/recreated (that is when currentPage changes)

  function handlePageChange(newPageNumber) {
    setCurrentPage(newPageNumber);
  }

  function handleAddTransaction() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleTransactionCreated() {
    setIsModalOpen(false);
    // By setting the page to 1, we trigger the useEffect to run again automatically.
    // If we are already on page 1, we can call fetchData directly.
    if (currentPage === 1) {
      fetchData();
    } else {
      setCurrentPage(1);
    }
  }

  return (
    <div>
      <h2>Dashboard Page</h2>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <div>
          <h3>Balance: {balance}</h3>

          <h3>Categories</h3>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>

          <h3>Transactions</h3>
          <button onClick={handleAddTransaction}>Add Transaction</button>
          {isModalOpen && (
            <AddTransactionModal
              categories={categories}
              onTransactionCreated={handleTransactionCreated}
              onClose={handleCloseModal}
            />
          )}

          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                {transaction.description} - {transaction.amount}
              </li>
            ))}
          </ul>

          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

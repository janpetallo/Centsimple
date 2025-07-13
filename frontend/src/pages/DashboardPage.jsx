import { useState, useEffect, useMemo } from "react";
import * as apiService from "../services/api.service";

function DashboardPage() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, transactionsData] = await Promise.all([
          apiService.getCategories(),
          apiService.getTransactions(),
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
    }

    fetchData();
  }, []); // run once on first mount


  return (
    <div>
      <h2>Dashboard Page</h2>

      {loading ? (
        <p>Loading...</p>
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
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                {transaction.description} - {transaction.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

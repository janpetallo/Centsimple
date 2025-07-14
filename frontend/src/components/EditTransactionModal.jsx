import { useState } from "react";
import * as apiService from "../services/api.service";

function EditTransactionModal({ transaction, categories, onTransactionUpdated, onClose }) {
  const [formData, setFormData] = useState({
    amount: transaction.amount,
    description: transaction.description,
    date: new Date(transaction.date).toISOString().split("T")[0],
    type: transaction.type,
    categoryId: transaction.categoryId,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const transactionData = await apiService.updateTransaction(
        transaction.id,
        formData
      );
      onTransactionUpdated();
      console.log("Transaction updated successfully", transactionData);
    } catch (error) {
      console.error("Error updating a transaction", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Edit Transaction</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="type">Type:</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            -- Select a type --
          </option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <label htmlFor="category">Category:</label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            -- Select a category --
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="button" onClick={onClose}>
          Cancel
        </button>

        <button type="submit" disabled={loading}>
          Update
        </button>
      </form>
    </div>
  );
}

export default EditTransactionModal;

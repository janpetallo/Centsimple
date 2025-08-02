import { useState } from 'react';
import * as apiService from '../services/api.service';
import Modal from './Modal';
import SegmentedControl from './SegmentedControl';

function AddTransactionModal({ categories, onTransactionCreated, onClose }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: '',
    type: '',
    categoryId: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const transactionTypeOptions = [
    { label: 'Expense', value: 'EXPENSE' },
    { label: 'Income', value: 'INCOME' },
  ];

  function handleTypeChange(newType) {
    setFormData({
      ...formData,
      type: newType,
    });
  }

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
      const transactionData = await apiService.createTransaction(formData);
      onTransactionCreated();
      console.log('Transaction created successfully', transactionData);
    } catch (error) {
      console.error('Error creating a new transaction', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="New Transaction" onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label
          htmlFor="amount"
          className="text-label-large text-on-surface-variant"
        >
          Amount
        </label>
        <input
          className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
          type="number"
          id="amount"
          name="amount"
          step="0.01"
          placeholder="0.00"
          onChange={handleChange}
          required
        />

        <label
          htmlFor="description"
          className="text-label-large text-on-surface-variant"
        >
          Description
        </label>
        <input
          className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
          type="text"
          id="description"
          name="description"
          onChange={handleChange}
          required
        />

        <label
          htmlFor="date"
          className="text-label-large text-on-surface-variant"
        >
          Date
        </label>
        <input
          className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
          type="date"
          id="date"
          name="date"
          onChange={handleChange}
          required
        />

        <label className="text-label-large text-on-surface-variant">Type</label>
        <div>
          <SegmentedControl
            options={transactionTypeOptions}
            value={formData.type}
            onChange={handleTypeChange}
          />
        </div>

        <label
          htmlFor="category"
          className="text-label-large text-on-surface-variant"
        >
          Category
        </label>
        <select
          className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
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

        {error && (
          <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
            {error}
          </p>
        )}

        <div className="mt-6 flex grow flex-col items-center gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border-outline text-label-large hover:bg-surface-container w-full cursor-pointer rounded-full border px-6 py-2 transition-colors sm:w-fit sm:border-none"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary text-label-large inline-block w-full cursor-pointer rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg sm:w-fit"
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddTransactionModal;

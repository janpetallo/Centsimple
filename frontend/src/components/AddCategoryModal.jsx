import { useState } from 'react';
import * as apiService from '../services/api.service';
import Modal from './Modal';

function AddCategoryModel({ onCategoryCreated, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
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
      const categoryData = await apiService.createCategory(formData);
      onCategoryCreated();
      console.log('Category created successfully', categoryData);
    } catch (error) {
      console.error('Error creating a new category', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="New Category" onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label
          htmlFor="name"
          className="text-label-large text-on-surface-variant"
        >
          Name
        </label>
        <input
          className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          required
        />

        {error && (
          <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-end grow">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-fit border sm:border-none border-outline text-label-large cursor-pointer hover:bg-surface-container rounded-full px-6 py-2 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary w-full sm:w-fit text-on-primary text-label-large inline-block cursor-pointer rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddCategoryModel;

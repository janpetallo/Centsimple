import { useState } from 'react';
import * as apiService from '../services/api.service';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

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
            className="bg-primary text-on-primary text-label-large inline-block w-full cursor-pointer rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:hover:scale-100 sm:w-fit"
          >
            {loading ? (
              <div className="flex grow items-center justify-center">
                <LoadingSpinner className="text-on-primary-container bg-primary-container h-6 w-6 rounded-full" />
              </div>
            ) : (
              'Add'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddCategoryModel;

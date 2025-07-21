import { useState } from 'react';
import * as apiService from '../services/api.service';

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
    <div>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          required
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="button" onClick={onClose}>
          Cancel
        </button>

        <button type="submit" disabled={loading}>
          Add Category
        </button>
      </form>
    </div>
  );
}

export default AddCategoryModel;

import { useState } from "react";
import * as apiService from "../services/api.service";

function EditCategoryModal({ category, onCategoryUpdated, onClose }) {
  const [formData, setFormData] = useState({
    name: category.name,
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
      const categoryData = await apiService.updateCategory(category.id, formData);
      onCategoryUpdated();
      console.log("Category updated successfully", categoryData);
    } catch (error) {
      console.error("Error updating a category", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Edit Category</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="button" onClick={onClose}>
          Cancel
        </button>

        <button type="submit" disabled={loading}>
          Update Category
        </button>
      </form>
    </div>
  );
}

export default EditCategoryModal;

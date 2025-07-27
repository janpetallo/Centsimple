import { useState } from 'react';
import * as apiService from '../services/api.service';

export function useCategoryManager(onSuccess) {
  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] =
    useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryError, setCategoryError] = useState({ id: null, message: '' });

  function handleManageCategoriesModalOpen() {
    setCategoryError({ id: null, message: '' });
    setIsManageCategoriesModalOpen(true);
  }

  function handleCloseManageCategoriesModal() {
    setCategoryError({ id: null, message: '' });
    setIsManageCategoriesModalOpen(false);
  }

  function handleOpenAddCategoryModal() {
    setIsManageCategoriesModalOpen(false);
    setIsAddCategoryModalOpen(true);
  }

  function handleOpenEditCategoryModal(category) {
    setIsManageCategoriesModalOpen(false);
    setEditingCategory(category);
  }

  function handleReturnToManageCategories() {
    setIsAddCategoryModalOpen(false);
    setEditingCategory(null);
    handleManageCategoriesModalOpen();
  }

  function handleCategoryCreated() {
    setIsAddCategoryModalOpen(false);
    setIsManageCategoriesModalOpen(true);
    onSuccess(); // Call the callback to refetch data
  }

  function handleCategoryUpdated() {
    setEditingCategory(null);
    setIsManageCategoriesModalOpen(true);
    onSuccess(); // Call the callback to refetch data
  }

  async function handleDeleteCategory(categoryId) {
    setCategoryError({ id: null, message: '' });
    try {
      await apiService.deleteCategory(categoryId);
      onSuccess(); // Call the callback to refetch data
      return true; // Indicate success
    } catch (error) {
      console.error('Error deleting category:', error.message);
      setCategoryError({
        id: categoryId,
        message:
          error.message || 'Could not delete category. Please try again.',
      });
      return false; // Indicate failure
    }
  }

  return {
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
  };
}

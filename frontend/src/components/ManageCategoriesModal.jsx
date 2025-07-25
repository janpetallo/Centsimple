import { useState } from 'react';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import ActionMenu from './ActionMenu';
import Modal from './Modal';

function ManageCategoriesModal({
  categories,
  error,
  onDataRefresh,
  onDeleteCategory,
  onClose,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // CREATE CATEGORY
  function handleAddCategory() {
    setIsAddModalOpen(true);
  }

  function handleCloseCategoryModal() {
    setIsAddModalOpen(false);
  }

  function handleCategoryCreated() {
    setIsAddModalOpen(false);
    onDataRefresh();
  }

  // EDIT CATEGORY
  function handleEditCategory(category) {
    setEditingCategory(category);
  }

  function handleCloseEditCategoryModal() {
    setEditingCategory(null);
  }

  function handleCategoryUpdated() {
    setEditingCategory(null);
    onDataRefresh();
  }

  return (
    <Modal title="Manage Categories" onClose={onClose}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-title-large">Categories</h3>
        <button
          onClick={handleAddCategory}
          className="border-outline text-primary text-label-large cursor-pointer rounded-full border px-4 py-2 transition-all duration-300 hover:scale-105"
        >
          New Category
        </button>
      </div>
      {isAddModalOpen && (
        <AddCategoryModal
          onCategoryCreated={handleCategoryCreated}
          onClose={handleCloseCategoryModal}
        />
      )}
      <ul className="mt-4 flex flex-col gap-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="bg-surface-container border-outline/10 hover:bg-surface-variant hover:text-on-surface-variant flex items-center justify-between rounded-xl border p-4 transition-colors"
          >
            <div>{category.name}</div>

            {category.userId && (
              <div>
                <ActionMenu
                  onDelete={() => onDeleteCategory(category.id)}
                  onEdit={() => handleEditCategory(category)}
                />
              </div>
            )}

            {editingCategory?.id === category.id && (
              <EditCategoryModal
                category={category}
                onCategoryUpdated={handleCategoryUpdated}
                onClose={handleCloseEditCategoryModal}
              />
            )}

            {error.id === category.id && (
              <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
                {error.message}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex grow flex-col items-center gap-4 sm:flex-row sm:justify-end">
        <button
          onClick={onClose}
          className="bg-primary text-on-primary text-label-large inline-block w-full cursor-pointer rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg sm:w-fit"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}

export default ManageCategoriesModal;

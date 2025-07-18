import { useState } from "react";
import AddCategoryModal from "../components/AddCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import ActionMenu from "../components/ActionMenu";

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
    <div>
      <h3>Categories</h3>
      <button onClick={handleAddCategory}>Add Category</button>
      {isAddModalOpen && (
        <AddCategoryModal
          onCategoryCreated={handleCategoryCreated}
          onClose={handleCloseCategoryModal}
        />
      )}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {
              <div>
                {category.name}

                {category.userId && (
                  <div>
                    <ActionMenu
                      onDelete={() => onDeleteCategory(category.id)}
                      onEdit={() => handleEditCategory(category)}
                    />

                    {editingCategory?.id === category.id && (
                      <EditCategoryModal
                        category={category}
                        onCategoryUpdated={handleCategoryUpdated}
                        onClose={handleCloseEditCategoryModal}
                      />
                    )}
                  </div>
                )}

                {error.id === category.id && (
                  <p style={{ color: "red" }}>{error.message}</p>
                )}
              </div>
            }
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Done</button>
    </div>
  );
}

export default ManageCategoriesModal;

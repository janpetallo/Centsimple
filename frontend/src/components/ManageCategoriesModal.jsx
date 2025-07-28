import ActionMenu from './ActionMenu';
import Modal from './Modal';
import AddIcon from '../icons/AddIcon';

function ManageCategoriesModal({
  categories,
  error,
  onClose,
  onAddNew,
  onEdit,
  onDelete,
}) {
  return (
    <Modal title="Manage Categories" onClose={onClose}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-title-large">Categories</h3>
        <button
          onClick={onAddNew}
          className="border-outline text-primary text-label-large flex cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 hover:scale-105"
        >
          <AddIcon className="h-5 w-5" />
          New Category
        </button>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="bg-surface-container border-outline/10 hover:bg-surface-variant hover:text-on-surface-variant flex min-h-13 items-center justify-between rounded-xl border p-2 transition-colors"
          >
            <div>
              <p>{category.name}</p>{' '}
              {error.id === category.id && (
                <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
                  {error.message}
                </p>
              )}
            </div>

            {!category.userId && (
              <p className="bg-tertiary text-on-tertiary rounded-full px-2 py-1 text-xs">
                Default
              </p>
            )}

            {category.userId && (
              <ActionMenu
                onDelete={() => onDelete(category.id)}
                onEdit={() => onEdit(category)}
              />
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

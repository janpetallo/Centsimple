import { useState, useRef } from 'react';
import MoreVertIcon from '../icons/MoreVertIcon';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import useOnClickOutside from '../hooks/useOnClickOutside';

function ActionMenu({ onDelete, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Call the hook, passing it the ref and a function to close the menu
  useOnClickOutside(menuRef, () => setIsOpen(false));

  function handleMenuClick() {
    setIsOpen(!isOpen);
  }

  function handleEditClick() {
    onEdit();
    setIsOpen(false);
  }

  function handleDeleteClick() {
    onDelete();
    setIsOpen(false);
  }

  return (
    // Attach the ref to the parent div
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleMenuClick}
        className="hover:bg-surface-container cursor-pointer rounded-full p-1 transition-colors"
      >
        <MoreVertIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="bg-surface absolute right-0 z-10 rounded-lg shadow-lg">
          <button
            onClick={handleEditClick}
            className="hover:bg-surface-container flex w-full cursor-pointer items-center justify-start gap-1 rounded-t-lg pl-4 pr-10 py-2 whitespace-nowrap transition-colors"
          >
            <EditIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="hover:bg-error-container hover:text-on-error-container flex w-full cursor-pointer items-center justify-start gap-1 rounded-b-lg pl-4 pr-10 py-2 whitespace-nowrap transition-colors"
          >
            <DeleteIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;

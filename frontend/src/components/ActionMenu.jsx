import { useState, useRef } from 'react';
import MoreVertIcon from '../icons/MoreVertIcon';
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
        <div className="bg-surface absolute right-0 z-10 w-28 rounded-lg shadow-lg">
          <button
            onClick={handleEditClick}
            className="hover:bg-surface-container flex w-full cursor-pointer justify-start rounded-t-lg px-4 py-2 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="hover:bg-error-container hover:text-on-error-container flex w-full cursor-pointer justify-start rounded-b-lg px-4 py-2 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;

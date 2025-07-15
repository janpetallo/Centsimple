import { useState } from "react";

function ActionMenu({ onDelete, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleMenuClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <button onClick={handleMenuClick}>⋮</button>

      {isOpen && (
        <div>
          <button onClick={onDelete}>Delete</button>
          <button onClick={onEdit}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;

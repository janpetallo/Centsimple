import { useState } from "react";
import MoreVertIcon from "../icons/MoreVertIcon";

function ActionMenu({ onDelete, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleMenuClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <button onClick={handleMenuClick}>
        <MoreVertIcon className="h-5 w-5" />
      </button>

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

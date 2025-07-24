import { useEffect } from 'react';
import BackIcon from '../icons/BackIcon';

function Modal({ title, onClose, children }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose}>
      <div
        className="bg-surface text-on-surface flex h-full w-full flex-col shadow-xl sm:mx-auto sm:mt-50 sm:h-auto sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-start gap-2 p-4">
          <button
            onClick={onClose}
            className="hover:bg-surface-container rounded-full p-2"
          >
            <BackIcon className="h-6 w-6" />
          </button>
          <h2 className="text-title-large">{title}</h2>
        </div>

        <div className="grow overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;

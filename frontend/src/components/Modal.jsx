import { useState, useEffect } from 'react';
import BackIcon from '../icons/BackIcon';

function Modal({ title, onClose, isDialog = false, children }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger the animation shortly after the component mounts
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 50); // A small delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className={`bg-surface text-on-surface flex flex-col shadow-xl transition-all duration-300 ease-in-out ${
          isAnimating
            ? 'translate-x-0 opacity-100 sm:scale-100'
            : 'translate-x-full opacity-0 sm:translate-x-0 sm:scale-80'
        } ${
          isDialog
            ? 'mx-4 max-w-xs rounded-2xl'
            : 'h-full w-full sm:h-auto sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-start gap-2 p-4 ${isDialog ? 'p-6' : ''}`}
        >
          <button
            onClick={onClose}
            className={`hover:bg-surface-container cursor-pointer rounded-full p-2 transition-colors ${
              isDialog ? 'hidden' : ''
            }`}
          >
            <BackIcon className="h-6 w-6" />
          </button>
          <h2 className="text-title-large">{title}</h2>
        </div>

        <div className="grow overflow-y-auto p-6 pt-2">{children}</div>
      </div>
    </div>
  );
}

export default Modal;

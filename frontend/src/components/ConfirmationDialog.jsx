import Modal from './Modal';
function ConfirmationDialog({ isOpen, title, message, onConfirm, onCancel }) {
  return (
    isOpen && (
      <Modal title={title} onClose={onCancel} isDialog={true}>
        <p className="text-on-surface-variant">{message}</p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="text-primary text-label-large hover:bg-primary-container hover:text-on-primary-container w-fit rounded-full px-6 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-primary text-label-large hover:bg-primary-container hover:text-on-primary-container w-fit rounded-full px-6 py-2"
          >
            Confirm
          </button>
        </div>
      </Modal>
    )
  );
}

export default ConfirmationDialog;

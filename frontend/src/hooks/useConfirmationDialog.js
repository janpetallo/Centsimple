import { useState } from 'react';

export function useConfirmationDialog() {
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const askForConfirmation = ({ title, message, onConfirm }) => {
    setConfirmationState({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        await onConfirm();
        closeConfirmationDialog();
      },
    });
  };

  const closeConfirmationDialog = () => {
    setConfirmationState({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
    });
  };

  return {
    confirmationState,
    askForConfirmation,
    closeConfirmationDialog,
  };
}

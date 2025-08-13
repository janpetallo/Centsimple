import { useState } from 'react';

export function useSavingsManager({ onSuccess }) {
  const [isAddSavingModalOpen, setIsAddSavingModalOpen] = useState(false);

  function handleOpenAddSavingModal() {
    setIsAddSavingModalOpen(true);
  }

  function handleCloseAddSavingModal() {
    setIsAddSavingModalOpen(false);
  }

  function handleSavingCreated() {
    handleCloseAddSavingModal();
    onSuccess();
  }

  return {
    isAddSavingModalOpen,
    handleOpenAddSavingModal,
    handleCloseAddSavingModal,
    handleSavingCreated,
  };
}

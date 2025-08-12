import { useState } from 'react';

export function useSavingsManager() {
  const [isAddSavingModalOpen, setIsAddSavingModalOpen] = useState(false);

  function handleOpenAddSavingModal() {
    setIsAddSavingModalOpen(true);
  }

  function handleCloseAddSavingModal() {
    setIsAddSavingModalOpen(false);
  }

  return {
    isAddSavingModalOpen,
    handleOpenAddSavingModal,
    handleCloseAddSavingModal,
  };
}

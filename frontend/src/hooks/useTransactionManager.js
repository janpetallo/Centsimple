import { useState } from 'react';
import * as apiService from '../services/api.service';

export function useTransactionManager(onSuccess) {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionError, setTransactionError] = useState({
    id: null,
    message: '',
  });

  function handleAddTransaction() {
    setIsTransactionModalOpen(true);
  }

  function handleCloseTransactionModal() {
    setIsTransactionModalOpen(false);
  }

  function handleTransactionCreated() {
    setIsTransactionModalOpen(false);
    // We call the success callback and pass a flag
    // to indicate a page reset might be needed.
    onSuccess({ shouldResetPage: true });
  }

  function handleEditTransaction(transaction) {
    setEditingTransaction(transaction);
  }

  function handleCloseEditTransactionModal() {
    setEditingTransaction(null);
  }

  function handleTransactionUpdated() {
    setEditingTransaction(null);
    onSuccess();
  }

  async function handleDeleteTransaction(transactionId) {
    setTransactionError({ id: null, message: '' });
    try {
      await apiService.deleteTransaction(transactionId);
      onSuccess();
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
      setTransactionError({
        id: transactionId,
        message:
          error.message || 'Could not delete transaction. Please try again.',
      });
    }
  }

  return {
    isTransactionModalOpen,
    editingTransaction,
    transactionError,
    handleAddTransaction,
    handleCloseTransactionModal,
    handleTransactionCreated,
    handleEditTransaction,
    handleCloseEditTransactionModal,
    handleTransactionUpdated,
    handleDeleteTransaction,
  };
}

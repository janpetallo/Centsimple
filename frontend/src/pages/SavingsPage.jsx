import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavingsManager } from '../hooks/useSavingsManager';
import * as apiService from '../services/api.service';
import * as formatter from '../utils/format';
import BackIcon from '../icons/BackIcon';
import AddIcon from '../icons/AddIcon';
import LoadingSpinner from '../components/LoadingSpinner';
import AddSavingModal from '../components/AddSavingModal';

function SavingsPage() {
  const [totalSavingsBalance, setTotalSavingsBalance] = useState(0);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Wrap the data fetching logic in useCallback
  const fetchSavingsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const savingsData = await apiService.getSavings();
      setTotalSavingsBalance(savingsData.totalSavingsBalance);
      setSavings(savingsData.savingsWithTotal);
    } catch (error) {
      console.error('Error fetching savings data:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []); // Created only once and will never be recreated

  // Call fetchData on initial mount
  useEffect(() => {
    fetchSavingsData();
  }, [fetchSavingsData]); // Since fetchSavingsData() will not be recreated, this only runs on the initial mount

  function handleSuccess() {
    fetchSavingsData();
  }

  const {
    isAddSavingModalOpen,
    handleOpenAddSavingModal,
    handleCloseAddSavingModal,
    handleSavingCreated,
  } = useSavingsManager({ onSuccess: handleSuccess });

  const navigate = useNavigate();

  function handleBackButtonClick() {
    navigate('/dashboard');
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-start gap-2">
          <button
            onClick={handleBackButtonClick}
            className="hover:bg-surface-container cursor-pointer rounded-full p-2 transition-colors"
          >
            <BackIcon className="h-6 w-6" />
          </button>
          <h2 className="text-headline-medium text-left">Savings</h2>
        </div>

        {/* Create Saving Button (xlarge screens)*/}
        <div className="flex grow flex-col gap-4 sm:flex-row md:grow-0">
          <button
            onClick={handleOpenAddSavingModal}
            className="bg-primary border-primary text-label-large text-on-primary hidden cursor-pointer items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg xl:inline-flex"
          >
            <AddIcon className="h-5 w-5" />
            <span>Create Saving</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex grow items-center justify-center">
          <LoadingSpinner className="text-on-primary-container bg-primary-container h-16 w-16 rounded-full" />
        </div>
      ) : (
        <div>
          {savings ? (
            <div>
              <div className="bg-surface-container flex flex-col items-start justify-between gap-1 rounded-2xl p-6 shadow-sm">
                <p className="text-on-surface-variant text-sm">Total Savings</p>
                <p className="text-headline-medium text-on-surface">
                  {formatter.formatCurrency(totalSavingsBalance)}
                </p>
              </div>
              {savings.length > 0 ? (
                <ul className="mt-4 flex flex-col gap-2">
                  {savings.map((saving) => (
                    // Can make a separate component for this like TransactionListItem
                    <li
                      key={saving.id}
                      className="bg-surface-container border-outline/10 hover:bg-surface-variant hover:text-on-surface-variant rounded-xl border p-4 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex grow flex-col gap-4">
                          <p className="font-medium">{saving.name}</p>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-4">
                          <p className="text-label-large p-1 text-right md:w-28">
                            {formatter.formatCurrency(saving.currentBalance)}
                          </p>

                          {/* can replace when update and delete functionality are implemented */}
                          {/* <ActionMenu
                            onDelete={() => onDelete(transaction.id)}
                            onEdit={() => onEdit(transaction)}
                          /> */}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="bg-surface-container border-outline/10 mt-4 rounded-xl border p-8">
                  <span className="xl:hidden">
                    No saving goals or funds yet. Click the "+" button to get
                    started!
                  </span>
                  {/* This span is HIDDEN by default and only appears on medium screens and up */}
                  <span className="hidden xl:inline">
                    No saving goals or funds yet. Click "Create Saving" to get
                    started!
                  </span>
                </p>
              )}

              {/* Create Saving Button (small screens)*/}
              <button
                onClick={handleOpenAddSavingModal}
                className="bg-primary text-on-primary fixed right-8 bottom-8 cursor-pointer rounded-3xl px-4 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg xl:hidden"
              >
                <AddIcon className="h-12 w-12 md:h-16 md:w-16" />
              </button>
            </div>
          ) : (
            <p className="bg-surface-container border-outline/10 mt-4 rounded-xl border p-8">
              No savings data available
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
          {error}
        </p>
      )}

      {isAddSavingModalOpen && (
        <AddSavingModal
          onSavingCreated={handleSavingCreated}
          onClose={handleCloseAddSavingModal}
        />
      )}
    </>
  );
}

export default SavingsPage;

import { useState } from 'react';
import * as apiService from '../services/api.service';
import Modal from './Modal';
import SegmentedControl from './SegmentedControl';
import LoadingSpinner from './LoadingSpinner';

function AddSavingModal({ onSavingCreated, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    initialBalance: '',
    targetAmount: '',
    targetDate: '',
    isTransfer: false,
  });

  const [savingType, setSavingType] = useState('Fund');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const transferTypeOptions = [
    { label: 'External Account', value: false },
    { label: 'Centsimple Balance', value: true },
  ];

  function handleTransferTypeChange(newType) {
    setFormData({
      ...formData,
      isTransfer: newType,
    });
  }

  const savingTypeOptions = [
    { label: 'Fund', value: 'Fund' },
    { label: 'Goal', value: 'Goal' },
  ];

  function handleSavingTypeChange(newType) {
    setSavingType(newType);
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    const submissionData = { ...formData };

    // Clean up data so backend can handle it
    if (formData.initialBalance === '') {
      submissionData.initialBalance = 0;
    }

    if (savingType === 'Fund') {
      submissionData.targetAmount = null;
      submissionData.targetDate = null;
    }

    try {
      const savingData = await apiService.createSaving(submissionData);
      onSavingCreated(savingData);
      console.log('Saving created successfully:', savingData);
    } catch (error) {
      console.error('Error creating a new savings:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="New Savings" onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label
          htmlFor="name"
          className="text-label-large text-on-surface-variant"
        >
          Name
        </label>
        <input
          className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          required
        />

        <label
          htmlFor="initialBalance"
          className="text-label-large text-on-surface-variant"
        >
          Initial Balance
        </label>
        <input
          className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
          type="number"
          id="initialBalance"
          name="initialBalance"
          step="0.01"
          placeholder="0.00"
          onChange={handleChange}
        />

        {formData.initialBalance > 0 && (
          <div className="flex flex-col gap-4">
            <label className="text-label-large text-on-surface-variant">
              Initial Balance Source
            </label>

            <SegmentedControl
              options={transferTypeOptions}
              value={formData.isTransfer}
              onChange={handleTransferTypeChange}
            />

            {formData.isTransfer ? (
              <div className="text-on-surface-variant text-center text-sm">
                <p>
                  Initial balance will be deducted from your Centsimple balance.
                </p>
              </div>
            ) : (
              <div className="text-on-surface-variant text-center text-sm">
                <p>
                  Initial balance coming from external account not tracked in
                  Centsimple.
                </p>
              </div>
            )}
          </div>
        )}

        <label className="text-label-large text-on-surface-variant">
          Saving Type
        </label>
        <SegmentedControl
          options={savingTypeOptions}
          value={savingType}
          onChange={handleSavingTypeChange}
        />

        {savingType === 'Goal' ? (
          <>
            <div className="text-on-surface-variant text-center text-sm">
              <p>Set a target amount and date for a specific goal.</p>
            </div>

            <label
              htmlFor="targetAmount"
              className="text-label-large text-on-surface-variant"
            >
              Target Amount
            </label>
            <input
              className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
              type="number"
              id="targetAmount"
              name="targetAmount"
              step="0.01"
              placeholder="0.00"
              onChange={handleChange}
              required
            />

            <label
              htmlFor="targetDate"
              className="text-label-large text-on-surface-variant"
            >
              Target Date
            </label>
            <input
              className="bg-surface-variant text-on-surface-variant border-outline focus:ring-inverse-surface rounded-2xl border px-4 py-2 focus:ring-1 focus:outline-none"
              type="date"
              id="targetDate"
              name="targetDate"
              onChange={handleChange}
              required
            />
          </>
        ) : (
          <div className="text-on-surface-variant text-center text-sm">
            <p>Create a general-purpose fund, like an emergency fund.</p>
          </div>
        )}

        {error && (
          <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
            {error}
          </p>
        )}

        <div className="mt-6 flex grow flex-col items-center gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border-outline text-label-large hover:bg-surface-container w-full cursor-pointer rounded-full border px-6 py-2 transition-colors sm:w-fit sm:border-none"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary text-label-large inline-block w-full cursor-pointer rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:hover:scale-100 sm:w-fit"
          >
            {loading ? (
              <div className="flex grow items-center justify-center">
                <LoadingSpinner className="text-on-primary-container bg-primary-container h-6 w-6 rounded-full" />
              </div>
            ) : (
              'Add'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddSavingModal;

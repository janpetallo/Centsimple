import { useState } from 'react';
import * as apiService from '../services/api.service';
import Modal from './Modal';
import SegmentedControl from './SegmentedControl';
import LoadingSpinner from './LoadingSpinner';

function AddSavingModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    initialBalance: '',
    targetAmount: '',
    targetDate: '',
    isTransfer: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Modal title="New Savings" onClose={onClose}>
      Placeholder
    </Modal>
  );
}

export default AddSavingModal;

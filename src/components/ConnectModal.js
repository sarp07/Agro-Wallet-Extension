import React, { useContext } from 'react';
import { WalletContext } from '../context/WalletContext';

const ApprovalModal = ({ isOpen, onClose, onApprove, onRejected }) => {
    if (!isOpen) return null;
  const { setConnected } = useContext(WalletContext);

  const handleApprove = () => {
    setConnected(true);
    onApprove();
    onClose();
  };

  const handleReject = () => {
    setConnected(false);
    onRejected();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Connect to the dApp</h2>
      <p>Do you want to connect your wallet to this dApp?</p>
      <button onClick={handleApprove}>Approve</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
};

export default ApprovalModal;
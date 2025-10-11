import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useTransferNFT } from '../hooks/useTransferNFT';
import { handleBlockchainError } from '../lib/errorHandler';

interface TransferNFTProps {
  tokenId: number;
  onTransferComplete?: () => void;
}

export default function TransferNFT({ tokenId, onTransferComplete }: TransferNFTProps) {
  const { address } = useAccount();
  const { transferNFT, isPending, isConfirming, isConfirmed, error } = useTransferNFT();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  const handleTransfer = async () => {
    if (!address || !recipientAddress.trim()) {
      setTransferError('Please enter a recipient address');
      return;
    }

    // Basic address validation
    if (!recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
      setTransferError('Please enter a valid Ethereum address');
      return;
    }

    setTransferError(null);

    try {
      await transferNFT(address, recipientAddress.trim(), tokenId);
      
      if (onTransferComplete) {
        setTimeout(() => {
          onTransferComplete();
        }, 2000);
      }
    } catch (err) {
      const appError = handleBlockchainError(err, 'transferNFT');
      setTransferError(appError.message);
    }
  };

  if (isConfirmed) {
    return (
      <div className="transfer-success">
        <div className="success-icon">✅</div>
        <p>NFT transferred successfully!</p>
        <p className="success-details">
          Web3Twin #{tokenId} has been sent to {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
        </p>
      </div>
    );
  }

  return (
    <div className="transfer-nft">
      <button 
        onClick={() => setShowTransferForm(!showTransferForm)}
        className="transfer-toggle-button"
      >
        {showTransferForm ? 'Cancel Transfer' : 'Transfer NFT'}
      </button>

      {showTransferForm && (
        <div className="transfer-form">
          <h4>Transfer Web3Twin #{tokenId}</h4>
          
          <div className="input-group">
            <label htmlFor="recipient">Recipient Address:</label>
            <input
              id="recipient"
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="address-input"
              disabled={isPending || isConfirming}
            />
          </div>

          {transferError && (
            <div className="error-message">
              {transferError}
            </div>
          )}

          {error && (
            <div className="error-message">
              Transfer failed: {error.message}
            </div>
          )}

          <div className="transfer-actions">
            <button 
              onClick={handleTransfer}
              className="transfer-button"
              disabled={isPending || isConfirming || !recipientAddress.trim()}
            >
              {isPending || isConfirming 
                ? 'Transferring...' 
                : 'Transfer NFT'
              }
            </button>
            
            <button 
              onClick={() => {
                setShowTransferForm(false);
                setRecipientAddress('');
                setTransferError(null);
              }}
              className="cancel-button"
              disabled={isPending || isConfirming}
            >
              Cancel
            </button>
          </div>

          <div className="transfer-warning">
            <p>⚠️ <strong>Warning:</strong> Once transferred, you will lose ownership of this NFT.</p>
          </div>
        </div>
      )}
    </div>
  );
}

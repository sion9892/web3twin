interface NFTTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: () => void;
  mintedTokenId: number | null;
  address: string | undefined;
  isTransferPending: boolean;
  isTransferConfirming: boolean;
  isTransferConfirmed: boolean;
  transferring: boolean;
}

export default function NFTTransferModal({
  isOpen,
  onClose,
  onTransfer,
  mintedTokenId,
  address,
  isTransferPending,
  isTransferConfirming,
  isTransferConfirmed,
  transferring,
}: NFTTransferModalProps) {
  if (!isOpen || !mintedTokenId || !address) return null;

  const canClose = !transferring && !isTransferPending && !isTransferConfirming;

  return (
    <div className="modal-overlay" onClick={() => canClose && onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <button 
          className="modal-close"
          onClick={onClose}
          disabled={!canClose}
        >
          ✕
        </button>
        
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
          Transfer NFT to Your Smart Wallet?
        </h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ marginBottom: '0.75rem', color: '#666' }}>
            Would you like to transfer your newly minted NFT to your connected Base Smart Wallet?
          </p>
          <div style={{ 
            background: '#f5f3ff', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
              NFT Details:
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
              Token ID: <strong>{mintedTokenId}</strong>
            </p>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#666' }}>
              To Address: <strong>{address.slice(0, 6)}...{address.slice(-4)}</strong>
            </p>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            <strong>Note:</strong> This will require an additional transaction with gas fees.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <button
            onClick={onTransfer}
            className="primary-button"
            disabled={transferring || isTransferPending || isTransferConfirming}
            style={{ width: '100%' }}
          >
            {isTransferPending 
              ? '💳 Check Your Wallet...' 
              : isTransferConfirming 
              ? '⏳ Transferring...' 
              : isTransferConfirmed
              ? '✅ Transfer Complete!'
              : 'Transfer to Smart Wallet'
            }
          </button>
          <button
            onClick={onClose}
            className="secondary-button"
            disabled={transferring || isTransferPending || isTransferConfirming}
            style={{ width: '100%' }}
          >
            Keep in Current Wallet
          </button>
        </div>
        
        {(isTransferPending || isTransferConfirming) && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              {isTransferPending && 'Waiting for wallet confirmation...'}
              {isTransferConfirming && 'Confirming transfer on blockchain...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


import { useState, useCallback, useRef, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { baseAccount } from 'wagmi/connectors';
import { useOnchainKit } from '@coinbase/onchainkit';

export default function CustomWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect, connectors } = useDisconnect();
  const { config } = useOnchainKit();
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setIsDropdownOpen(false);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = useCallback(() => {
    // 모든 connector disconnect
    connectors.map((connector) => disconnect({ connector }));
    setIsDropdownOpen(false);
  }, [disconnect, connectors]);

  const handleConnectBaseSmartWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      const appName = config?.appearance?.name || 'Web3Twin';
      const appLogoUrl = config?.appearance?.logo || undefined;
      
      connect({
        connector: baseAccount({
          appName,
          appLogoUrl,
        }),
      });
    } catch (error) {
      console.error('Failed to connect Base Smart Wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [connect, config]);

  if (isConnected && address) {
    return (
      <div className="wallet-dropdown-container" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="wallet-address-button"
          title="Click to open menu"
        >
          <span className="wallet-icon">🔗</span>
          <span className="wallet-address">{formatAddress(address)}</span>
          <span className="dropdown-arrow">▼</span>
        </button>
        
        {isDropdownOpen && (
          <div className="wallet-dropdown-menu">
            <button
              onClick={handleCopy}
              className="wallet-dropdown-item"
            >
              <span className="dropdown-icon">📋</span>
              <span>Copy Address</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="wallet-dropdown-item disconnect-item"
            >
              <span className="dropdown-icon">🚪</span>
              <span>Disconnect</span>
            </button>
          </div>
        )}
        
        {copied && <span className="copied-badge">✓ Copied!</span>}
      </div>
    );
  }

  return (
    <button 
      onClick={handleConnectBaseSmartWallet} 
      className="connect-wallet-button"
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}


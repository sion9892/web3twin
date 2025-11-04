import { useState, useCallback, useRef, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function CustomWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, status, error, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const walletMenuRef = useRef<HTMLDivElement>(null);

  // 연결 상태 모니터링 및 자동 리셋
  useEffect(() => {
    // 연결이 성공했을 때
    if (status === 'success') {
      setIsConnecting(false);
      setIsWalletMenuOpen(false);
    }
    
    // 에러가 발생했을 때
    if (status === 'error') {
      setIsConnecting(false);
      // 에러 시 짧은 딜레이 후 리셋
      const timer = setTimeout(() => {
        reset();
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // pending 상태가 너무 오래 지속되면 리셋 (20초 안전장치)
    if (status === 'pending') {
      const timeoutTimer = setTimeout(() => {
        console.warn('Connection pending too long (20s), resetting...');
        reset();
        setIsConnecting(false);
        alert('연결 시간이 초과되었습니다. 지갑에서 응답이 없습니다.');
      }, 20000); // 20초 후 자동 리셋
      return () => clearTimeout(timeoutTimer);
    }
  }, [status, error, reset]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getWalletName = (connectorId: string) => {
    if (connectorId.includes('baseAccount')) return 'Base Smart Wallet';
    return connectorId;
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (walletMenuRef.current && !walletMenuRef.current.contains(event.target as Node)) {
        setIsWalletMenuOpen(false);
      }
    };

    if (isDropdownOpen || isWalletMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isWalletMenuOpen]);

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setIsDropdownOpen(false);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = useCallback(() => {
    disconnect();
    setIsDropdownOpen(false);
  }, [disconnect]);

  const handleConnectWallet = useCallback(async (connector: any) => {
    // 이미 연결 중이면 무시
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      await connect({ connector });
    } catch (error: any) {
      // 에러는 조용히 처리 (사용자 취소 등은 정상 동작)
      console.log('Connection cancelled or failed:', error?.message);
      reset();
      setIsConnecting(false);
    }
  }, [connect, reset, isConnecting]);

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
    <div className="wallet-menu-container" ref={walletMenuRef}>
      <button 
        onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)} 
        className="connect-wallet-button"
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      
      {isWalletMenuOpen && (
        <div className="wallet-menu">
          <div className="wallet-menu-header">
            <h3>Connect Wallet</h3>
            <button 
              onClick={() => setIsWalletMenuOpen(false)}
              className="wallet-menu-close"
            >
              ×
            </button>
          </div>
          <div className="wallet-options">
            {connectors
              .filter((connector) => connector.id.includes('baseAccount'))
              .map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => handleConnectWallet(connector)}
                  className="wallet-option"
                  disabled={isConnecting}
                >
                  <span className="wallet-option-icon">🔷</span>
                  <span className="wallet-option-name">{getWalletName(connector.id)}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}


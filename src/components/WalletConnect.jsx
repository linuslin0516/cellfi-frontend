import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAccount, useConnect, useDisconnect, useBalance, useReadContract } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { formatEther } from 'viem';
import { CONTRACTS, CELL_TOKEN_ABI } from '../config';
import { WALLET_LIST, detectInstalledWallets } from '../config/wagmi';
import { useLanguage } from '../i18n';

/**
 * 錢包選擇彈窗組件 - 使用 Portal 渲染到 body
 */
function WalletModal({ isOpen, onClose, connectors, onConnect, isPending, error, t }) {
  const [installedWallets, setInstalledWallets] = useState([]);

  // 偵測已安裝的錢包
  useEffect(() => {
    if (isOpen) {
      const detected = detectInstalledWallets();
      setInstalledWallets(detected.map(w => w.id));
    }
  }, [isOpen]);

  // 防止背景滾動
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 整合錢包資訊並排序（已安裝的排在前面）
  const sortedWallets = useMemo(() => {
    const walletMap = {};
    WALLET_LIST.forEach(w => {
      walletMap[w.id] = w;
    });

    return connectors
      .map(connector => {
        const config = walletMap[connector.id] || {
          icon: '💳',
          color: '#F0B90B',
          name: connector.name,
        };
        const isInstalled = installedWallets.includes(connector.id);
        return {
          connector,
          config,
          isInstalled,
        };
      })
      .sort((a, b) => {
        // 已安裝的排在前面
        if (a.isInstalled && !b.isInstalled) return -1;
        if (!a.isInstalled && b.isInstalled) return 1;
        return 0;
      });
  }, [connectors, installedWallets]);

  // 已安裝的錢包數量
  const installedCount = sortedWallets.filter(w => w.isInstalled).length;

  if (!isOpen) return null;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* 背景遮罩 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
      />

      {/* 彈窗內容 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          maxHeight: '85vh',
          backgroundColor: '#181A20',
          borderRadius: '20px',
          border: '1px solid #2B3139',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          animation: 'modalFadeIn 0.2s ease-out',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #2B3139',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: '#FFFFFF',
            }}>
              {t('wallet.connect')}
            </h2>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '13px',
              color: '#848E9C',
            }}>
              {installedCount > 0
                ? t('wallet.walletsDetected', { count: installedCount })
                : t('wallet.noWalletsDetected')}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              backgroundColor: '#1E2329',
              border: 'none',
              cursor: 'pointer',
              color: '#848E9C',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2B3139';
              e.target.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1E2329';
              e.target.style.color = '#848E9C';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wallet List - Scrollable */}
        <div style={{
          padding: '16px',
          overflowY: 'auto',
          flex: 1,
        }}>
          {/* 已安裝的錢包 */}
          {installedCount > 0 && (
            <>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#03A66D',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                ✓ {t('wallet.installed')}
              </div>
              {sortedWallets
                .filter(w => w.isInstalled)
                .map(({ connector, config }) => (
                  <WalletButton
                    key={connector.uid}
                    connector={connector}
                    config={config}
                    isInstalled={true}
                    isPending={isPending}
                    onConnect={onConnect}
                    t={t}
                  />
                ))}
            </>
          )}

          {/* 未安裝的錢包 */}
          {sortedWallets.some(w => !w.isInstalled) && (
            <>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#848E9C',
                marginTop: installedCount > 0 ? '20px' : '0',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {t('wallet.otherWallets')}
              </div>
              {sortedWallets
                .filter(w => !w.isInstalled)
                .map(({ connector, config }) => (
                  <WalletButton
                    key={connector.uid}
                    connector={connector}
                    config={config}
                    isInstalled={false}
                    isPending={isPending}
                    onConnect={onConnect}
                    t={t}
                  />
                ))}
            </>
          )}

          {/* 沒有偵測到任何錢包的提示 */}
          {installedCount === 0 && (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#1E2329',
              borderRadius: '12px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔌</div>
              <p style={{
                margin: 0,
                color: '#F0B90B',
                fontSize: '14px',
                fontWeight: 600,
              }}>
                {t('wallet.noWalletExtension')}
              </p>
              <p style={{
                margin: '8px 0 0 0',
                color: '#848E9C',
                fontSize: '13px',
              }}>
                {t('wallet.installWeb3Wallet')}
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            margin: '0 16px 16px',
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(207, 48, 74, 0.1)',
            border: '1px solid rgba(207, 48, 74, 0.2)',
            flexShrink: 0,
          }}>
            <p style={{
              margin: 0,
              color: '#CF304A',
              fontSize: '14px',
            }}>{error.message}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '16px',
          paddingTop: '0',
          flexShrink: 0,
        }}>
          <div style={{
            paddingTop: '16px',
            borderTop: '1px solid #2B3139',
          }}>
            <p style={{
              margin: 0,
              color: '#848E9C',
              fontSize: '12px',
              textAlign: 'center',
            }}>
              {t('wallet.termsOfService')}
            </p>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );

  // 使用 Portal 渲染到 body
  return createPortal(modalContent, document.body);
}

/**
 * 單個錢包按鈕組件
 */
function WalletButton({ connector, config, isInstalled, isPending, onConnect, t }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onConnect(connector)}
      disabled={isPending || !isInstalled}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 16px',
        marginBottom: '8px',
        borderRadius: '14px',
        backgroundColor: isHovered && isInstalled ? '#2B3139' : '#1E2329',
        border: `1px solid ${isHovered && isInstalled ? 'rgba(240, 185, 11, 0.5)' : '#2B3139'}`,
        cursor: !isInstalled ? 'default' : isPending ? 'not-allowed' : 'pointer',
        opacity: !isInstalled ? 0.5 : isPending ? 0.5 : 1,
        transition: 'all 0.2s',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        backgroundColor: `${config.color}20`,
        flexShrink: 0,
      }}>
        {config.icon}
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{
          color: isHovered && isInstalled ? '#F0B90B' : '#FFFFFF',
          fontSize: '15px',
          fontWeight: 600,
          marginBottom: '2px',
          transition: 'color 0.2s',
        }}>
          {config.name}
        </div>
        <div style={{
          fontSize: '12px',
          color: isInstalled ? '#03A66D' : '#848E9C',
        }}>
          {isInstalled ? t('wallet.readyToConnect') : t('wallet.notInstalled')}
        </div>
      </div>
      {isInstalled && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isHovered ? '#F0B90B' : '#848E9C'}
          strokeWidth="2"
          style={{ transition: 'stroke 0.2s' }}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
      {!isInstalled && (
        <div style={{
          padding: '4px 8px',
          borderRadius: '6px',
          backgroundColor: '#2B3139',
          fontSize: '11px',
          color: '#848E9C',
        }}>
          {t('wallet.install')}
        </div>
      )}
    </button>
  );
}

/**
 * 錢包連接組件
 * 支援多個錢包選擇 - Binance 風格
 */
function WalletConnect({ onConnect }) {
  const { t } = useLanguage();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: bsc.id,
    query: {
      enabled: isConnected && !!address,
    },
  });

  // 讀取 CELL 代幣餘額
  const { data: cellBalance } = useReadContract({
    address: CONTRACTS.CELL_TOKEN,
    abi: CELL_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    chainId: bsc.id,
    query: {
      enabled: isConnected && address && CONTRACTS.CELL_TOKEN !== '0x0000000000000000000000000000000000000000',
    },
  });

  const [showModal, setShowModal] = useState(false);

  // 當連接成功時通知父組件
  useEffect(() => {
    if (isConnected && address && onConnect) {
      onConnect(address);
    }
  }, [isConnected, address, onConnect]);

  // 連接指定錢包
  const handleConnect = async (connector) => {
    try {
      await connect({ connector });
      setShowModal(false);
    } catch (err) {
      console.error('Connect error:', err);
    }
  };

  if (isConnected) {
    return (
      <div className="glass-card px-4 py-3 flex items-center gap-4">
        <div>
          <div className="text-xs text-[#848E9C] mb-0.5">{t('wallet.connected')}</div>
          <div className="font-mono text-white text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          {cellBalance && (
            <div className="text-xs text-[#F0B90B] font-medium">
              {parseFloat(formatEther(cellBalance)).toLocaleString()} $细胞
            </div>
          )}
          {balance && balance.value !== undefined && (
            <div className="text-xs text-[#848E9C]">
              {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol || 'tBNB'}
            </div>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            bg-[#CF304A]/10 text-[#CF304A] border border-[#CF304A]/20
            hover:bg-[#CF304A]/20 hover:border-[#CF304A]/40"
        >
          {t('wallet.disconnect')}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className="bnb-button flex items-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3" />
          <path d="M21 12a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v0z" />
        </svg>
        {isPending ? t('wallet.connecting') : t('wallet.connect')}
      </button>

      {/* 錢包選擇彈窗 - Portal 到 body */}
      <WalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        connectors={connectors}
        onConnect={handleConnect}
        isPending={isPending}
        error={error}
        t={t}
      />
    </>
  );
}

export default WalletConnect;

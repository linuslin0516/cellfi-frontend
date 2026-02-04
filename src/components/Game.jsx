import { useEffect, useRef, useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useChainId, useWalletClient } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { bscTestnet } from 'wagmi/chains';
import { CONTRACTS, CELL_TOKEN_ABI } from '../config';
import Renderer from '../game/Renderer';
import Input from '../game/Input';
import network from '../game/Network';
import { useLanguage } from '../i18n';

// BNB Logo SVG Component
const BNBLogo = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 126.61 126.61" fill="currentColor">
    <g>
      <path d="M38.73,53.2l24.59-24.58,24.6,24.6,14.3-14.31L63.32,0,24.42,38.9Z"/>
      <path d="M0,63.31l14.3-14.31,14.31,14.31L14.3,77.61Z"/>
      <path d="M38.73,73.41,63.32,98l24.6-24.6,14.31,14.29h0L63.32,126.61,24.42,87.71l-.01-.01Z"/>
      <path d="M97.99,63.31l14.3-14.31,14.32,14.31-14.31,14.3Z"/>
      <path d="M77.83,63.3h0L63.32,48.78,52.59,59.51l-1.24,1.23-2.54,2.54,14.51,14.52L77.83,63.32Z"/>
    </g>
  </svg>
);

// ========== Mini Demo Animations ==========
const MiniEatDemo = () => (
  <div className="relative bg-[#0B0E11] rounded-lg overflow-hidden" style={{ height: '80px' }}>
    <div className="absolute rounded-full bg-[#F0B90B]" style={{ width: '10px', height: '10px', top: '30px', left: '25%' }} />
    <div className="absolute rounded-full bg-[#03A66D] animate-food-eaten-1" style={{ width: '10px', height: '10px', top: '40px', left: '45%' }} />
    <div className="absolute rounded-full bg-[#00B8D9] animate-food-eaten-2" style={{ width: '10px', height: '10px', top: '28px', left: '65%' }} />
    <div className="absolute top-1/2 -translate-y-1/2 animate-cell-move-right">
      <div className="rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30 animate-cell-grow" style={{ width: '28px', height: '28px' }} />
    </div>
  </div>
);

const MiniSplitDemo = () => (
  <div className="relative bg-[#0B0E11] rounded-lg overflow-hidden" style={{ height: '80px' }}>
    <div className="absolute top-1/2 -translate-y-1/2 left-4">
      <div className="rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30 animate-split-origin" style={{ width: '28px', height: '28px' }} />
    </div>
    <div className="absolute top-1/2 -translate-y-1/2 left-4 animate-split-projectile">
      <div className="rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30" style={{ width: '18px', height: '18px' }} />
    </div>
    <div className="absolute top-1/2 -translate-y-1/2 right-4 animate-split-target">
      <div className="rounded-full bg-gradient-to-br from-[#00B8D9] to-[#4DD0E1] shadow-lg shadow-[#00B8D9]/30" style={{ width: '18px', height: '18px' }} />
    </div>
  </div>
);

const MiniEatPlayerDemo = () => (
  <div className="relative bg-[#0B0E11] rounded-lg overflow-hidden" style={{ height: '80px' }}>
    <div className="absolute top-1/2 -translate-y-1/2 left-2 animate-predator-chase">
      <div className="rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30" style={{ width: '36px', height: '36px' }} />
    </div>
    <div className="absolute top-1/2 -translate-y-1/2 right-6 animate-prey-eaten">
      <div className="rounded-full bg-gradient-to-br from-[#CF304A] to-[#FF6B6B] shadow-lg shadow-[#CF304A]/30" style={{ width: '18px', height: '18px' }} />
    </div>
  </div>
);

const MiniCashOutDemo = () => (
  <div className="relative bg-[#0B0E11] rounded-lg overflow-hidden" style={{ height: '80px' }}>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="rounded-full bg-gradient-to-br from-[#03A66D] to-[#4CAF50] shadow-lg shadow-[#03A66D]/30 animate-cashout-glow" style={{ width: '28px', height: '28px' }} />
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <svg className="-rotate-90" viewBox="0 0 100 100" style={{ width: '56px', height: '56px' }}>
        <circle cx="50" cy="50" r="40" fill="none" stroke="#2B3139" strokeWidth="4" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#F0B90B" strokeWidth="4" strokeDasharray="251" className="animate-cashout-progress" />
      </svg>
    </div>
  </div>
);

// Floating Cells Background - Larger and more visible
const FloatingCellsBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute rounded-full bg-gradient-to-br from-[#F0B90B]/25 to-[#F0B90B]/5 top-[8%] left-[3%] animate-float" style={{ width: '120px', height: '120px', animationDelay: '0s', animationDuration: '8s' }} />
    <div className="absolute rounded-full bg-gradient-to-br from-[#03A66D]/20 to-[#03A66D]/5 top-[55%] right-[5%] animate-float" style={{ width: '160px', height: '160px', animationDelay: '-2s', animationDuration: '10s' }} />
    <div className="absolute rounded-full bg-gradient-to-br from-[#CF304A]/20 to-[#CF304A]/5 top-[20%] right-[12%] animate-float" style={{ width: '100px', height: '100px', animationDelay: '-4s', animationDuration: '7s' }} />
    <div className="absolute rounded-full bg-gradient-to-br from-[#00B8D9]/20 to-[#00B8D9]/5 bottom-[15%] left-[8%] animate-float" style={{ width: '140px', height: '140px', animationDelay: '-1s', animationDuration: '9s' }} />
    <div className="absolute rounded-full bg-gradient-to-br from-[#F0B90B]/20 to-[#F0B90B]/5 top-[40%] left-[20%] animate-float" style={{ width: '80px', height: '80px', animationDelay: '-3s', animationDuration: '6s' }} />
    <div className="absolute rounded-full bg-gradient-to-br from-[#03A66D]/15 to-[#03A66D]/5 bottom-[30%] right-[20%] animate-float" style={{ width: '180px', height: '180px', animationDelay: '-5s', animationDuration: '11s' }} />
    <div className="absolute rounded-full bg-gradient-to-br from-[#00B8D9]/15 to-[#00B8D9]/5 top-[70%] left-[35%] animate-float" style={{ width: '90px', height: '90px', animationDelay: '-6s', animationDuration: '9s' }} />
    <div className="absolute rounded-full bg-gradient-to-br from-[#CF304A]/15 to-[#CF304A]/5 top-[5%] right-[35%] animate-float" style={{ width: '70px', height: '70px', animationDelay: '-7s', animationDuration: '8s' }} />
  </div>
);

// Coming Soon mode - controlled by environment variable
const IS_COMING_SOON = import.meta.env.VITE_COMING_SOON === 'true';

// Mock data for leaderboard and recent wins
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'CryptoKing', earnings: 2450000 },
  { rank: 2, name: 'BNBWhale', earnings: 1820000 },
  { rank: 3, name: 'CellMaster', earnings: 1350000 },
  { rank: 4, name: 'DeFiHunter', earnings: 980000 },
  { rank: 5, name: 'TokenEater', earnings: 750000 },
];

const MOCK_RECENT_WINS = [
  { name: 'Player_X92', amount: 125000, time: '2m ago' },
  { name: 'CryptoNinja', amount: 87500, time: '5m ago' },
  { name: 'BNBFan', amount: 62000, time: '8m ago' },
  { name: 'CellPro', amount: 156000, time: '12m ago' },
];

/**
 * 遊戲主組件 - 整合付款流程
 */
function Game({ address, playerName: initialPlayerName, onDeath, onCashOut, onExit }) {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const inputRef = useRef(null);
  const animationRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [systemMessage, setSystemMessage] = useState('');
  const [cashOutInfo, setCashOutInfo] = useState(null);

  // 付款相關狀態
  const [playerName, setPlayerName] = useState(initialPlayerName || 'Player');
  const [escrowAddress, setEscrowAddress] = useState(null);
  const [entryFee, setEntryFee] = useState(50000);
  const [gamePool, setGamePool] = useState(0);
  const [paymentStep, setPaymentStep] = useState('idle'); // idle, checking, approve, transfer, joining
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [totalVolume, setTotalVolume] = useState(12500000); // Mock total volume

  // Wagmi hooks
  const { isConnected, connector } = useAccount();
  const chainId = useChainId();
  const isWrongNetwork = chainId !== bscTestnet.id;
  const { data: walletClient } = useWalletClient();

  // 讀取代幣餘額
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.CELL_TOKEN,
    abi: CELL_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    chainId: bscTestnet.id,
    query: {
      enabled: isConnected && address && CONTRACTS.CELL_TOKEN !== '0x0000000000000000000000000000000000000000',
    },
  });

  // 讀取授權額度
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.CELL_TOKEN,
    abi: CELL_TOKEN_ABI,
    functionName: 'allowance',
    args: [address, escrowAddress],
    chainId: bscTestnet.id,
    query: {
      enabled: isConnected && address && escrowAddress && CONTRACTS.CELL_TOKEN !== '0x0000000000000000000000000000000000000000',
    },
  });

  // 授權代幣
  const { writeContract: approve, data: approveHash, isPending: isApproving, reset: resetApprove } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // 轉帳入場費
  const { writeContract: transfer, data: transferHash, isPending: isTransferring, reset: resetTransfer } = useWriteContract();
  const { isLoading: isTransferConfirming, isSuccess: isTransferSuccess } = useWaitForTransactionReceipt({
    hash: transferHash,
  });

  const hasEnoughBalance = tokenBalance && tokenBalance >= parseEther(entryFee.toString());
  const hasEnoughAllowance = allowance && allowance >= parseEther(entryFee.toString());
  const isProcessing = isApproving || isApproveConfirming || isTransferring || isTransferConfirming;

  // 獲取伺服器配置
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/config');
        const data = await response.json();
        console.log('[DEBUG] Server config:', data);
        console.log('[DEBUG] Escrow address from server:', data.escrowAddress);
        setEscrowAddress(data.escrowAddress);
        setEntryFee(data.entryFee || 50000);
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };
    fetchConfig();

    const fetchPool = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/pool');
        const data = await response.json();
        setGamePool(data.gamePool || 0);
        setOnlinePlayers(data.playerCount || Math.floor(Math.random() * 15) + 3);
      } catch (error) {
        console.error('Failed to fetch pool:', error);
        setOnlinePlayers(Math.floor(Math.random() * 15) + 3);
      }
    };
    fetchPool();

    // 定期更新 pool
    const interval = setInterval(fetchPool, 5000);
    return () => clearInterval(interval);
  }, []);

  // 當授權成功後刷新授權額度並自動進入轉帳步驟
  useEffect(() => {
    if (isApproveSuccess && paymentStep === 'approve') {
      refetchAllowance();
      setPaymentStep('transfer');
      setMessage('Approved! Now pay the entry fee.');
      setMessageType('success');
    }
  }, [isApproveSuccess, paymentStep, refetchAllowance]);

  // 追蹤當前交易的 hash
  const [currentTxHash, setCurrentTxHash] = useState(null);

  // 當有新的 transferHash 時更新
  useEffect(() => {
    if (transferHash && transferHash !== currentTxHash) {
      console.log('[DEBUG] New transfer hash:', transferHash);
      setCurrentTxHash(transferHash);
    }
  }, [transferHash, currentTxHash]);

  // 當轉帳成功後，加入遊戲
  useEffect(() => {
    if (isTransferSuccess && currentTxHash && paymentStep === 'transfer') {
      setPaymentStep('joining');
      setMessage('Payment successful! Joining game...');
      setMessageType('success');

      console.log('[DEBUG] Joining with tx hash:', currentTxHash);
      setTimeout(() => {
        network.joinWithPayment(address, playerName, currentTxHash);
        refetchBalance();
      }, 1000);
    }
  }, [isTransferSuccess, currentTxHash, paymentStep, address, playerName, refetchBalance]);

  // 初始化遊戲
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (rendererRef.current) {
        rendererRef.current.resize(canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const renderer = new Renderer(canvas);
    rendererRef.current = renderer;

    const input = new Input(canvas, renderer);
    inputRef.current = input;

    input.onMove = (x, y) => {
      network.move(x, y);
    };

    input.onCashOutStart = () => {
      network.startCashOut();
    };

    input.onCashOutCancel = () => {
      network.cancelCashOut();
    };

    input.onUpgrade = (type) => {
      network.upgrade(type);
    };

    input.onSplit = () => {
      network.split();
    };

    network.connect();

    network.onStateUpdate = (state) => {
      setGameState(state);
      if (state?.self) {
        const mass = Math.floor(state.self.score || 0);
        const MIN_CASHOUT = 10000;
        if (mass < MIN_CASHOUT) {
          setSystemMessage(`Mass: ${mass.toLocaleString()} | Need ${MIN_CASHOUT.toLocaleString()} to Cash Out | Hold C for 10s`);
        } else {
          setSystemMessage(`Mass: ${mass.toLocaleString()} ✓ Ready to Cash Out! | Hold C for 10s`);
        }
      }
    };

    network.onJoined = (data) => {
      setIsPlaying(true);
      setPaymentStep('idle');
      setMessage('');
      resetApprove?.();
      resetTransfer?.();
      setSystemMessage(`Joined! Initial mass: ${data.initialMass?.toLocaleString() || '?'} | Pool: ${data.gamePool?.toLocaleString() || '?'} CELL`);
    };

    network.onError = (error) => {
      setSystemMessage(`Error: ${error.message}`);
      if (error.code !== 'MASS_TOO_LOW') {
        setMessage(error.message);
        setMessageType('error');
        setPaymentStep('idle');
      }
    };

    network.onDeath = (data) => {
      setIsPlaying(false);
      setPaymentStep('idle');
      setMessage(`Killed by ${data.killerName}! Lost ${data.lostTokens?.toLocaleString() || 0} tokens.`);
      setMessageType('error');
      setSystemMessage('');
      setCashOutInfo(null);
      if (onDeath) onDeath(data);
    };

    network.onCashOutComplete = (data) => {
      setIsPlaying(false);
      setPaymentStep('idle');
      const msg = data.isGuest
        ? `Mock Cash Out! Got ${data.amount?.toLocaleString()} CELL (Guest mode)`
        : `Cash Out Success! Got ${data.amount?.toLocaleString()} CELL`;
      setMessage(msg);
      setMessageType('success');
      setSystemMessage('');
      setCashOutInfo(null);
      refetchBalance();
      if (onCashOut) onCashOut(data);
    };

    network.socket?.on('cashoutStarted', (data) => {
      setCashOutInfo(data);
      setSystemMessage(`Cashing out... Est. reward: ${data.estimatedReward?.toLocaleString()} CELL (${data.share})`);
    });

    network.socket?.on('cashoutCancelled', () => {
      setCashOutInfo(null);
      setSystemMessage('Cash Out cancelled');
    });

    const gameLoop = () => {
      if (rendererRef.current && gameState) {
        rendererRef.current.render(gameState);
      }
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
      network.disconnect();
    };
  }, []);

  useEffect(() => {
    if (rendererRef.current && gameState) {
      rendererRef.current.render(gameState);
    }
  }, [gameState]);

  // 開始遊戲流程
  const handleStartGame = () => {
    if (!address) {
      setMessage('Please connect your wallet first');
      setMessageType('error');
      return;
    }

    if (isWrongNetwork) {
      setMessage('Please switch to BSC Testnet (Chain ID: 97)');
      setMessageType('error');
      return;
    }

    if (!escrowAddress) {
      setMessage('Loading server config...');
      setMessageType('info');
      return;
    }

    if (!hasEnoughBalance) {
      setMessage(`Insufficient balance! Need ${entryFee.toLocaleString()} CELL`);
      setMessageType('error');
      return;
    }

    // 檢查是否需要授權
    if (!hasEnoughAllowance) {
      setPaymentStep('approve');
      setMessage('Step 1: Approve CELL token spending');
      setMessageType('info');
    } else {
      setPaymentStep('transfer');
      setMessage('Pay entry fee to join the game');
      setMessageType('info');
    }
  };

  // 執行授權
  const handleApprove = () => {
    if (!escrowAddress) return;
    console.log('[DEBUG] Approving spender:', escrowAddress);
    approve({
      address: CONTRACTS.CELL_TOKEN,
      abi: CELL_TOKEN_ABI,
      functionName: 'approve',
      args: [escrowAddress, parseEther('1000000000')],
      chainId: bscTestnet.id,
    });
  };

  // 執行轉帳 - 使用原生方式繞過 wagmi 緩存
  const handleTransfer = async () => {
    if (!escrowAddress || !address) return;

    console.log('[DEBUG] ====== DIRECT TRANSFER (bypassing wagmi cache) ======');
    console.log('[DEBUG] Escrow address:', escrowAddress);
    console.log('[DEBUG] Entry fee:', entryFee);
    console.log('[DEBUG] From address:', address);

    try {
      // 從已連接的 connector 獲取正確的 provider (支援 EIP-6963)
      let provider;
      if (connector) {
        provider = await connector.getProvider();
        console.log('[DEBUG] Using connector provider:', connector.name);
      }
      if (!provider) {
        provider = window.ethereum;
        console.log('[DEBUG] Fallback to window.ethereum');
      }
      if (!provider) {
        setMessage('No wallet found!');
        setMessageType('error');
        return;
      }

      // ERC20 transfer 函數簽名
      const transferFunctionSignature = '0xa9059cbb'; // transfer(address,uint256)

      // 編碼參數
      const toAddressPadded = escrowAddress.toLowerCase().replace('0x', '').padStart(64, '0');
      const amountHex = parseEther(entryFee.toString()).toString(16).padStart(64, '0');

      const data = transferFunctionSignature + toAddressPadded + amountHex;

      console.log('[DEBUG] Transaction data:', data);
      console.log('[DEBUG] To (token contract):', CONTRACTS.CELL_TOKEN);
      console.log('[DEBUG] Transfer recipient (in data):', escrowAddress);

      // 發送交易
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: CONTRACTS.CELL_TOKEN,
          data: data,
          chainId: '0x61', // BSC Testnet = 97 = 0x61
        }],
      });

      console.log('[DEBUG] Transaction sent! Hash:', txHash);
      setCurrentTxHash(txHash);

      // 等待交易確認
      setMessage('Transaction sent! Waiting for confirmation...');
      setMessageType('info');

      // 輪詢檢查交易狀態
      const checkTx = async () => {
        const receipt = await provider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        });

        if (receipt && receipt.status === '0x1') {
          console.log('[DEBUG] Transaction confirmed!');
          setPaymentStep('joining');
          setMessage('Payment successful! Joining game...');
          setMessageType('success');

          setTimeout(() => {
            network.joinWithPayment(address, playerName, txHash);
            refetchBalance();
          }, 1000);
        } else if (receipt && receipt.status === '0x0') {
          setMessage('Transaction failed!');
          setMessageType('error');
          setPaymentStep('transfer');
        } else {
          // 繼續等待
          setTimeout(checkTx, 2000);
        }
      };

      setTimeout(checkTx, 3000);

    } catch (error) {
      console.error('[DEBUG] Transfer error:', error);
      setMessage('Transfer failed: ' + (error.message || 'Unknown error'));
      setMessageType('error');
    }
  };

  // 取消付款流程
  const handleCancel = () => {
    setPaymentStep('idle');
    setMessage('');
    setCurrentTxHash(null);
    resetApprove?.();
    resetTransfer?.();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0B0E11]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />

      {/* 頂部狀態欄 */}
      {isPlaying && gameState?.self && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 animate-slide-up">
          <div className="stats-card flex gap-8 items-center">
            <div className="flex items-center gap-2">
              <BNBLogo className="w-5 h-5 text-[#F0B90B]" />
              <span className="text-[#848E9C] text-sm">Tokens</span>
              <span className="text-[#F0B90B] font-bold text-lg">{gameState.self.tokenBalance}</span>
            </div>
            <div className="w-px h-6 bg-[#2B3139]" />
            <div className="flex items-center gap-2">
              <span className="text-[#848E9C] text-sm">Score</span>
              <span className="text-white font-bold text-lg">
                {Math.floor(Math.PI * gameState.self.radius * gameState.self.radius).toLocaleString()}
              </span>
            </div>
            <div className="w-px h-6 bg-[#2B3139]" />
            <div className="flex items-center gap-2">
              <span className="text-[#848E9C] text-sm">Size</span>
              <span className="text-[#03A66D] font-bold text-lg">
                {Math.floor(gameState.self.radius)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 升級商店 */}
      {isPlaying && (
        <div className="absolute bottom-6 left-6 animate-slide-up">
          <div className="glass-card p-4">
            <h3 className="text-sm font-bold text-[#848E9C] mb-3 uppercase tracking-wider">Upgrades</h3>
            <div className="flex gap-3">
              <button
                onClick={() => network.upgrade('speed')}
                className="group flex items-center gap-2 bg-[#1E2329] hover:bg-[#2B3139] border border-[#2B3139] hover:border-[#F0B90B] px-4 py-3 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">⚡</span>
                <div className="text-left">
                  <div className="text-[#F0B90B] font-semibold text-sm">[1] Speed</div>
                  <div className="text-[#848E9C] text-xs">+30% for 60s</div>
                </div>
              </button>
              <button
                onClick={() => network.upgrade('shield')}
                className="group flex items-center gap-2 bg-[#1E2329] hover:bg-[#2B3139] border border-[#2B3139] hover:border-[#00B8D9] px-4 py-3 rounded-lg transition-all duration-200"
              >
                <span className="text-xl">🛡️</span>
                <div className="text-left">
                  <div className="text-[#00B8D9] font-semibold text-sm">[2] Shield</div>
                  <div className="text-[#848E9C] text-xs">Block 1 hit</div>
                </div>
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#848E9C]">
              <kbd className="px-2 py-1 bg-[#2B3139] rounded text-[#F0B90B] font-mono">C</kbd>
              <span>Hold 10 seconds to Cash Out</span>
            </div>
          </div>
        </div>
      )}

      {/* Cash Out 進度提示 */}
      {isPlaying && gameState?.self?.isCashingOut && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-scale-in z-50">
          <div className="glass-card p-4 text-center min-w-[300px]">
            <div className="text-[#F0B90B] font-bold mb-2">CASHING OUT...</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(gameState.self.cashOutProgress || 0) * 100}%` }}
              />
            </div>
            <div className="text-[#848E9C] text-sm mt-2">
              {Math.floor((gameState.self.cashOutProgress || 0) * 10)}s / 10s
            </div>
            {cashOutInfo && (
              <div className="text-[#03A66D] text-sm mt-2">
                Est. reward: {cashOutInfo.estimatedReward?.toLocaleString()} CELL ({cashOutInfo.share})
              </div>
            )}
          </div>
        </div>
      )}

      {/* 底部系統提示訊息 */}
      {isPlaying && systemMessage && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#1E2329]/90 border-t border-[#2B3139] py-2 px-4 z-40">
          <div className="text-center text-sm">
            <span className={systemMessage.includes('✓') ? 'text-[#03A66D]' : systemMessage.includes('Error') ? 'text-[#CF304A]' : 'text-[#848E9C]'}>
              {systemMessage}
            </span>
          </div>
        </div>
      )}

      {/* 開始/付款畫面 */}
      {!isPlaying && (
        <div className="modal-overlay">
          {/* 浮動背景 */}
          <FloatingCellsBackground />

          {/* 返回主頁按鈕 */}
          {onExit && (
            <button
              onClick={onExit}
              className="absolute top-6 left-6 z-[60] flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E2329]/90 hover:bg-[#2B3139] border border-[#2B3139] text-[#848E9C] hover:text-white transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span className="font-medium">{t('game.backToHome')}</span>
            </button>
          )}

          {/* 頂部即時數據條 */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[60] max-w-[90vw]" style={{ top: '28px' }}>
            <div className="flex items-center bg-[#1E2329]/90 backdrop-blur-sm rounded-2xl border border-[#2B3139]" style={{ gap: '28px', padding: '16px 32px' }}>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <div className="rounded-full bg-[#03A66D] animate-pulse" style={{ width: '10px', height: '10px' }} />
                <span className="text-[#848E9C]" style={{ fontSize: '14px' }}>{t('game.online')}</span>
                <span className="text-white font-bold" style={{ fontSize: '16px' }}>{onlinePlayers}</span>
              </div>
              <div className="bg-[#2B3139]" style={{ width: '1px', height: '20px' }} />
              <div className="flex items-center" style={{ gap: '10px' }}>
                <BNBLogo className="text-[#F0B90B]" style={{ width: '18px', height: '18px' }} />
                <span className="text-[#848E9C] hidden sm:inline" style={{ fontSize: '14px' }}>{t('game.pool')}</span>
                <span className="text-[#F0B90B] font-bold" style={{ fontSize: '16px' }}>{gamePool.toLocaleString()}</span>
              </div>
              <div className="bg-[#2B3139] hidden sm:block" style={{ width: '1px', height: '20px' }} />
              <div className="hidden sm:flex items-center" style={{ gap: '10px' }}>
                <span className="text-[#848E9C]" style={{ fontSize: '14px' }}>{t('game.volume')}</span>
                <span className="text-white font-bold" style={{ fontSize: '16px' }}>{(totalVolume / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>

          <div className="modal-content flex flex-col xl:flex-row items-center xl:items-start justify-center" style={{ gap: '80px', paddingTop: '120px', paddingBottom: '60px', minHeight: '100vh' }}>
            {/* 左側：玩法演示 */}
            {paymentStep === 'idle' && !message && (
              <div className="hidden lg:block shrink-0" style={{ width: '320px' }}>
                <h3 className="text-[#848E9C] text-sm font-medium uppercase tracking-wider" style={{ marginBottom: '24px' }}>{t('game.howToPlay')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Eat Food */}
                  <div className="bg-[#1E2329] rounded-xl border border-[#2B3139]" style={{ padding: '20px' }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
                      <span className="text-xl">🍽️</span>
                      <span className="text-white font-semibold text-base">{t('game.demo.eatFood')}</span>
                    </div>
                    <MiniEatDemo />
                    <p className="text-[#5E6673] text-sm" style={{ marginTop: '14px' }}>{t('game.demo.eatFoodDesc')}</p>
                  </div>

                  {/* Split Attack */}
                  <div className="bg-[#1E2329] rounded-xl border border-[#2B3139]" style={{ padding: '20px' }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
                      <span className="text-xl">💥</span>
                      <span className="text-white font-semibold text-base">{t('game.demo.splitAttack')}</span>
                      <kbd className="ml-auto px-2 py-1 bg-[#2B3139] rounded text-[#F0B90B] text-xs font-mono">Space</kbd>
                    </div>
                    <MiniSplitDemo />
                    <p className="text-[#5E6673] text-sm" style={{ marginTop: '14px' }}>{t('game.demo.splitAttackDesc')}</p>
                  </div>

                  {/* Eat Players */}
                  <div className="bg-[#1E2329] rounded-xl border border-[#2B3139]" style={{ padding: '20px' }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
                      <span className="text-xl">👾</span>
                      <span className="text-white font-semibold text-base">{t('game.demo.eatPlayers')}</span>
                    </div>
                    <MiniEatPlayerDemo />
                    <p className="text-[#5E6673] text-sm" style={{ marginTop: '14px' }}>{t('game.demo.eatPlayersDesc')}</p>
                  </div>

                  {/* Cash Out */}
                  <div className="bg-[#1E2329] rounded-xl border border-[#2B3139]" style={{ padding: '20px' }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
                      <span className="text-xl">💰</span>
                      <span className="text-white font-semibold text-base">{t('game.demo.cashOutTitle')}</span>
                      <kbd className="ml-auto px-2 py-1 bg-[#2B3139] rounded text-[#F0B90B] text-xs font-mono">Hold C</kbd>
                    </div>
                    <MiniCashOutDemo />
                    <p className="text-[#5E6673] text-sm" style={{ marginTop: '14px' }}>{t('game.demo.cashOutDesc')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 中間：遊戲啟動面板 */}
            <div className="text-center">
              <div className="glass-card" style={{ padding: '56px 48px', maxWidth: '480px' }}>
                {/* Logo */}
                <div className="flex items-center justify-center" style={{ gap: '20px', marginBottom: '40px' }}>
                  <BNBLogo className="text-[#F0B90B] animate-float" style={{ width: '64px', height: '64px' }} />
                  <h1 style={{ fontSize: '52px', fontWeight: '900' }}>
                    <span className="bnb-gradient">CELL</span>
                    <span className="text-white">FI</span>
                  </h1>
                </div>

                {/* 遊戲資訊 */}
                {paymentStep !== 'idle' && (
                  <div className="bg-[#0B0E11] rounded-xl text-left" style={{ padding: '24px', marginBottom: '28px' }}>
                    <div className="flex justify-between" style={{ fontSize: '15px', marginBottom: '16px' }}>
                      <span className="text-[#848E9C]">Entry Fee:</span>
                      <span className="text-[#F0B90B] font-bold">{entryFee.toLocaleString()} CELL</span>
                    </div>
                    <div className="flex justify-between" style={{ fontSize: '15px', marginBottom: '16px' }}>
                      <span className="text-[#848E9C]">Game Pool:</span>
                      <span className="text-white">{gamePool.toLocaleString()} CELL</span>
                    </div>
                    <div className="flex justify-between" style={{ fontSize: '15px' }}>
                      <span className="text-[#848E9C]">Your Balance:</span>
                      <span className={hasEnoughBalance ? 'text-[#03A66D]' : 'text-[#CF304A]'}>
                        {tokenBalance ? parseFloat(formatEther(tokenBalance)).toLocaleString() : '0'} CELL
                      </span>
                    </div>
                  </div>
                )}

                {/* 玩家名稱輸入 */}
                {paymentStep !== 'idle' && paymentStep !== 'joining' && (
                  <div style={{ marginBottom: '28px' }}>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-xl text-white text-center"
                      style={{ padding: '16px 20px', fontSize: '16px' }}
                      placeholder="Enter your name"
                    />
                  </div>
                )}

                {/* 訊息 */}
                {message && (
                  <div style={{ marginBottom: '28px', padding: '24px', borderRadius: '16px' }} className={`${
                    messageType === 'error'
                      ? 'bg-[#CF304A]/20 border border-[#CF304A]/30 text-[#CF304A]'
                      : messageType === 'success'
                      ? 'bg-[#03A66D]/20 border border-[#03A66D]/30 text-[#03A66D]'
                      : 'bg-[#F0B90B]/20 border border-[#F0B90B]/30 text-[#F0B90B]'
                  }`}>
                    <p className="font-medium">{message}</p>
                    {/* 死亡後顯示返回主頁按鈕 */}
                    {messageType === 'error' && message.includes('Killed') && onExit && (
                      <button
                        onClick={onExit}
                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#CF304A]/30 hover:bg-[#CF304A]/50 text-white transition-all"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Return to Home
                      </button>
                    )}
                    {/* Cash Out 成功後顯示返回主頁按鈕 */}
                    {messageType === 'success' && message.includes('Cash Out') && onExit && (
                      <button
                        onClick={onExit}
                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#03A66D]/30 hover:bg-[#03A66D]/50 text-white transition-all"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Return to Home
                      </button>
                    )}
                  </div>
                )}

                {/* 按鈕區 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* 初始狀態 - Start Game 按鈕 */}
                  {paymentStep === 'idle' && (
                    IS_COMING_SOON ? (
                      <button
                        disabled
                        className="w-full rounded-xl text-white font-bold cursor-not-allowed"
                        style={{
                          fontSize: '20px',
                          padding: '22px 32px',
                          background: 'linear-gradient(135deg, #2B3139 0%, #1E2329 100%)',
                          border: '1px solid #3B4149'
                        }}
                      >
                        🚀 {t('game.comingSoon')}
                      </button>
                    ) : (
                      <button
                        onClick={handleStartGame}
                        className="bnb-button w-full"
                        style={{ fontSize: '20px', padding: '22px 32px' }}
                      >
                        {message ? `🔄 ${t('game.playAgain')}` : `🎮 ${t('game.startGame')}`}
                      </button>
                    )
                  )}

                  {/* Approve 步驟 */}
                  {paymentStep === 'approve' && (
                    <>
                      <button
                        onClick={handleApprove}
                        disabled={isProcessing}
                        className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/80 disabled:bg-gray-600 rounded-xl text-black font-bold transition"
                        style={{ fontSize: '18px', padding: '22px 32px' }}
                      >
                        {isApproving || isApproveConfirming ? `⏳ ${t('game.payment.approving')}` : `1️⃣ ${t('game.payment.approveCELL')}`}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isProcessing}
                        className="w-full bg-transparent hover:bg-[#2B3139] border border-[#2B3139] rounded-xl text-[#848E9C] font-medium transition"
                        style={{ padding: '16px 24px' }}
                      >
                        {t('game.payment.cancel')}
                      </button>
                    </>
                  )}

                  {/* Transfer 步驟 */}
                  {paymentStep === 'transfer' && (
                    <>
                      <button
                        onClick={handleTransfer}
                        disabled={isProcessing || !playerName.trim()}
                        className="w-full bg-[#03A66D] hover:bg-[#03A66D]/80 disabled:bg-gray-600 rounded-xl text-white font-bold transition"
                        style={{ fontSize: '18px', padding: '22px 32px' }}
                      >
                        {isTransferring || isTransferConfirming ? `⏳ ${t('game.payment.processing')}` : `💰 ${t('game.payment.payAndJoin', { amount: entryFee.toLocaleString() })}`}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isProcessing}
                        className="w-full bg-transparent hover:bg-[#2B3139] border border-[#2B3139] rounded-xl text-[#848E9C] font-medium transition"
                        style={{ padding: '16px 24px' }}
                      >
                        {t('game.payment.cancel')}
                      </button>
                    </>
                  )}

                  {/* Joining 步驟 */}
                  {paymentStep === 'joining' && (
                    <div className="text-[#F0B90B] font-bold animate-pulse" style={{ padding: '22px', fontSize: '20px' }}>
                      🎮 {t('game.payment.joining')}
                    </div>
                  )}
                </div>

                {/* 錢包未連接提示 */}
                {!address && paymentStep === 'idle' && (
                  <p className="text-[#848E9C]" style={{ marginTop: '28px', fontSize: '15px' }}>
                    {t('game.connectWallet')}
                  </p>
                )}

                {/* 快捷鍵提示 */}
                {paymentStep === 'idle' && (
                  <div className="border-t border-[#2B3139]" style={{ marginTop: '36px', paddingTop: '36px' }}>
                    <p className="text-[#848E9C] text-xs uppercase tracking-wider" style={{ marginBottom: '20px' }}>{t('game.controls')}</p>
                    <div className="flex justify-center" style={{ gap: '40px', fontSize: '14px' }}>
                      <div className="flex items-center gap-3">
                        <kbd className="bg-[#2B3139] rounded-lg text-white font-mono" style={{ padding: '12px 16px', fontSize: '13px' }}>Mouse</kbd>
                        <span className="text-[#848E9C]">{t('game.move')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <kbd className="bg-[#2B3139] rounded-lg text-white font-mono" style={{ padding: '12px 16px', fontSize: '13px' }}>Space</kbd>
                        <span className="text-[#848E9C]">{t('game.split')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <kbd className="bg-[#2B3139] rounded-lg text-[#F0B90B] font-mono" style={{ padding: '12px 16px', fontSize: '13px' }}>C</kbd>
                        <span className="text-[#848E9C]">{t('game.cashOut')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 入場費資訊 */}
                {paymentStep === 'idle' && !message && (
                  <div className="grid grid-cols-2" style={{ marginTop: '32px', gap: '20px' }}>
                    <div className="bg-[#0B0E11] rounded-xl text-center border border-[#2B3139]" style={{ padding: '24px 20px' }}>
                      <div className="text-[#F0B90B] font-bold" style={{ fontSize: '28px' }}>50K</div>
                      <div className="text-[#5E6673]" style={{ fontSize: '13px', marginTop: '6px' }}>{t('game.entryFee')}</div>
                    </div>
                    <div className="bg-[#0B0E11] rounded-xl text-center border border-[#2B3139]" style={{ padding: '24px 20px' }}>
                      <div className="text-[#03A66D] font-bold" style={{ fontSize: '28px' }}>100%</div>
                      <div className="text-[#5E6673]" style={{ fontSize: '13px', marginTop: '6px' }}>{t('game.poolShare')}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 右側：排行榜與最近獲獎 */}
            {paymentStep === 'idle' && !message && (
              <div className="hidden xl:flex xl:flex-col shrink-0" style={{ width: '300px', gap: '28px' }}>
                {/* 排行榜 */}
                <div className="bg-[#1E2329]/90 backdrop-blur-sm rounded-xl border border-[#2B3139]" style={{ padding: '24px' }}>
                  <div className="flex items-center" style={{ gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '22px' }}>🏆</span>
                    <h3 className="text-white font-semibold" style={{ fontSize: '17px' }}>{t('game.leaderboard')}</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {MOCK_LEADERBOARD.map((player) => (
                      <div key={player.rank} className="flex items-center rounded-lg hover:bg-[#2B3139]/50 transition-colors" style={{ gap: '14px', padding: '12px 14px' }}>
                        <div className={`rounded-full flex items-center justify-center font-bold ${
                          player.rank === 1 ? 'bg-[#FFD700] text-black' :
                          player.rank === 2 ? 'bg-[#C0C0C0] text-black' :
                          player.rank === 3 ? 'bg-[#CD7F32] text-white' :
                          'bg-[#2B3139] text-[#848E9C]'
                        }`} style={{ width: '32px', height: '32px', fontSize: '13px' }}>
                          {player.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate" style={{ fontSize: '15px' }}>{player.name}</div>
                        </div>
                        <div className="text-[#F0B90B] font-bold" style={{ fontSize: '14px' }}>{(player.earnings / 1000).toFixed(0)}K</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 最近獲獎 */}
                <div className="bg-[#1E2329]/90 backdrop-blur-sm rounded-xl border border-[#2B3139]" style={{ padding: '24px' }}>
                  <div className="flex items-center" style={{ gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '22px' }}>💰</span>
                    <h3 className="text-white font-semibold" style={{ fontSize: '17px' }}>{t('game.recentWins')}</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {MOCK_RECENT_WINS.map((win, idx) => (
                      <div key={idx} className="flex items-center" style={{ gap: '14px' }}>
                        <div className="rounded-full bg-gradient-to-br from-[#03A66D] to-[#4CAF50] flex items-center justify-center" style={{ width: '40px', height: '40px' }}>
                          <span className="text-white" style={{ fontSize: '14px' }}>✓</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate" style={{ fontSize: '15px' }}>{win.name}</div>
                          <div className="text-[#5E6673]" style={{ fontSize: '13px' }}>{win.time}</div>
                        </div>
                        <div className="text-[#03A66D] font-bold" style={{ fontSize: '15px' }}>+{(win.amount / 1000).toFixed(0)}K</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 風險警告 */}
                <div className="bg-[#CF304A]/10 rounded-xl border border-[#CF304A]/30" style={{ padding: '20px' }}>
                  <div className="flex items-start" style={{ gap: '14px' }}>
                    <span style={{ fontSize: '22px' }}>⚠️</span>
                    <div>
                      <div className="text-[#CF304A] font-medium" style={{ fontSize: '15px' }}>{t('game.riskWarning')}</div>
                      <div className="text-[#848E9C]" style={{ fontSize: '13px', marginTop: '6px', lineHeight: '1.5' }}>{t('game.riskWarningDesc')}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { bscTestnet } from 'wagmi/chains';
import { CONTRACTS, AGAR_TOKEN_ABI, SERVER_URL } from '../config';
import network from '../game/Network';

/**
 * 代幣操作組件
 * 支援入場費付款和遊戲加入流程
 */
function TokenActions({ onJoinGame }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [showModal, setShowModal] = useState(false);
  const [escrowAddress, setEscrowAddress] = useState(null);
  const [entryFee, setEntryFee] = useState(50000);
  const [gamePool, setGamePool] = useState(0);
  const [playerName, setPlayerName] = useState('Player');
  const [joinStatus, setJoinStatus] = useState('');

  // 檢查是否在正確的網路
  const isWrongNetwork = chainId !== bscTestnet.id;

  // 讀取代幣餘額
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.AGAR_TOKEN,
    abi: AGAR_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    chainId: bscTestnet.id,
    query: {
      enabled: isConnected && address && CONTRACTS.AGAR_TOKEN !== '0x0000000000000000000000000000000000000000',
    },
  });

  // 讀取授權額度
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.AGAR_TOKEN,
    abi: AGAR_TOKEN_ABI,
    functionName: 'allowance',
    args: [address, escrowAddress],
    chainId: bscTestnet.id,
    query: {
      enabled: isConnected && address && escrowAddress && CONTRACTS.AGAR_TOKEN !== '0x0000000000000000000000000000000000000000',
    },
  });

  // 授權代幣
  const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // 轉帳入場費
  const { writeContract: transfer, data: transferHash, isPending: isTransferring } = useWriteContract();
  const { isLoading: isTransferConfirming, isSuccess: isTransferSuccess } = useWaitForTransactionReceipt({
    hash: transferHash,
  });

  // 獲取伺服器配置
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/config`);
        const data = await response.json();
        setEscrowAddress(data.escrowAddress);
        setEntryFee(data.entryFee || 50000);
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };
    fetchConfig();

    // 獲取遊戲池資訊
    const fetchPool = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/pool`);
        const data = await response.json();
        setGamePool(data.gamePool || 0);
      } catch (error) {
        console.error('Failed to fetch pool:', error);
      }
    };
    fetchPool();
  }, []);

  // 當授權成功後刷新授權額度
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  // 當轉帳成功後，加入遊戲
  useEffect(() => {
    if (isTransferSuccess && transferHash) {
      setJoinStatus('正在加入遊戲...');

      // 等待一下讓區塊確認
      setTimeout(() => {
        network.joinWithPayment(address, playerName, transferHash);
        setJoinStatus('已發送加入請求！');

        // 刷新餘額
        refetchBalance();

        // 關閉彈窗
        setTimeout(() => {
          setShowModal(false);
          setJoinStatus('');
          if (onJoinGame) onJoinGame();
        }, 2000);
      }, 1000);
    }
  }, [isTransferSuccess, transferHash, address, playerName, refetchBalance, onJoinGame]);

  const handleApprove = () => {
    if (!escrowAddress) {
      alert('無法獲取 Escrow 地址');
      return;
    }
    approve({
      address: CONTRACTS.AGAR_TOKEN,
      abi: AGAR_TOKEN_ABI,
      functionName: 'approve',
      args: [escrowAddress, parseEther('1000000000')], // 授權大量代幣
      chainId: bscTestnet.id,
    });
  };

  const handlePayEntryFee = () => {
    if (!escrowAddress) {
      alert('無法獲取 Escrow 地址');
      return;
    }

    const entryFeeWei = parseEther(entryFee.toString());

    transfer({
      address: CONTRACTS.AGAR_TOKEN,
      abi: AGAR_TOKEN_ABI,
      functionName: 'transfer',
      args: [escrowAddress, entryFeeWei],
      chainId: bscTestnet.id,
    });
  };

  const hasEnoughBalance = tokenBalance && tokenBalance >= parseEther(entryFee.toString());
  const hasEnoughAllowance = allowance && allowance >= parseEther(entryFee.toString());
  const isProcessing = isApproving || isApproveConfirming || isTransferring || isTransferConfirming;

  if (!isConnected) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-[#F0B90B] hover:bg-[#F0B90B]/80 px-4 py-2 rounded-lg text-black font-bold transition"
      >
        Pay Entry Fee
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1E2329] border border-[#2B3139] p-6 rounded-lg w-[420px] text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#F0B90B]">Join Game</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* 網路警告 */}
              {isWrongNetwork && (
                <div className="bg-red-900/50 border border-red-500 p-3 rounded text-red-300 text-sm">
                  ⚠️ 請切換到 BSC Testnet (Chain ID: 97)
                </div>
              )}

              {/* 遊戲資訊 */}
              <div className="bg-[#0B0E11] p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#848E9C]">Entry Fee:</span>
                  <span className="text-[#F0B90B] font-bold">{entryFee.toLocaleString()} AGAR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#848E9C]">Game Pool:</span>
                  <span className="text-white">{gamePool.toLocaleString()} AGAR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#848E9C]">Your Balance:</span>
                  <span className={hasEnoughBalance ? 'text-[#03A66D]' : 'text-[#CF304A]'}>
                    {tokenBalance ? parseFloat(formatEther(tokenBalance)).toLocaleString() : '0'} AGAR
                  </span>
                </div>
                {escrowAddress && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#848E9C]">Escrow:</span>
                    <span className="text-[#848E9C] font-mono text-xs">
                      {escrowAddress.slice(0, 6)}...{escrowAddress.slice(-4)}
                    </span>
                  </div>
                )}
              </div>

              {/* 玩家名稱 */}
              <div>
                <label className="block text-sm text-[#848E9C] mb-1">Player Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg px-3 py-2 text-white"
                  placeholder="Enter your name"
                />
              </div>

              {/* 狀態訊息 */}
              {joinStatus && (
                <div className="bg-[#F0B90B]/20 border border-[#F0B90B]/30 p-3 rounded text-[#F0B90B] text-sm text-center">
                  {joinStatus}
                </div>
              )}

              {/* 操作按鈕 */}
              <div className="space-y-2">
                {!hasEnoughBalance && (
                  <div className="text-[#CF304A] text-sm text-center">
                    餘額不足！需要 {entryFee.toLocaleString()} AGAR
                  </div>
                )}

                {hasEnoughBalance && !hasEnoughAllowance && (
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/80 disabled:bg-gray-600 py-3 rounded-lg text-black font-bold transition"
                  >
                    {isApproving || isApproveConfirming ? 'Approving...' : '1. Approve AGAR'}
                  </button>
                )}

                {hasEnoughBalance && hasEnoughAllowance && (
                  <button
                    onClick={handlePayEntryFee}
                    disabled={isProcessing || !playerName.trim()}
                    className="w-full bg-[#03A66D] hover:bg-[#03A66D]/80 disabled:bg-gray-600 py-3 rounded-lg text-white font-bold transition"
                  >
                    {isTransferring || isTransferConfirming ? 'Processing...' : `Pay ${entryFee.toLocaleString()} AGAR & Join`}
                  </button>
                )}
              </div>

              {/* 說明 */}
              <div className="text-xs text-[#848E9C] space-y-1">
                <p>• Entry fee will be added to the game pool</p>
                <p>• Cash out rewards based on your mass share</p>
                <p>• Hold C for 10 seconds to cash out</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TokenActions;

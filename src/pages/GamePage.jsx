import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Game from '../components/Game';
import WalletConnect from '../components/WalletConnect';

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

// ========== ANIMATED DEMO COMPONENTS ==========

// Eating Food Animation
const EatFoodDemo = () => (
  <div className="relative h-24 bg-[#0B0E11] rounded-xl overflow-hidden">
    {/* Food particles */}
    <div className="absolute w-3 h-3 rounded-full bg-[#F0B90B] top-8 left-[20%] animate-food-eaten-1" />
    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#03A66D] top-12 left-[35%] animate-food-eaten-2" />
    <div className="absolute w-3 h-3 rounded-full bg-[#00B8D9] top-6 left-[50%] animate-food-eaten-3" />
    <div className="absolute w-2 h-2 rounded-full bg-[#CF304A] top-14 left-[65%] animate-food-eaten-4" />
    {/* Player cell */}
    <div className="absolute top-1/2 -translate-y-1/2 animate-cell-move-right">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30 animate-cell-grow" />
    </div>
    {/* Label */}
    <div className="absolute bottom-2 right-2 text-[10px] text-[#848E9C] ">Eat food to grow</div>
  </div>
);

// Eating Player Animation
const EatPlayerDemo = () => (
  <div className="relative h-24 bg-[#0B0E11] rounded-xl overflow-hidden">
    {/* Big player */}
    <div className="absolute top-1/2 -translate-y-1/2 left-4 animate-predator-chase">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30 flex items-center justify-center">
        <span className="text-[8px] font-bold text-black/70">YOU</span>
      </div>
    </div>
    {/* Small player getting eaten */}
    <div className="absolute top-1/2 -translate-y-1/2 right-8 animate-prey-eaten">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#CF304A] to-[#FF6B6B] shadow-lg shadow-[#CF304A]/30" />
    </div>
    {/* Token transfer effect */}
    <div className="absolute top-1/2 -translate-y-1/2 right-16 animate-token-transfer opacity-0">
      <BNBLogo className="w-4 h-4 text-[#F0B90B]" />
    </div>
    {/* Label */}
    <div className="absolute bottom-2 right-2 text-[10px] text-[#848E9C] ">Eat players, steal tokens!</div>
  </div>
);

// Split Attack Animation
const SplitDemo = () => (
  <div className="relative h-24 bg-[#0B0E11] rounded-xl overflow-hidden">
    {/* Original cell that splits */}
    <div className="absolute top-1/2 -translate-y-1/2 left-8">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30 animate-split-origin" />
    </div>
    {/* Split cell shooting forward */}
    <div className="absolute top-1/2 -translate-y-1/2 left-8 animate-split-projectile">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30" />
    </div>
    {/* Target being caught */}
    <div className="absolute top-1/2 -translate-y-1/2 right-6 animate-split-target">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00B8D9] to-[#4DD0E1] shadow-lg shadow-[#00B8D9]/30" />
    </div>
    {/* Space key indicator */}
    <div className="absolute top-2 left-2 px-2 py-1 bg-[#2B3139] rounded text-[10px] text-[#F0B90B] font-mono animate-pulse">SPACE</div>
    {/* Label */}
    <div className="absolute bottom-2 right-2 text-[10px] text-[#848E9C] ">Split to catch prey</div>
  </div>
);

// Mass Decay Animation
const DecayDemo = () => (
  <div className="relative h-24 bg-[#0B0E11] rounded-xl overflow-hidden">
    {/* Shrinking cell */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30 animate-cell-decay" />
    </div>
    {/* Decay particles */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-2 h-2 rounded-full bg-[#F0B90B]/50 animate-decay-particle-1" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#F0B90B]/50 animate-decay-particle-2" />
      <div className="w-2 h-2 rounded-full bg-[#F0B90B]/50 animate-decay-particle-3" />
    </div>
    {/* Decay indicator */}
    <div className="absolute top-2 right-2 text-[10px] text-[#CF304A] animate-pulse whitespace-nowrap">-1%/sec</div>
    {/* Label */}
    <div className="absolute bottom-2 right-2 text-[10px] text-[#848E9C] ">Big cells lose mass</div>
  </div>
);

// Speed Boost Animation
const SpeedBoostDemo = () => (
  <div className="relative h-24 bg-[#0B0E11] rounded-xl overflow-hidden">
    {/* Speed lines */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F0B90B]/30 to-transparent animate-speed-line-1" />
      <div className="absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F0B90B]/20 to-transparent animate-speed-line-2" />
      <div className="absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F0B90B]/30 to-transparent animate-speed-line-3" />
      <div className="absolute top-16 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#F0B90B]/20 to-transparent animate-speed-line-4" />
    </div>
    {/* Boosted cell */}
    <div className="absolute top-1/2 -translate-y-1/2 animate-speed-boost-cell">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/50 ring-2 ring-[#F0B90B]/50 animate-pulse" />
    </div>
    {/* Key indicator */}
    <div className="absolute top-2 left-2 px-2 py-1 bg-[#2B3139] rounded text-[10px] text-[#F0B90B] font-mono">1</div>
    {/* +30% badge */}
    <div className="absolute top-2 right-2 px-2 py-1 bg-[#F0B90B]/20 rounded text-[10px] text-[#F0B90B] font-bold whitespace-nowrap">+30%</div>
    {/* Label */}
    <div className="absolute bottom-2 right-2 text-[10px] text-[#848E9C] ">Speed boost for 60s</div>
  </div>
);

// Shield Animation
const ShieldDemo = () => (
  <div className="relative h-24 bg-[#0B0E11] rounded-xl overflow-hidden">
    {/* Shielded cell */}
    <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30" />
        {/* Shield effect */}
        <div className="absolute -inset-2 rounded-full border-2 border-[#00B8D9] animate-shield-pulse opacity-70" />
        <div className="absolute -inset-3 rounded-full border border-[#00B8D9]/50 animate-shield-pulse-delay" />
      </div>
    </div>
    {/* Attacker bouncing off */}
    <div className="absolute top-1/2 right-4 -translate-y-1/2 animate-attacker-bounce">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CF304A] to-[#FF6B6B] shadow-lg shadow-[#CF304A]/30" />
    </div>
    {/* Block text */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00B8D9] font-bold text-xs animate-block-text opacity-0 whitespace-nowrap">BLOCKED!</div>
    {/* Key indicator */}
    <div className="absolute top-2 left-2 px-2 py-1 bg-[#2B3139] rounded text-[10px] text-[#00B8D9] font-mono">2</div>
    {/* Label */}
    <div className="absolute bottom-2 right-2 text-[10px] text-[#848E9C] ">Shield blocks 1 attack</div>
  </div>
);

// Cash Out Animation
const CashOutDemo = () => (
  <div className="relative h-24 bg-[#0B0E11] rounded-xl overflow-hidden">
    {/* Player cell */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#03A66D] to-[#4CAF50] shadow-lg shadow-[#03A66D]/30 animate-cashout-glow" />
    </div>
    {/* Progress ring */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#2B3139" strokeWidth="4" />
        <circle
          cx="50" cy="50" r="45" fill="none" stroke="#F0B90B" strokeWidth="4"
          strokeDasharray="283"
          className="animate-cashout-progress"
        />
      </svg>
    </div>
    {/* Token flying out */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-token-fly-out opacity-0">
      <BNBLogo className="w-6 h-6 text-[#F0B90B]" />
    </div>
    {/* Key indicator */}
    <div className="absolute top-2 left-2 px-2 py-1 bg-[#2B3139] rounded text-[10px] text-[#F0B90B] font-mono animate-pulse whitespace-nowrap">HOLD C</div>
    {/* Timer */}
    <div className="absolute top-2 right-2 text-[10px] text-[#03A66D] font-mono animate-cashout-timer whitespace-nowrap">10s</div>
    {/* Label */}
    <div className="absolute bottom-2 right-2 text-[10px] text-[#848E9C] ">Cash out your tokens</div>
  </div>
);

// Death Animation
const DeathDemo = () => (
  <div className="relative h-24 bg-[#0B0E11] rounded-xl overflow-hidden">
    {/* Big predator */}
    <div className="absolute top-1/2 -translate-y-1/2 animate-death-predator">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#CF304A] to-[#FF6B6B] shadow-lg shadow-[#CF304A]/30 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white/70">ENEMY</span>
      </div>
    </div>
    {/* Victim exploding */}
    <div className="absolute top-1/2 right-12 -translate-y-1/2 animate-death-victim">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F0B90B] to-[#FFD54F] shadow-lg shadow-[#F0B90B]/30" />
    </div>
    {/* Explosion particles */}
    <div className="absolute top-1/2 right-12 -translate-y-1/2">
      <div className="w-2 h-2 rounded-full bg-[#F0B90B] animate-explode-1 opacity-0" />
      <div className="w-2 h-2 rounded-full bg-[#F0B90B] animate-explode-2 opacity-0" />
      <div className="w-2 h-2 rounded-full bg-[#F0B90B] animate-explode-3 opacity-0" />
      <div className="w-2 h-2 rounded-full bg-[#F0B90B] animate-explode-4 opacity-0" />
    </div>
    {/* Lost tokens */}
    <div className="absolute top-2 right-2 text-[10px] text-[#CF304A] font-bold animate-pulse whitespace-nowrap">-50K CELL</div>
    {/* Label */}
    <div className="absolute bottom-2 right-2 text-[10px] text-[#848E9C] ">Death = Lose all tokens!</div>
  </div>
);

// ========== END ANIMATED DEMOS ==========

// Game Tutorial Panel
const TutorialPanel = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Panel */}
    <div className="relative glass-card p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">📖</span>
          Game Guide
        </h2>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-[#2B3139] hover:bg-[#3B4149] flex items-center justify-center text-[#848E9C] hover:text-white transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Gameplay Section */}
      <div className="space-y-6">
        {/* Basic Movement */}
        <div className="glass-card p-5 bg-[#1E2329]/50">
          <h3 className="text-lg font-bold text-[#F0B90B] mb-3 flex items-center gap-2">
            <span>🎮</span> Basic Controls
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1.5 bg-[#2B3139] rounded-lg text-[#F0B90B] font-mono">Mouse</kbd>
              <span className="text-[#848E9C]">Move your cell</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1.5 bg-[#2B3139] rounded-lg text-[#F0B90B] font-mono">Space</kbd>
              <span className="text-[#848E9C]">Split into two</span>
            </div>
          </div>
        </div>

        {/* Eating Food - with Animation */}
        <div className="glass-card p-5 bg-[#1E2329]/50">
          <h3 className="text-lg font-bold text-[#03A66D] mb-3 flex items-center gap-2">
            <span>🍽️</span> Eat Food
          </h3>
          <EatFoodDemo />
          <p className="text-[#848E9C] text-sm mt-3">
            Collect colored dots scattered around the map to gain mass and grow bigger.
          </p>
        </div>

        {/* Eating Players - with Animation */}
        <div className="glass-card p-5 bg-[#1E2329]/50">
          <h3 className="text-lg font-bold text-[#F0B90B] mb-3 flex items-center gap-2">
            <span>👾</span> Eat Players
          </h3>
          <EatPlayerDemo />
          <p className="text-[#848E9C] text-sm mt-3">
            You must be <strong className="text-white">10% larger</strong> to consume another player.
            Eating them steals their entry fee tokens!
          </p>
        </div>

        {/* Split Attack - with Animation */}
        <div className="glass-card p-5 bg-[#1E2329]/50">
          <h3 className="text-lg font-bold text-[#00B8D9] mb-3 flex items-center gap-2">
            <span>💥</span> Split Attack
          </h3>
          <SplitDemo />
          <p className="text-[#848E9C] text-sm mt-3">
            Press <kbd className="px-2 py-0.5 bg-[#2B3139] rounded text-[#F0B90B] font-mono mx-1">Space</kbd>
            to split and shoot forward. Great for catching prey! Cells merge back over time.
          </p>
        </div>

        {/* Mass Decay - with Animation */}
        <div className="glass-card p-5 bg-[#1E2329]/50">
          <h3 className="text-lg font-bold text-[#CF304A] mb-3 flex items-center gap-2">
            <span>📉</span> Mass Decay
          </h3>
          <DecayDemo />
          <p className="text-[#848E9C] text-sm mt-3">
            Larger cells slowly lose mass over time. Keep eating to maintain your size!
          </p>
        </div>

        {/* Power-ups Section */}
        <div className="glass-card p-5 bg-[#1E2329]/50">
          <h3 className="text-lg font-bold text-[#F0B90B] mb-4 flex items-center gap-2">
            <span>⚡</span> Power-Ups
          </h3>
          <div className="grid gap-4">
            {/* Speed Boost */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <kbd className="w-8 h-8 bg-[#2B3139] rounded-lg flex items-center justify-center text-[#F0B90B] font-mono font-bold text-sm">1</kbd>
                <span className="text-white font-medium">Speed Boost</span>
                <span className="text-[#848E9C] text-xs">+30% for 60s</span>
              </div>
              <SpeedBoostDemo />
            </div>
            {/* Shield */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <kbd className="w-8 h-8 bg-[#2B3139] rounded-lg flex items-center justify-center text-[#00B8D9] font-mono font-bold text-sm">2</kbd>
                <span className="text-white font-medium">Shield</span>
                <span className="text-[#848E9C] text-xs">Block 1 attack</span>
              </div>
              <ShieldDemo />
            </div>
          </div>
        </div>

        {/* Cash Out - with Animation */}
        <div className="glass-card p-5 bg-gradient-to-r from-[#F0B90B]/10 to-[#03A66D]/10 border-[#F0B90B]/30">
          <h3 className="text-lg font-bold text-[#F0B90B] mb-3 flex items-center gap-2">
            <span>💰</span> Cash Out
          </h3>
          <CashOutDemo />
          <div className="flex items-center gap-4 mt-3 mb-2">
            <kbd className="px-4 py-2 bg-[#2B3139] rounded-lg text-[#F0B90B] font-mono font-bold text-lg">Hold C</kbd>
            <span className="text-white font-medium">for 10 seconds</span>
          </div>
          <p className="text-[#848E9C] text-sm">
            Successfully cash out to withdraw your tokens. <strong className="text-[#CF304A]">Warning: You cannot move while cashing out!</strong>
          </p>
        </div>

        {/* Death Warning - with Animation */}
        <div className="glass-card p-5 bg-[#CF304A]/10 border border-[#CF304A]/30">
          <h3 className="text-lg font-bold text-[#CF304A] mb-3 flex items-center gap-2">
            <span>💀</span> Death = Loss
          </h3>
          <DeathDemo />
          <p className="text-[#848E9C] text-sm mt-3">
            If you get eaten, you lose <strong className="text-[#CF304A]">ALL tokens</strong> from this session! Play carefully.
          </p>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full mt-6 bnb-button py-3"
      >
        Got it, let's play!
      </button>
    </div>
  </div>
);

function GamePage({
  address,
  playerName,
  isGuest,
  onConnect,
  onDeath,
  onCashOut,
  onExit
}) {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);

  const handleExit = () => {
    onExit();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] relative">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-[#0B0E11] via-[#0B0E11]/80 to-transparent">
        {/* Left: Logo & Home Button */}
        <button
          onClick={handleExit}
          className="flex items-center gap-3 text-[#848E9C] hover:text-white transition-colors group"
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1E2329]/80 group-hover:bg-[#2B3139] transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-sm font-medium">Home</span>
          </div>
        </button>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <BNBLogo className="w-6 h-6 text-[#F0B90B]" />
          <span className="font-bold">
            <span className="text-[#F0B90B]">CELL</span>
            <span className="text-white">FI</span>
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Help Button */}
          <button
            onClick={() => setShowTutorial(true)}
            className="w-10 h-10 rounded-xl bg-[#1E2329]/80 hover:bg-[#2B3139] flex items-center justify-center text-[#848E9C] hover:text-[#F0B90B] transition-all"
            title="Game Guide"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
          </button>

          {/* Guest Mode Badge */}
          {isGuest && (
            <div className="glass-card px-3 py-2 flex items-center gap-2 bg-[#1E2329]/80">
              <span className="text-base">👤</span>
              <span className="text-white text-sm font-medium">Guest</span>
            </div>
          )}

          {/* Wallet Status */}
          {!isGuest && <WalletConnect onConnect={onConnect} />}

          {/* Exit Button */}
          <button
            onClick={handleExit}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-[#CF304A]/20 hover:bg-[#CF304A]/30 text-[#CF304A] border border-[#CF304A]/30 hover:border-[#CF304A]/50 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            <span className="text-sm font-medium">Exit</span>
          </button>
        </div>
      </div>

      {/* Bottom Quick Tips */}
      <div className="absolute bottom-4 left-4 z-40 flex items-center gap-2">
        <div className="glass-card px-2.5 py-1.5 bg-[#1E2329]/90 flex items-center gap-1.5 text-[10px]">
          <kbd className="px-1.5 py-0.5 bg-[#2B3139] rounded text-[#F0B90B] font-mono">?</kbd>
          <span className="text-[#5E6673]">Help</span>
        </div>
        <div className="glass-card px-2.5 py-1.5 bg-[#1E2329]/90 flex items-center gap-1.5 text-[10px]">
          <kbd className="px-1.5 py-0.5 bg-[#2B3139] rounded text-[#F0B90B] font-mono">C</kbd>
          <span className="text-[#5E6673]">Cash Out</span>
        </div>
        <div className="glass-card px-2.5 py-1.5 bg-[#1E2329]/90 flex items-center gap-1.5 text-[10px]">
          <kbd className="px-1.5 py-0.5 bg-[#2B3139] rounded text-[#F0B90B] font-mono">Space</kbd>
          <span className="text-[#5E6673]">Split</span>
        </div>
      </div>

      {/* Tutorial Panel */}
      {showTutorial && <TutorialPanel onClose={() => setShowTutorial(false)} />}

      {/* Game Component */}
      <Game
        address={address}
        playerName={playerName}
        isGuest={isGuest}
        onDeath={onDeath}
        onCashOut={onCashOut}
        onExit={handleExit}
      />
    </div>
  );
}

export default GamePage;

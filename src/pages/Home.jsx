import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Floating Cells Background Component
const FloatingCells = () => (
  <div className="floating-cells">
    <div className="floating-cell"></div>
    <div className="floating-cell"></div>
    <div className="floating-cell"></div>
    <div className="floating-cell"></div>
    <div className="floating-cell"></div>
    <div className="floating-cell"></div>
  </div>
);

// Battle Animation Component
const BattleAnimation = () => (
  <div className="battle-scene my-6">
    <div className="cell-big"></div>
    <div className="cell-small"></div>
  </div>
);

function Home({ address, gameResult, setGameResult, playerName, setPlayerName, onStartGame, onGuestPlay }) {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    onStartGame();
    navigate('/play');
  };

  const handleGuestClick = () => {
    onGuestPlay();
    navigate('/play');
  };

  return (
    <section className="min-h-[calc(100vh-80px)] relative overflow-hidden flex items-center justify-center">
      <FloatingCells />

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#F0B90B]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#F0B90B]/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-8 py-16">
        {/* Game Result Banner */}
        {gameResult && (
          <div
            className={`rounded-2xl border ${
              gameResult.type === 'death'
                ? 'bg-[#CF304A]/10 border-[#CF304A]/30'
                : 'bg-[#03A66D]/10 border-[#03A66D]/30'
            } animate-slide-up`}
            style={{ marginBottom: '32px', padding: '20px' }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                gameResult.type === 'death' ? 'bg-[#CF304A]/20' : 'bg-[#03A66D]/20'
              }`}>
                {gameResult.type === 'death' ? '💀' : '💰'}
              </div>
              <div>
                <h3 className={`font-semibold text-base ${
                  gameResult.type === 'death' ? 'text-[#CF304A]' : 'text-[#03A66D]'
                }`}>
                  {gameResult.type === 'death' ? 'Game Over!' : 'Cash Out Success!'}
                </h3>
                <p className="text-[#848E9C] text-sm">
                  {gameResult.type === 'death'
                    ? `You were eaten by ${gameResult.data?.killerName || 'another player'}`
                    : `You earned ${gameResult.data?.amount?.toLocaleString() || 0} CELL`}
                </p>
              </div>
              <button
                onClick={() => setGameResult(null)}
                className="ml-auto text-[#848E9C] hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 items-center" style={{ gap: '64px' }}>
          {/* Left Side - Hero */}
          <div className="text-center lg:text-left">
            <div className="animate-slide-up" style={{ marginBottom: '20px' }}>
              <span className="badge badge-yellow text-xs">
                <span className="w-1.5 h-1.5 bg-[#F0B90B] rounded-full animate-pulse"></span>
                Live on BSC Testnet
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight animate-slide-up" style={{ marginBottom: '20px', animationDelay: '0.1s', lineHeight: '1.1' }}>
              <span className="bnb-gradient">Eat.</span>
              <br />
              <span className="text-white">Grow.</span>
              <br />
              <span className="bnb-gradient">Earn.</span>
            </h1>

            <p className="text-lg text-[#848E9C] max-w-md mx-auto lg:mx-0 animate-slide-up leading-relaxed" style={{ marginBottom: '32px', animationDelay: '0.2s' }}>
              The classic .io game meets blockchain. Consume other players, grow bigger,
              and <span className="text-[#F0B90B] font-medium">cash out real CELL tokens</span>.
            </p>

            {/* Battle Animation - Mobile */}
            <div className="lg:hidden" style={{ marginBottom: '32px' }}>
              <BattleAnimation />
            </div>

            {/* Name Input & Buttons */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={15}
                style={{ marginBottom: '20px' }}
                className="bnb-input w-full max-w-md text-center lg:text-left"
              />

              <div className="flex flex-col sm:flex-row max-w-md mx-auto lg:mx-0" style={{ gap: '12px', marginBottom: '16px' }}>
                <button
                  onClick={handlePlayClick}
                  className="bnb-button flex-1 py-3.5 animate-pulse-glow flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>
                  </svg>
                  Play Now
                </button>

                <button
                  onClick={handleGuestClick}
                  className="secondary-button py-3.5 flex items-center justify-center gap-2"
                >
                  <span>👤</span>
                  Try Free
                </button>
              </div>

              <p className="text-xs text-[#5E6673] text-center lg:text-left">
                Guest mode: No wallet needed, no real tokens
              </p>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="hidden lg:block">
            <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card p-5" style={{ marginBottom: '24px' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#848E9C] text-xs font-medium uppercase tracking-wider">Live Battle</span>
                  <span className="badge badge-red text-xs">
                    <span className="w-1.5 h-1.5 bg-[#CF304A] rounded-full animate-pulse"></span>
                    PvP
                  </span>
                </div>
                <BattleAnimation />
                <p className="text-center text-[#5E6673] mt-3 text-xs">
                  Big fish eats small fish. Stay alert!
                </p>
              </div>

              <div className="flex justify-center" style={{ gap: '16px' }}>
                <div className="glass-card px-5 py-3 text-center glass-card-hover">
                  <div className="text-xl font-bold text-[#F0B90B]">50K</div>
                  <div className="text-[10px] text-[#5E6673] uppercase tracking-wider">Entry Fee</div>
                </div>
                <div className="glass-card px-5 py-3 text-center glass-card-hover">
                  <div className="text-xl font-bold text-[#03A66D]">10s</div>
                  <div className="text-[10px] text-[#5E6673] uppercase tracking-wider">Cash Out</div>
                </div>
                <div className="glass-card px-5 py-3 text-center glass-card-hover">
                  <div className="text-xl font-bold text-[#00B8D9]">100%</div>
                  <div className="text-[10px] text-[#5E6673] uppercase tracking-wider">Pool Share</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <Link
            to="/how-to-play"
            className="text-[#5E6673] hover:text-[#F0B90B] transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;

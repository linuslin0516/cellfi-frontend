function HowToPlay() {
  return (
    <section className="py-24 px-6 relative flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <span className="badge badge-yellow text-xs" style={{ marginBottom: '16px', display: 'inline-flex' }}>Tutorial</span>
          <h2 className="text-3xl font-bold text-white tracking-tight" style={{ marginBottom: '12px' }}>How to Play</h2>
          <p className="text-[#848E9C] max-w-xl mx-auto">
            Master the arena in 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4" style={{ gap: '20px', marginBottom: '64px' }}>
          <div className="feature-card text-center p-5">
            <div className="feature-icon bg-[#F0B90B]/20 mx-auto mb-3">
              <span>💰</span>
            </div>
            <h3 className="text-white font-semibold mb-1">1. Pay Entry</h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              Connect wallet and pay 50,000 CELL to enter.
            </p>
          </div>

          <div className="feature-card text-center p-5">
            <div className="feature-icon bg-[#03A66D]/20 mx-auto mb-3">
              <span>🎯</span>
            </div>
            <h3 className="text-white font-semibold mb-1">2. Eat & Grow</h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              Move with mouse. Consume food and players.
            </p>
          </div>

          <div className="feature-card text-center p-5">
            <div className="feature-icon bg-[#00B8D9]/20 mx-auto mb-3">
              <span>⚔️</span>
            </div>
            <h3 className="text-white font-semibold mb-1">3. Battle</h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              Use Speed Boost and Shield power-ups.
            </p>
          </div>

          <div className="feature-card text-center p-5">
            <div className="feature-icon bg-[#CF304A]/20 mx-auto mb-3">
              <span>💎</span>
            </div>
            <h3 className="text-white font-semibold mb-1">4. Cash Out</h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              Hold C for 10s to withdraw earnings.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card p-6" style={{ marginBottom: '64px' }}>
          <h3 className="text-lg font-semibold text-white text-center" style={{ marginBottom: '20px' }}>Controls</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 justify-items-center" style={{ gap: '20px' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center shrink-0">
                <span className="text-[#848E9C] text-sm">🖱️</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium">Mouse</div>
                <div className="text-[#5E6673] text-xs">Move</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center text-[#F0B90B] font-mono text-[10px] shrink-0">
                Space
              </kbd>
              <div>
                <div className="text-white text-sm font-medium">Spacebar</div>
                <div className="text-[#5E6673] text-xs">Split</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center text-[#F0B90B] font-mono text-lg shrink-0">
                C
              </kbd>
              <div>
                <div className="text-white text-sm font-medium">Hold C</div>
                <div className="text-[#5E6673] text-xs">Cash Out</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center text-[#F0B90B] font-mono text-sm shrink-0">
                1/2
              </kbd>
              <div>
                <div className="text-white text-sm font-medium">1 or 2</div>
                <div className="text-[#5E6673] text-xs">Power-ups</div>
              </div>
            </div>
          </div>
        </div>

        {/* Power-ups */}
        <div>
          <h3 className="text-lg font-semibold text-white text-center" style={{ marginBottom: '20px' }}>Power-Ups</h3>
          <div className="grid md:grid-cols-2" style={{ gap: '20px' }}>
            <div className="glass-card p-5 flex items-center gap-4 glass-card-hover">
              <div className="w-12 h-12 rounded-xl bg-[#F0B90B]/20 flex items-center justify-center text-xl shrink-0">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-[#F0B90B] font-semibold text-sm">Speed Boost</h4>
                  <kbd className="px-1.5 py-0.5 bg-[#2B3139] rounded text-[#5E6673] text-[10px] font-mono">1</kbd>
                </div>
                <p className="text-[#848E9C] text-xs">+30% movement speed for 60 seconds</p>
              </div>
            </div>

            <div className="glass-card p-5 flex items-center gap-4 glass-card-hover">
              <div className="w-12 h-12 rounded-xl bg-[#00B8D9]/20 flex items-center justify-center text-xl shrink-0">
                🛡️
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-[#00B8D9] font-semibold text-sm">Shield</h4>
                  <kbd className="px-1.5 py-0.5 bg-[#2B3139] rounded text-[#5E6673] text-[10px] font-mono">2</kbd>
                </div>
                <p className="text-[#848E9C] text-xs">Block one fatal attack from enemies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowToPlay;

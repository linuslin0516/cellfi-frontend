function Whitepaper() {
  return (
    <section className="py-24 px-6 bg-[#0D1117] relative min-h-[calc(100vh-80px)] flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <span className="badge badge-yellow text-xs" style={{ marginBottom: '12px', display: 'inline-flex' }}>Documentation</span>
          <h2 className="text-3xl font-bold text-white tracking-tight" style={{ marginBottom: '12px' }}>Whitepaper</h2>
          <p className="text-[#848E9C]">
            Understanding the CellFi ecosystem
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Introduction */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-[#F0B90B] flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <span className="w-6 h-6 rounded bg-[#F0B90B]/20 flex items-center justify-center text-xs">1</span>
              Introduction
            </h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              CellFi is a Play-to-Earn game built on BNB Smart Chain that combines the addictive gameplay
              of classic .io games with blockchain technology. Players compete in real-time PvP battles,
              consuming smaller players to grow larger while risking their CELL tokens in the process.
            </p>
          </div>

          {/* Game Mechanics */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-[#F0B90B] flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <span className="w-6 h-6 rounded bg-[#F0B90B]/20 flex items-center justify-center text-xs">2</span>
              Game Mechanics
            </h3>
            <ul className="text-[#848E9C] text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li className="flex items-start gap-2">
                <span className="text-[#03A66D]">●</span>
                <span><strong className="text-white">Entry Fee:</strong> Players pay 50,000 CELL to enter the game arena.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#03A66D]">●</span>
                <span><strong className="text-white">Pool System:</strong> 100% of entry fees go into the game pool.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#03A66D]">●</span>
                <span><strong className="text-white">PvP Combat:</strong> Players must be 10% larger to consume another player.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#03A66D]">●</span>
                <span><strong className="text-white">Cash Out:</strong> Hold C for 10 seconds to safely withdraw earnings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#CF304A]">●</span>
                <span><strong className="text-white">Risk:</strong> If eaten, you lose all tokens in that session.</span>
              </li>
            </ul>
          </div>

          {/* Reward Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-[#F0B90B] flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <span className="w-6 h-6 rounded bg-[#F0B90B]/20 flex items-center justify-center text-xs">3</span>
              Reward Distribution
            </h3>
            <p className="text-[#848E9C] text-sm leading-relaxed" style={{ marginBottom: '12px' }}>
              When a player successfully cashes out, their reward is calculated based on their mass
              relative to all living players in the arena:
            </p>
            <div className="bg-[#0B0E11] rounded-lg p-3 font-mono text-sm text-center">
              <span className="text-[#848E9C]">Reward = </span>
              <span className="text-[#F0B90B]">GamePool</span>
              <span className="text-white"> × </span>
              <span className="text-[#03A66D]">(YourMass / TotalMass)</span>
            </div>
          </div>

          {/* Security */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-[#F0B90B] flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <span className="w-6 h-6 rounded bg-[#F0B90B]/20 flex items-center justify-center text-xs">4</span>
              Security
            </h3>
            <ul className="text-[#848E9C] text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li className="flex items-start gap-2">
                <span className="text-[#00B8D9]">🔒</span>
                <span>Smart contract secured by OpenZeppelin standards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00B8D9]">🔒</span>
                <span>Server-side game state validation prevents cheating</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00B8D9]">🔒</span>
                <span>Transaction verification before joining games</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Whitepaper;

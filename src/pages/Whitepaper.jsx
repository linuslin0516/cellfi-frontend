import { useLanguage } from '../i18n';

function Whitepaper() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 bg-[#0D1117] relative min-h-[calc(100vh-80px)] flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <span className="badge badge-yellow text-xs" style={{ marginBottom: '12px', display: 'inline-flex' }}>{t('whitepaper.badge')}</span>
          <h2 className="text-3xl font-bold text-white tracking-tight" style={{ marginBottom: '12px' }}>{t('whitepaper.title')}</h2>
          <p className="text-[#848E9C]">
            {t('whitepaper.subtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Introduction */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-[#F0B90B] flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <span className="w-6 h-6 rounded bg-[#F0B90B]/20 flex items-center justify-center text-xs">1</span>
              {t('whitepaper.sections.intro.title')}
            </h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              {t('whitepaper.sections.intro.content')}
            </p>
          </div>

          {/* Game Mechanics */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-[#F0B90B] flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <span className="w-6 h-6 rounded bg-[#F0B90B]/20 flex items-center justify-center text-xs">2</span>
              {t('whitepaper.sections.gameplay.title')}
            </h3>
            <ul className="text-[#848E9C] text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li className="flex items-start gap-2">
                <span className="text-[#03A66D]">●</span>
                <span><strong className="text-white">{t('whitepaper.sections.gameplay.entryFee')}</strong> {t('whitepaper.sections.gameplay.entryFeeDesc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#03A66D]">●</span>
                <span><strong className="text-white">{t('whitepaper.sections.gameplay.poolSystem')}</strong> {t('whitepaper.sections.gameplay.poolSystemDesc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#03A66D]">●</span>
                <span><strong className="text-white">{t('whitepaper.sections.gameplay.pvpCombat')}</strong> {t('whitepaper.sections.gameplay.pvpCombatDesc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#03A66D]">●</span>
                <span><strong className="text-white">{t('whitepaper.sections.gameplay.cashOut')}</strong> {t('whitepaper.sections.gameplay.cashOutDesc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#CF304A]">●</span>
                <span><strong className="text-white">{t('whitepaper.sections.gameplay.risk')}</strong> {t('whitepaper.sections.gameplay.riskDesc')}</span>
              </li>
            </ul>
          </div>

          {/* Reward Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-[#F0B90B] flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <span className="w-6 h-6 rounded bg-[#F0B90B]/20 flex items-center justify-center text-xs">3</span>
              {t('whitepaper.sections.rewards.title')}
            </h3>
            <p className="text-[#848E9C] text-sm leading-relaxed" style={{ marginBottom: '12px' }}>
              {t('whitepaper.sections.rewards.desc')}
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
              {t('whitepaper.sections.security.title')}
            </h3>
            <ul className="text-[#848E9C] text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li className="flex items-start gap-2">
                <span className="text-[#00B8D9]">🔒</span>
                <span>{t('whitepaper.sections.security.item1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00B8D9]">🔒</span>
                <span>{t('whitepaper.sections.security.item2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00B8D9]">🔒</span>
                <span>{t('whitepaper.sections.security.item3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Whitepaper;

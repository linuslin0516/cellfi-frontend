import { useLanguage } from '../i18n';

function HowToPlay() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 relative flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <span className="badge badge-yellow text-xs" style={{ marginBottom: '16px', display: 'inline-flex' }}>{t('howToPlay.badge')}</span>
          <h2 className="text-3xl font-bold text-white tracking-tight" style={{ marginBottom: '12px' }}>{t('howToPlay.title')}</h2>
          <p className="text-[#848E9C] max-w-xl mx-auto">
            {t('howToPlay.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4" style={{ gap: '20px', marginBottom: '64px' }}>
          <div className="feature-card text-center p-5">
            <div className="feature-icon bg-[#F0B90B]/20 mx-auto mb-3">
              <span>💰</span>
            </div>
            <h3 className="text-white font-semibold mb-1">{t('howToPlay.steps.pay.title')}</h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              {t('howToPlay.steps.pay.desc')}
            </p>
          </div>

          <div className="feature-card text-center p-5">
            <div className="feature-icon bg-[#03A66D]/20 mx-auto mb-3">
              <span>🎯</span>
            </div>
            <h3 className="text-white font-semibold mb-1">{t('howToPlay.steps.eat.title')}</h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              {t('howToPlay.steps.eat.desc')}
            </p>
          </div>

          <div className="feature-card text-center p-5">
            <div className="feature-icon bg-[#00B8D9]/20 mx-auto mb-3">
              <span>⚔️</span>
            </div>
            <h3 className="text-white font-semibold mb-1">{t('howToPlay.steps.battle.title')}</h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              {t('howToPlay.steps.battle.desc')}
            </p>
          </div>

          <div className="feature-card text-center p-5">
            <div className="feature-icon bg-[#CF304A]/20 mx-auto mb-3">
              <span>💎</span>
            </div>
            <h3 className="text-white font-semibold mb-1">{t('howToPlay.steps.cashout.title')}</h3>
            <p className="text-[#848E9C] text-sm leading-relaxed">
              {t('howToPlay.steps.cashout.desc')}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card p-6" style={{ marginBottom: '64px' }}>
          <h3 className="text-lg font-semibold text-white text-center" style={{ marginBottom: '20px' }}>{t('howToPlay.controls')}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 justify-items-center" style={{ gap: '20px' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center shrink-0">
                <span className="text-[#848E9C] text-sm">🖱️</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium">{t('howToPlay.controlsList.mouse')}</div>
                <div className="text-[#5E6673] text-xs">{t('howToPlay.controlsList.mouseAction')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center text-[#F0B90B] font-mono text-[10px] shrink-0">
                Space
              </kbd>
              <div>
                <div className="text-white text-sm font-medium">{t('howToPlay.controlsList.space')}</div>
                <div className="text-[#5E6673] text-xs">{t('howToPlay.controlsList.spaceAction')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="w-10 h-10 rounded-lg bg-[#2B3139] flex items-center justify-center text-[#F0B90B] font-mono text-lg shrink-0">
                C
              </kbd>
              <div>
                <div className="text-white text-sm font-medium">{t('howToPlay.controlsList.holdC')}</div>
                <div className="text-[#5E6673] text-xs">{t('howToPlay.controlsList.holdCAction')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowToPlay;

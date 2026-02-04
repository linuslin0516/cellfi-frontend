import { useLanguage } from '../i18n';

function Tokenomics() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 relative min-h-[calc(100vh-80px)] flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <span className="badge badge-yellow text-xs" style={{ marginBottom: '12px', display: 'inline-flex' }}>{t('tokenomics.badge')}</span>
          <h2 className="text-3xl font-bold text-white tracking-tight" style={{ marginBottom: '12px' }}>{t('tokenomics.title')}</h2>
          <p className="text-[#848E9C]">
            {t('tokenomics.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2" style={{ gap: '24px', marginBottom: '48px' }}>
          {/* Token Info */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-white" style={{ marginBottom: '16px' }}>{t('tokenomics.tokenInfo')}</h3>
            <div className="space-y-0">
              <div className="flex justify-between items-center py-2.5 border-b border-[#2B3139]">
                <span className="text-[#848E9C] text-sm">{t('tokenomics.name')}</span>
                <span className="text-white font-medium text-sm">CELLFI</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-[#2B3139]">
                <span className="text-[#848E9C] text-sm">{t('tokenomics.symbol')}</span>
                <span className="text-[#F0B90B] font-medium text-sm">CELL</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-[#2B3139]">
                <span className="text-[#848E9C] text-sm">{t('tokenomics.network')}</span>
                <span className="text-white font-medium text-sm">BNB Smart Chain</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-[#2B3139]">
                <span className="text-[#848E9C] text-sm">{t('tokenomics.totalSupply')}</span>
                <span className="text-white font-medium text-sm">1,000,000,000</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-[#848E9C] text-sm">{t('tokenomics.transferTax')}</span>
                <span className="text-[#F0B90B] font-medium text-sm">3%</span>
              </div>
            </div>
          </div>

          {/* Tax Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-white" style={{ marginBottom: '16px' }}>{t('tokenomics.taxTitle')}</h3>
            <div style={{ marginBottom: '16px' }}>
              <div className="flex justify-between mb-1.5 text-sm">
                <span className="text-[#848E9C]">{t('tokenomics.devMarketing')}</span>
                <span className="text-[#F0B90B] font-medium">100%</span>
              </div>
              <div className="h-2 bg-[#2B3139] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#F0B90B] to-[#FFD54F] w-full"></div>
              </div>
            </div>
            <p className="text-[#848E9C] text-xs leading-relaxed" style={{ marginBottom: '16px' }}>
              {t('tokenomics.taxDesc')}
            </p>

            <div className="p-3 bg-[#03A66D]/10 border border-[#03A66D]/20 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">✓</span>
                <div>
                  <div className="text-[#03A66D] font-medium text-sm">{t('tokenomics.operatorTaxFree')}</div>
                  <div className="text-[#848E9C] text-xs">{t('tokenomics.operatorTaxFreeDesc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="glass-card p-5 border-[#CF304A]/30 bg-[#CF304A]/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#CF304A]/20 flex items-center justify-center text-xl shrink-0">
              ⚠️
            </div>
            <div>
              <h3 className="text-[#CF304A] font-medium text-sm mb-0.5">{t('tokenomics.riskTitle')}</h3>
              <p className="text-[#848E9C] text-xs leading-relaxed">
                {t('tokenomics.riskDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Tokenomics;

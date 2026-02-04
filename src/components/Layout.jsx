import { Link, useLocation } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import LanguageSwitcher from './LanguageSwitcher';
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

function Layout({ children, onConnect }) {
  const location = useLocation();
  const { t } = useLanguage();

  const navLinks = [
    { path: '/', labelKey: 'nav.home' },
    { path: '/how-to-play', labelKey: 'nav.howToPlay' },
    { path: '/whitepaper', labelKey: 'nav.whitepaper' },
    { path: '/tokenomics', labelKey: 'nav.tokenomics' },
    { path: '/play', labelKey: 'nav.play', highlight: true },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E11] flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#0B0E11]/95 backdrop-blur-lg border-b border-[#2B3139]/50">
        <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <BNBLogo className="w-8 h-8 text-[#F0B90B]" />
            <span className="text-xl font-bold">
              <span className="text-[#F0B90B]">CELL</span>
              <span className="text-white">FI</span>
            </span>
          </Link>

          {/* Navigation Links - Centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(link => (
              link.highlight ? (
                <Link
                  key={link.path}
                  to={link.path}
                  className="bnb-button py-2 px-6 text-sm"
                >
                  {t(link.labelKey)}
                </Link>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#F0B90B]'
                      : 'text-[#848E9C] hover:text-white'
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              )
            ))}
          </nav>

          {/* Right Side - Language Switcher & Wallet */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <WalletConnect onConnect={onConnect} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default Layout;

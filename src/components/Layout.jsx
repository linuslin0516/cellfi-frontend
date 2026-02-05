import { Link, useLocation } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../i18n';

// CellFi Logo Component
const CellFiLogo = ({ className = "", style = {} }) => (
  <img src="/cellfi-logo.svg" alt="CellFi" className={className} style={style} />
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
            <CellFiLogo className="w-8 h-8" />
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

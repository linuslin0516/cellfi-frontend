import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n';

function LanguageSwitcher() {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 當前語言
  const currentLang = languages.find(l => l.code === language) || languages[0];

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 觸發按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1E2329] hover:bg-[#2B3139] border border-[#2B3139] transition-all"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span className="text-[#848E9C] text-sm hidden sm:inline">{currentLang.label}</span>
        <svg
          className={`w-4 h-4 text-[#848E9C] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#1E2329] border border-[#2B3139] rounded-xl shadow-lg overflow-hidden z-50 animate-scale-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#2B3139] transition-colors ${
                lang.code === language ? 'bg-[#2B3139]' : ''
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className={`text-sm ${lang.code === language ? 'text-[#F0B90B]' : 'text-[#848E9C]'}`}>
                {lang.label}
              </span>
              {lang.code === language && (
                <svg className="w-4 h-4 text-[#F0B90B] ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;

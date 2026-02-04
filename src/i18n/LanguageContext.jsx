import { createContext, useContext, useState, useEffect } from 'react';
import { translations, defaultLanguage, languageOptions } from './translations';

// 建立 Context
const LanguageContext = createContext();

// 語言 Provider
export function LanguageProvider({ children }) {
  // 從 localStorage 讀取語言設定，否則使用預設語言
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cellfi-language');
      if (saved && translations[saved]) {
        return saved;
      }
    }
    return defaultLanguage;
  });

  // 當語言變更時，儲存到 localStorage
  useEffect(() => {
    localStorage.setItem('cellfi-language', language);
    // 設定 html lang 屬性
    document.documentElement.lang = language;
  }, [language]);

  // 取得翻譯文字的函數
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 如果找不到翻譯，回傳 key
        console.warn(`Translation not found: ${key}`);
        return key;
      }
    }

    // 處理參數替換 (例如 {amount})
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : `{${paramKey}}`;
      });
    }

    return value;
  };

  // 切換語言
  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang);
    }
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    languages: languageOptions,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// 自訂 Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;

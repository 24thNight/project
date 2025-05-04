import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, TranslationKey, t as translate } from './i18n';
import { usePlanStore } from './store';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('zh');
  const storeSetLanguage = usePlanStore(state => state.setLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storeSetLanguage(lang); // Sync with store
  };

  // Set initial language in the store
  useEffect(() => {
    storeSetLanguage(language);
  }, [language, storeSetLanguage]);

  const t = (key: TranslationKey) => translate(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'EN', nativeName: 'English' },
  { code: 'si', label: 'සිං', nativeName: 'සිංහල' },
  { code: 'ta', label: 'த', nativeName: 'தமிழ்' },
];

interface LanguageSwitcherProps {
  isMobile?: boolean;
  transparentTheme?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isMobile = false, transparentTheme = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    document.documentElement.lang = langCode;
    setIsOpen(false);
  };

  // Mobile: inline horizontal buttons
  if (isMobile) {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <Globe size={16} className={`${transparentTheme ? 'text-white' : 'text-gray-500 dark:text-gray-400'} shrink-0`} />
        <div className="flex gap-1.5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 ${
                currentLang.code === lang.code
                  ? (transparentTheme ? 'bg-white text-primary shadow-sm' : 'bg-primary text-white shadow-sm')
                  : (transparentTheme ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border')
              }`}
              aria-label={`Switch to ${lang.nativeName}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: compact dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${transparentTheme ? 'text-white hover:bg-white/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface'} transition-all duration-150 active:scale-95`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Change language"
      >
        <Globe size={16} />
        <span className="text-xs font-semibold">{currentLang.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-100 dark:border-dark-border z-50 overflow-hidden"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors ${
                  currentLang.code === lang.code
                    ? 'bg-primary/10 text-primary font-semibold dark:bg-primary/20 dark:text-primary-light'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-bg'
                }`}
              >
                <span>{lang.nativeName}</span>
                <span className="text-xs font-mono opacity-60">{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;

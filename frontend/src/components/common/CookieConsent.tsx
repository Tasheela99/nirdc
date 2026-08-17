import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Cookie, X } from 'lucide-react';

const CookieConsent: FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented or rejected
    const consent = localStorage.getItem('nirdc_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('nirdc_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('nirdc_cookie_consent', 'rejected');
    setIsVisible(false);
  };

  const handleClose = () => {
    // If they just close without picking, treat as rejected or pending
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none flex justify-center"
        >
          <div className="bg-[#1A0D15] border border-[#6B1D4A] rounded-2xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full pointer-events-auto relative flex flex-col md:flex-row gap-6 items-center">
            
            {/* Close Icon */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon and Text */}
            <div className="flex-1 flex gap-4 md:gap-6 items-start md:items-center">
              <div className="hidden sm:flex bg-[#8C2963]/20 p-3 rounded-full shrink-0 items-center justify-center">
                <Cookie className="w-8 h-8 text-[#F2B705]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 font-sans">
                  {t('cookie.title', 'We value your privacy')}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed font-body">
                  {t('cookie.text', 'Accepting cookies allows a website to store small text files on your device. These remember your login and preferences to enable site functionality. You can choose to Accept All or Reject All.')}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 font-sans">
              <button
                onClick={handleRejectAll}
                className="px-5 py-2.5 text-sm font-semibold text-white border border-[#4C1333] hover:border-[#6B1D4A] hover:bg-[#6B1D4A]/20 transition-all rounded-xl"
              >
                {t('cookie.rejectAll', 'Reject All')}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#8C2963] to-[#6B1D4A] hover:from-[#BA538C] hover:to-[#8C2963] transition-all rounded-xl shadow-[0_0_15px_rgba(107,29,74,0.4)]"
              >
                {t('cookie.acceptAll', 'Accept All')}
              </button>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PopUp from './common/pop-up';
import { useTranslation } from 'react-i18next';

const WelcomePopup: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show popup on the exact home page (root path with no hash or empty hash)
    const isHomePage = location.pathname === '/' && (!location.hash || location.hash === '');
    
    if (isHomePage) {
      // Small delay to ensure the popup doesn't block initial page rendering
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      // Ensure popup is closed if we navigate to any hash section or other pages
      setIsOpen(false);
    }
  }, [location.pathname, location.hash]);

  return (
    <PopUp
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={t('welcome.title')}
      width="md:max-w-lg"
    >
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-main-color">{t('welcome.heading')}</h2>
        
        <p>
        {t('welcome.description1')}
        </p>
        <p>
        {t('welcome.description2')}
        </p>
        {/* <div className="pt-2">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Your CV should include your expertise areas, qualifications, and relevant experience in research and development evaluation</li>
            <li>All submitted information will be kept confidential and used only for the purpose of Technical Evaluation Committee formation</li>
            <li>Please ensure your contact information is up-to-date for future communications</li>
          </ul>
        </div> */}
        
        <div className="pt-4 flex justify-end">
          <button
            onClick={() => {
              window.open('https://forms.gle/SEhStmXFVt4JVCwf6', '_blank', 'noopener,noreferrer');
              setIsOpen(false);
            }}
            className="bg-second-color hover:bg-main-color text-white px-6 py-2 rounded-md transition-colors"
          >
            {t('welcome.submitCV')}
          </button>
        </div>
      </div>
    </PopUp>
  );
};

export default WelcomePopup;
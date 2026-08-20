import { FC } from 'react';
import { Facebook, Youtube, Linkedin, Mail, MapPin, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoLight from '../../assets/NIRDC-logo-LIGHT.svg';
import { useTranslation } from 'react-i18next';

const FooterComponent: FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111827]/[0.96] dark:bg-[#0D050A]/[0.96] backdrop-blur-md text-gray-300">
      {/* Main Footer */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-5">
            <img src={logoLight} alt="NIRDC Sri Lanka Logo" className="h-16 w-auto" />
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t('footer.brandDescription')}
            </p>
          </div>

          {/* Contact Us */}
          <div className="space-y-5">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">{t('footer.contactUs')}</h3>
            <div className="space-y-4">
              <a
                href="mailto:nirdc@presidentsoffice.lk"
                className="flex items-start gap-3 text-sm text-gray-400 hover:text-primary-light transition-colors group"
              >
                <Mail size={16} className="mt-0.5 shrink-0 text-primary-light" />
                <span>nirdc@presidentsoffice.lk</span>
              </a>
              <a
                href="https://presidentsoffice.gov.lk/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-gray-400 hover:text-primary-light transition-colors group"
              >
                <Globe size={16} className="mt-0.5 shrink-0 text-primary-light group-hover:scale-110 transition-transform" />
                <span className="group-hover:underline">presidentsoffice.gov.lk</span>
              </a>
              <a
                href="https://cleansrilanka.gov.lk/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-gray-400 hover:text-primary-light transition-colors group"
              >
                <Globe size={16} className="mt-0.5 shrink-0 text-primary-light group-hover:scale-110 transition-transform" />
                <span className="group-hover:underline">cleansrilanka.gov.lk</span>
              </a>
              <a
                href="https://www.prajashakthi.gov.lk/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-gray-400 hover:text-primary-light transition-colors group"
              >
                <Globe size={16} className="mt-0.5 shrink-0 text-primary-light group-hover:scale-110 transition-transform" />
                <span className="group-hover:underline">prajashakthi.gov.lk</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary-light" />
                <address className="not-italic leading-relaxed">
                  {t('footer.address')}
                </address>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">{t('footer.quickLinks')}</h3>
            <nav className="space-y-3" aria-label="Footer navigation">
              {[
                { label: t('footer.home'), href: '/' },
                { label: t('header.proposals'), href: '/proposal' },
                { label: t('footer.news'), href: '/all-news' },
                { label: t('footer.announcements'), href: '/announcements' },
                { label: t('footer.aboutUs'), href: '/about-us' },
                { label: t('footer.privacyPolicy'), href: '/privacy-policy' },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-all duration-150 active:scale-[0.98] group"
                >
                  <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-5">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">{t('footer.followUs')}</h3>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "https://www.facebook.com/share/19pHQVdJm2/?mibextid=wwXIfr", label: "Facebook" },
                { icon: Youtube, href: "https://www.youtube.com/", label: "YouTube" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/national-initiative-for-research-and-development-commercialisation-041ab9343/", label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 dark:bg-dark-surface flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-200 active:scale-90 hover:shadow-md"
                  aria-label={`Follow us on ${social.label}`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 dark:border-dark-border">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} {t('footer.copyright')}
          </p>
          <a
            href="https://presidentsoffice.gov.lk/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-primary-light hover:underline transition-colors"
          >
            {t('footer.poweredBy')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;

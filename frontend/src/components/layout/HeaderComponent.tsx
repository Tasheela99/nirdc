import React, {useContext, useEffect, useRef, useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {HashLink} from "react-router-hash-link";
import logoLight from "../../assets/NIRDC-logo-LIGHT.svg";
import emblem from "../../assets/Emblem_of_Sri_Lanka.svg";
import {USER_ROLE} from "../../constants/AppConstants";
import UserContext from "../../store/UserContext.tsx";
import ChangePasswordDialog from "../common/ChangePasswordDialog";
import {AnimatePresence, motion} from "framer-motion";
import { Menu, X, ChevronDown, LogOut, Lock, LayoutDashboard, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";
import { themeColorValues } from "../../theme/theme";

interface IUserInfo {
    role: string;
    email: string;
    userName?: string;
    displayName?: string;
    id?: string;
}

interface UserDropdownProps {
    userInfo: IUserInfo;
    handleLogout: () => void;
    isMobile?: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({userInfo, handleLogout, isMobile = false}) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitial = () => {
        return (userInfo?.userName?.[0] || "U").toUpperCase();
    };

    if (isMobile) {
        return (
            <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-dark-border">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        {getInitial()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{userInfo?.userName || "User"}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{userInfo?.email}</p>
                    </div>
                </div>
                <button
                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-surface dark:hover:bg-dark-surface rounded-lg transition-colors"
                    onClick={() => setShowChangePassword(true)}
                >
                    <Lock size={16} />
                    {t('header.changePassword')}
                </button>
                <button
                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    {t('header.logout')}
                </button>
                <ChangePasswordDialog open={showChangePassword} onClose={() => setShowChangePassword(false)} />
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="User menu"
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block max-w-[100px] truncate">
                    {userInfo?.userName || "User"}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                    {getInitial()}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{opacity: 0, y: -8, scale: 0.95}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: -8, scale: 0.95}}
                        transition={{duration: 0.15}}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-100 dark:border-dark-border z-50 overflow-hidden"
                    >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{userInfo?.userName || "User"}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userInfo?.email}</p>
                        </div>
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    setShowChangePassword(true);
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-surface dark:hover:bg-dark-bg transition-colors"
                            >
                                <Lock size={16} />
                                {t('header.changePassword')}
                            </button>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut size={16} />
                                {t('header.logout')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ChangePasswordDialog open={showChangePassword} onClose={() => setShowChangePassword(false)} />
        </div>
    );
};

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();
    const isLongLang = i18n.language?.startsWith('ta') || i18n.language?.startsWith('si');
    const desktopNavClass = isLongLang ? "hidden min-[1400px]:flex" : "hidden xl:flex";
    const mobileMenuClass = isLongLang ? "min-[1400px]:hidden flex items-center gap-2" : "xl:hidden flex items-center gap-2";
    const mobileMenuContainerClass = isLongLang ? "min-[1400px]:hidden overflow-hidden" : "xl:hidden overflow-hidden";
    
    const [isOpen, setIsOpen] = useState(false);
    const [newsDropdownOpen, setNewsDropdownOpen] = useState(false);
    const [mobileNewsDropdownOpen, setMobileNewsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const {userInfo, isLoggedIn, resetUserInfo} = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDirector, setIsDirector] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const newsDropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const isTransparentPage = location.pathname === '/' || location.pathname === '/about-us';
    const [scrolled, setScrolled] = useState(false);
    
    const isTransparent = isTransparentPage && !scrolled;

    useEffect(() => {
        setIsAdmin(
            userInfo?.role === USER_ROLE.ADMIN || userInfo?.role === USER_ROLE.SUPER_ADMIN
        );
        setIsDirector(userInfo?.role === USER_ROLE.DIRECTOR);
    }, [userInfo]);

    // Scroll detection for header styling
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, {passive: true});
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        resetUserInfo();
        navigate("/");
    };

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
        // Prevent body scroll when mobile menu is open
        document.body.style.overflow = !isOpen ? 'hidden' : '';
    };

    const closeMenu = () => {
        setIsOpen(false);
        document.body.style.overflow = '';
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            closeMenu();
        }
        if (newsDropdownRef.current && !newsDropdownRef.current.contains(event.target as Node)) {
            setNewsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = '';
        };
    }, []);

    // Nav link styles
    const getNavLinkClass = (path: string) => {
        const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
        const baseTextColor = active ? 'text-white' : 'text-white/80 hover:text-white';
        const afterBgColor = 'after:bg-white';
        const afterWidth = active ? 'after:w-full' : 'after:w-0';
        return `relative ${isLongLang ? 'text-[13px]' : 'text-sm'} font-medium whitespace-nowrap ${baseTextColor} transition-all duration-150 active:scale-[0.97] after:absolute after:-bottom-1 after:left-0 after:h-[2px] ${afterWidth} ${afterBgColor} after:transition-all after:duration-300 hover:after:w-full`;
    };

    const getMobileNavLinkClass = (path: string) => {
        const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
        return `block py-3 px-4 text-sm font-medium ${active ? 'text-white bg-white/20' : 'text-white/80 hover:text-white hover:bg-white/10'} rounded-lg transition-all duration-150 active:scale-[0.97]`;
    };

    return (
        <header
            className={`${isTransparentPage ? 'fixed w-full' : 'sticky'} top-0 z-50 transition-all duration-300 ${
                isTransparent
                    ? "bg-white/10 backdrop-blur-md border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
                    : "bg-[#111827]/[0.96] dark:bg-[#0D050A]/[0.96] backdrop-blur-md shadow-md border-b border-gray-800/50"
            }`}
            role="banner"
        >
            <div className={`${isLongLang ? 'max-w-[98%] 2xl:max-w-[1600px]' : 'max-w-screen-xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center shrink-0 gap-4" aria-label="NIRDC Home">
                        <img src={emblem} alt="Emblem of Sri Lanka" className="h-16 w-auto" />
                        <div className="h-12 w-[1px] bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
                        <img src={logoLight} alt="NIRDC Logo" className="h-14 w-auto transition-all duration-300" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={`${desktopNavClass} items-center ${isLongLang ? 'gap-2 2xl:gap-4' : 'gap-3 2xl:gap-6'}`} role="navigation" aria-label="Main navigation">
                        <button
                            onClick={() => window.location.href = '/'}
                            className={getNavLinkClass('/')}
                        >
                            {t('header.home')}
                        </button>

                        {!isAdmin && !isDirector ? (
                            <>
                                <Link to="/proposal" className={getNavLinkClass('/proposal')}>
                                    {t('header.proposals')}
                                </Link>

                                {/* Updates & News Dropdown */}
                                <div className="relative" ref={newsDropdownRef}>
                                    <button
                                        onClick={() => setNewsDropdownOpen(!newsDropdownOpen)}
                                        className={`${getNavLinkClass('/all-news')} flex items-center gap-1 ${newsDropdownOpen ? 'text-white after:w-full' : ''}`}
                                        style={{ color: newsDropdownOpen ? '#ffffff' : undefined }}
                                        aria-expanded={newsDropdownOpen}
                                        aria-haspopup="true"
                                    >
                                        {t('header.updatesNews')}
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-200 ${newsDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {newsDropdownOpen && (
                                            <motion.div
                                                initial={{opacity: 0, y: -4, scale: 0.98}}
                                                animate={{opacity: 1, y: 0, scale: 1}}
                                                exit={{opacity: 0, y: -4, scale: 0.98}}
                                                transition={{duration: 0.2, ease: "easeOut"}}
                                                className="absolute left-0 mt-3 w-56 bg-white/95 dark:bg-[#1A0D15]/95 backdrop-blur-xl rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-dark-border z-50 overflow-hidden p-2"
                                            >
                                                <HashLink
                                                    to="/all-news"
                                                    smooth
                                                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-[#6B1D4A]/10 dark:hover:bg-[#9A3870]/20 rounded-lg transition-all duration-200 mb-1"
                                                    style={{ '--hover-color': themeColorValues.primary.main } as React.CSSProperties}
                                                    onClick={() => setNewsDropdownOpen(false)}
                                                >
                                                    <span className="hover:text-[var(--hover-color)]">{t('header.news')}</span>
                                                </HashLink>
                                                <Link
                                                    to="/announcements"
                                                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-[#6B1D4A]/10 dark:hover:bg-[#9A3870]/20 rounded-lg transition-all duration-200"
                                                    onClick={() => setNewsDropdownOpen(false)}
                                                >
                                                    <span className="hover:text-[var(--hover-color)]">{t('header.announcements')}</span>
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link to="/about-us" className={getNavLinkClass('/about-us')}>
                                    {t('header.aboutUs')}
                                </Link>


                            </>
                        ) : null}
 
                        {(isAdmin || isDirector) && (
                            <button
                                className={`flex items-center gap-2 bg-white text-primary hover:bg-gray-100 ${isLongLang ? 'text-[13px] px-3' : 'text-sm px-4'} font-semibold whitespace-nowrap 2xl:px-5 py-2 rounded-lg transition-all duration-200 active:scale-[0.97] hover:shadow-lg hover:-translate-y-0.5`}
                                onClick={() => {
                                    navigate("/dashboard");
                                }}
                            >
                                <LayoutDashboard size={16} />
                                {t('header.dashboard')}
                            </button>
                        )}
 
                        {/* Language Switcher */}
                        <LanguageSwitcher transparentTheme={true} />


 
                        {isLoggedIn ? (
                            <UserDropdown userInfo={userInfo} handleLogout={handleLogout} />
                        ) : (
                            <button
                                className={`flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-primary ${isLongLang ? 'text-[13px] px-3' : 'text-sm px-4'} font-semibold py-1.5 rounded-lg transition-all duration-200 active:scale-[0.97]`}
                                onClick={() => navigate("/login")}
                            >
                                <User size={16} />
                                {t('header.login')}
                            </button>
                        )}
                    </nav>

                    {/* Mobile: Hamburger */}
                    <div className={mobileMenuClass}>
                        <button
                            onClick={toggleMenu}
                            className={`p-2 rounded-lg text-white hover:bg-white/20 transition-colors`}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={menuRef}
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: "auto"}}
                            exit={{opacity: 0, height: 0}}
                            transition={{duration: 0.25, ease: "easeInOut"}}
                            className={mobileMenuContainerClass}
                            role="navigation"
                            aria-label="Mobile navigation"
                        >
                            <div className="pb-4 space-y-1">
                                <div className="flex items-center justify-between pr-4">
                                    {/* Mobile Language Switcher */}
                                    <LanguageSwitcher isMobile transparentTheme={true} />

                                    <div className="flex items-center gap-2">
                                        {(isAdmin || isDirector) && (
                                            <button
                                                className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-[0.97]"
                                                onClick={() => { navigate(isAdmin ? "/admin" : "/admin/dashboard"); closeMenu(); }}
                                            >
                                                <LayoutDashboard size={14} />
                                                <span className="hidden sm:inline">{t('header.dashboard')}</span>
                                            </button>
                                        )}
                                        
                                        {!isLoggedIn && (
                                            <button
                                                className={`flex items-center justify-center gap-1.5 border-2 ${isTransparent ? 'border-white text-white hover:bg-white hover:text-primary' : 'border-primary text-primary dark:text-primary-light dark:border-primary-light hover:bg-primary hover:text-white'} text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-[0.97]`}
                                                onClick={() => { navigate("/login"); closeMenu(); }}
                                            >
                                                <User size={14} />
                                                {t('header.login')}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <Link to="/" className={getMobileNavLinkClass('/')} onClick={closeMenu}>
                                    {t('header.home')}
                                </Link>

                                {!isAdmin && !isDirector ? (
                                    <>
                                        <Link to="/proposal" className={getMobileNavLinkClass('/proposal')} onClick={closeMenu}>
                                            {t('header.proposals')}
                                        </Link>

                                        {/* Mobile Updates & News */}
                                        <div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setMobileNewsDropdownOpen(!mobileNewsDropdownOpen);
                                                }}
                                                className={`${getMobileNavLinkClass('/all-news')} flex items-center justify-between w-full`}
                                            >
                                                <span>{t('header.updatesNews')}</span>
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform duration-200 ${mobileNewsDropdownOpen ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {mobileNewsDropdownOpen && (
                                                    <motion.div
                                                        initial={{opacity: 0, height: 0}}
                                                        animate={{opacity: 1, height: "auto"}}
                                                        exit={{opacity: 0, height: 0}}
                                                        transition={{duration: 0.2}}
                                                        className="ml-4 pl-4 border-l-2 border-primary space-y-1 overflow-hidden"
                                                    >
                                                        <HashLink smooth to="/all-news" className={`${getMobileNavLinkClass('/all-news')} !py-2.5 !px-3 mb-1`}
                                                                  onClick={() => { setMobileNewsDropdownOpen(false); closeMenu(); }}>
                                                            {t('header.news')}
                                                        </HashLink>
                                                        <Link to="/announcements" className={`${getMobileNavLinkClass('/announcements')} !py-2.5 !px-3`}
                                                              onClick={() => { setMobileNewsDropdownOpen(false); closeMenu(); }}>
                                                            {t('header.announcements')}
                                                        </Link>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <Link to="/about-us" className={getMobileNavLinkClass('/about-us')} onClick={closeMenu}>
                                            {t('header.aboutUs')}
                                        </Link>
                                    </>
                                ) : null}

                                {isLoggedIn && (
                                    <UserDropdown userInfo={userInfo} handleLogout={handleLogout} isMobile={true} />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;

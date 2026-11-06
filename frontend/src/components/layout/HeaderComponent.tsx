import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoLight from "../../assets/NIRDC-logo-SVG.svg";
import emblem from "../../assets/Emblem_of_Sri_Lanka.svg";
import { USER_ROLE } from "../../constants/AppConstants";
import UserContext from "../../store/UserContext.tsx";
import ChangePasswordDialog from "../common/ChangePasswordDialog";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, Lock, LayoutDashboard, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";
import aboutUsContentApi from "../../api/AboutUsContentApi";

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

const UserDropdown: React.FC<UserDropdownProps> = ({ userInfo, handleLogout, isMobile = false }) => {
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

    const firstName = userInfo?.userName?.split(" ")[0] || "User";

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
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="User menu"
            >
                <span className="text-sm font-medium text-white/90 hidden sm:block max-w-[150px] truncate">
                    {firstName}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                    {getInitial()}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
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

    // Dropdown States
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
    const [mobileAboutDropdownOpen, setMobileAboutDropdownOpen] = useState(false);

    // Dynamic Navigation Visibility Config
    const [aboutNavConfig, setAboutNavConfig] = useState<Record<string, boolean>>({
        introduction: true,
        history: true,
        visionMission: true,
        values: true,
        objectives: true,
        responsibilities: true,
        functionsServices: true,
        directorMessage: true,
        team: true,
        organizationalStructure: true,
        downloads: true,
        reportsPublications: true,
        newsletters: true,
    });

    useEffect(() => {
        let isMounted = true;
        aboutUsContentApi.getNavConfig()
            .then((res) => {
                if (isMounted && res?.data) {
                    setAboutNavConfig((prev) => ({ ...prev, ...res.data }));
                }
            })
            .catch(() => { });
        return () => {
            isMounted = false;
        };
    }, []);

    const isNavVisible = (key: string) => aboutNavConfig[key] !== false;

    const aboutNavItems = [
        {
            key: 'introduction',
            label: t('header.aboutIntroduction', 'Introduction'),
            path: '/about-us/introduction',
        },
        {
            key: 'history',
            label: t('header.aboutHistory', 'Our History'),
            path: '/about-us/history',
        },
        {
            key: 'directorMessage',
            label: t('header.aboutDirectorMessage', 'Director Message'),
            path: '/about-us/director-message',
        },
        {
            key: 'team',
            label: t('header.aboutTeam', 'Our Team'),
            path: '/about-us/team',
        },
        {
            key: 'organizationalStructure',
            label: t('header.aboutOrganizationalStructure', 'Organizational Structure'),
            path: '/about-us/organizational-structure',
        },
    ];

    const visibleAboutItems = aboutNavItems.filter((item) => isNavVisible(item.key));
    const hasAnyAboutVisible = visibleAboutItems.length > 0;

    const navigate = useNavigate();
    const { userInfo, isLoggedIn, resetUserInfo } = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDirector, setIsDirector] = useState(false);

    // Refs for outside click
    const menuRef = useRef<HTMLDivElement>(null);
    const aboutDropdownRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const isTransparentPage =
        location.pathname === '/' ||
        location.pathname.startsWith('/about-us') ||
        location.pathname.startsWith('/resources') ||
        location.pathname.startsWith('/contact-us') ||
        location.pathname.startsWith('/services') ||
        location.pathname.startsWith('/downloads') ||
        location.pathname.startsWith('/gallery');

    useEffect(() => {
        setIsAdmin(
            userInfo?.role === USER_ROLE.ADMIN || userInfo?.role === USER_ROLE.SUPER_ADMIN
        );
        setIsDirector(userInfo?.role === USER_ROLE.DIRECTOR);
    }, [userInfo]);

    const handleLogout = () => {
        resetUserInfo();
        navigate("/");
    };

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
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
        if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
            setAboutDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = '';
        };
    }, []);

    const getNavLinkClass = (path: string) => {
        const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
        const baseTextColor = active ? 'text-black font-bold' : 'text-slate-700 hover:text-black';
        const afterBgColor = 'after:bg-black';
        const afterWidth = active ? 'after:w-full' : 'after:w-0';
        return `relative ${isLongLang ? 'text-[12.5px]' : 'text-sm'} font-medium whitespace-nowrap ${baseTextColor} transition-all duration-150 active:scale-[0.97] after:absolute after:-bottom-1 after:left-0 after:h-[2px] ${afterWidth} ${afterBgColor} after:transition-all after:duration-300 hover:after:w-full`;
    };

    const getMobileNavLinkClass = (path: string) => {
        const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
        return `block py-3 px-4 text-sm font-medium ${active ? 'text-black bg-slate-100 font-bold' : 'text-slate-700 hover:text-black hover:bg-slate-50'} rounded-lg transition-all duration-150 active:scale-[0.97]`;
    };

    return (
        <header
            className={`${isTransparentPage ? 'fixed w-full' : 'sticky'} top-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/90`}
            role="banner"
        >
            <div className={`${isLongLang ? 'max-w-[98%] 2xl:max-w-[1600px]' : 'max-w-screen-xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center shrink-0 gap-4" aria-label="NIRDC Home">
                        <img src={emblem} alt="Emblem of Sri Lanka" className="h-16 w-auto" />
                        <div className="h-12 w-[1px] bg-slate-200 hidden sm:block"></div>
                        <img src={logoLight} alt="NIRDC Logo" className="h-14 w-auto transition-all duration-300" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={`${desktopNavClass} items-center ${isLongLang ? 'gap-1.5 2xl:gap-3.5' : 'gap-2.5 2xl:gap-5'}`} role="navigation" aria-label="Main navigation">
                        {/* 1. Home */}
                        <button
                            onClick={() => window.location.href = '/'}
                            className={getNavLinkClass('/')}
                        >
                            {t('header.home', 'Home')}
                        </button>

                        {!isAdmin && !isDirector ? (
                            <>
                                {/* 2. About */}
                                {hasAnyAboutVisible && (
                                    <div className="relative" ref={aboutDropdownRef}>
                                        <button
                                            onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                                            className={`${getNavLinkClass('/about-us')} flex items-center gap-1 ${aboutDropdownOpen ? 'text-black after:w-full' : ''}`}
                                            style={{ color: aboutDropdownOpen ? '#000000' : undefined }}
                                            aria-expanded={aboutDropdownOpen}
                                            aria-haspopup="true"
                                        >
                                            {t('header.about', 'About')}
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {aboutDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                                    className="absolute left-0 top-full mt-2 w-60 rounded-xl z-50 overflow-hidden shadow-xl bg-white border border-slate-200 py-1.5 px-1.5"
                                                >
                                                    <ul className="space-y-0.5">
                                                        {visibleAboutItems.map((item) => (
                                                            <li key={item.path}>
                                                                <Link
                                                                    to={item.path}
                                                                    onClick={() => setAboutDropdownOpen(false)}
                                                                    className="block px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-black hover:bg-slate-100/80 transition-colors"
                                                                >
                                                                    {item.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* 3. Project Proposals */}
                                <Link to="/proposal" className={getNavLinkClass('/proposal')}>
                                    {t('header.proposals', 'Project Proposals')}
                                </Link>

                                {/* 4. Services */}
                                <Link to="/services" className={getNavLinkClass('/services')}>
                                    {t('header.services', 'Functions & Services')}
                                </Link>

                                {/* 5. Downloads */}
                                <Link to="/downloads" className={getNavLinkClass('/downloads')}>
                                    {t('header.downloads', 'Downloads')}
                                </Link>

                                {/* 6. Gallery */}
                                <Link to="/gallery" className={getNavLinkClass('/gallery')}>
                                    {t('header.gallery', 'Gallery')}
                                </Link>

                                {/* 7. Contacts */}
                                <Link
                                    to="/contact-us"
                                    className={getNavLinkClass('/contact-us')}
                                >
                                    {t('header.contacts', 'Contacts')}
                                </Link>
                            </>
                        ) : null}

                        {(isAdmin || isDirector) && (
                            <button
                                className={`flex items-center gap-2 bg-slate-900 text-white hover:bg-black ${isLongLang ? 'text-[13px] px-3' : 'text-sm px-4'} font-semibold whitespace-nowrap 2xl:px-5 py-2 rounded-lg transition-all duration-200 active:scale-[0.97] hover:shadow-lg hover:-translate-y-0.5`}
                                onClick={() => navigate("/dashboard")}
                            >
                                <LayoutDashboard size={16} />
                                {t('header.dashboard')}
                            </button>
                        )}

                        {/* Language Switcher */}
                        <LanguageSwitcher transparentTheme={false} />

                        {isLoggedIn ? (
                            <UserDropdown userInfo={userInfo} handleLogout={handleLogout} />
                        ) : (
                            <button
                                className={`flex items-center gap-2 border border-black text-black hover:bg-black hover:text-white ${isLongLang ? 'text-[13px] px-3' : 'text-sm px-4'} font-semibold py-1.5 rounded-lg transition-all duration-200 active:scale-[0.97]`}
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
                            className={`p-2 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors`}
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
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className={`${mobileMenuContainerClass} bg-white border-t border-slate-200 shadow-xl`}
                            role="navigation"
                            aria-label="Mobile navigation"
                        >
                            <div className="pb-4 pt-2 space-y-1">
                                <div className="flex items-center justify-between pr-4 pb-2 border-b border-slate-100">
                                    <LanguageSwitcher isMobile transparentTheme={false} />

                                    <div className="flex items-center gap-2">
                                        {(isAdmin || isDirector) && (
                                            <button
                                                className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-[0.97]"
                                                onClick={() => { navigate(isAdmin ? "/admin" : "/admin/dashboard"); closeMenu(); }}
                                            >
                                                <LayoutDashboard size={14} />
                                                <span className="hidden sm:inline">{t('header.dashboard')}</span>
                                            </button>
                                        )}

                                        {!isLoggedIn && (
                                            <button
                                                className="flex items-center justify-center gap-1.5 border border-black text-black hover:bg-black hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-[0.97]"
                                                onClick={() => { navigate("/login"); closeMenu(); }}
                                            >
                                                <User size={14} />
                                                {t('header.login')}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* 1. Home */}
                                <Link to="/" className={getMobileNavLinkClass('/')} onClick={closeMenu}>
                                    {t('header.home', 'Home')}
                                </Link>

                                {!isAdmin && !isDirector ? (
                                    <>
                                        {/* 2. About Accordion */}
                                        {hasAnyAboutVisible && (
                                            <div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setMobileAboutDropdownOpen(!mobileAboutDropdownOpen);
                                                    }}
                                                    className={`${getMobileNavLinkClass('/about-us')} flex items-center justify-between w-full`}
                                                >
                                                    <span>{t('header.about', 'About')}</span>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${mobileAboutDropdownOpen ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                <AnimatePresence>
                                                    {mobileAboutDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="ml-4 pl-4 border-l-2 border-slate-300 space-y-1 overflow-hidden py-1"
                                                        >
                                                            {visibleAboutItems.map((item) => (
                                                                <Link
                                                                    key={item.path}
                                                                    to={item.path}
                                                                    className={`${getMobileNavLinkClass(item.path)} block !py-2 !px-3 mb-0.5 text-[13px] opacity-90`}
                                                                    onClick={() => { setMobileAboutDropdownOpen(false); closeMenu(); }}
                                                                >
                                                                    {item.label}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}

                                        {/* 3. Project Proposals */}
                                        <Link to="/proposal" className={getMobileNavLinkClass('/proposal')} onClick={closeMenu}>
                                            {t('header.proposals', 'Project Proposals')}
                                        </Link>

                                        {/* 4. Services */}
                                        <Link to="/services" className={getMobileNavLinkClass('/services')} onClick={closeMenu}>
                                            {t('header.services', 'Functions & Services')}
                                        </Link>

                                        {/* 5. Downloads */}
                                        <Link to="/downloads" className={getMobileNavLinkClass('/downloads')} onClick={closeMenu}>
                                            {t('header.downloads', 'Downloads')}
                                        </Link>

                                        {/* 6. Gallery */}
                                        <Link to="/gallery" className={getMobileNavLinkClass('/gallery')} onClick={closeMenu}>
                                            {t('header.gallery', 'Gallery')}
                                        </Link>

                                        {/* 7. Contacts */}
                                        <Link
                                            to="/contact-us"
                                            className={getMobileNavLinkClass('/contact-us')}
                                            onClick={closeMenu}
                                        >
                                            {t('header.contacts', 'Contacts')}
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
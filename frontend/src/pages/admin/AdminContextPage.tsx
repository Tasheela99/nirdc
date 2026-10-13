import React, {useContext, useState} from "react";
import {Route, Routes, NavLink, Link, useNavigate, Navigate} from "react-router-dom";
import {CssBaseline} from "@mui/material";
import {
    Menu, X, LayoutDashboard, Users, Newspaper,
    FileText, Megaphone, BookOpen, LogOut, Lock, ExternalLink, ChevronDown
} from "lucide-react";
import { Tv, DownloadCloud, LayoutTemplate } from "lucide-react";
import { Menu as MuiMenu, MenuItem, Avatar } from "@mui/material";
import ManageDirectorsScreen from "./directors/ManageDirectorsPage.tsx";
import RegisterDirectorScreen from "./directors/RegisterDirectorPage.tsx";
import CreateNewsScreen from "./news/CreateNewsPage.tsx";
import ManageNewsScreen from "./news/ManageNewsPage.tsx";
import ViewProposalsScreen from "./proposals/ViewProposalsPage.tsx";
import logo from "../../assets/NIRDC-logo-SVG.svg";
import UserContext from "../../store/UserContext.tsx";
import AdminDashboardScreen from "./AdminDashboardPage.tsx";
import UserProfileScreen from "./UserProfilePage.tsx";
import ProposalDetails from "../proposals/ProposalDetailsPage.tsx";
import CreateAnnouncementScreen from "./announcement/CreateAnnouncementPage.tsx";
import ManageAnnouncementsScreen from "./announcement/ManageAnnouncementsPage.tsx";
import ManageBlogScreen from "./blog/ManageBlogPage.tsx";
import CreateblogScreen from "./blog/CreateBlogPage.tsx";
import ManageAdsScreen from "./ad/ManageAdsPage.tsx";
import CreateAdScreen from "./ad/CreateAdPage.tsx";
import HomePageContentManagementScreen from "./home/HomePageContentManagementPage.tsx";
import AboutUsContentManagementScreen from "./about/AboutUsContentManagementPage.tsx";
import ManageUsersPage from "./users/ManageUsersPage.tsx";
import ManageDownloadsPage from "./downloads/ManageDownloadsPage.tsx";
import CreateDownloadPage from "./downloads/CreateDownloadPage.tsx";
import ProtectedRoute from "../../ProtectedRoute";
import {USER_ROLE} from "../../constants/AppConstants.tsx";
import ChangePasswordDialog from "../../components/common/ChangePasswordDialog";
import PendingReviewersPage from "./reviewers/PendingReviewersPage.tsx";
import ReviewerSettingsPage from "./reviewer-settings/ReviewerSettingsPage.tsx";
import ManageContactContentPage from "./contact/ManageContactContentPage.tsx";
import { UserCheck, Settings, Building, PhoneCall, MessageSquare } from "lucide-react";

const SIDEBAR_WIDTH = 260;

interface SidebarItem {
    path: string;
    label: string;
    icon: React.ReactNode;
}

interface SidebarSection {
    category: string;
    items: SidebarItem[];
}

const AdminContextScreen = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    
    const {userInfo, isLoggedIn, resetUserInfo} = useContext(UserContext);
    const navigate = useNavigate();

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        resetUserInfo();
        navigate("/login", { replace: true });
    };

    const userManagementItems: SidebarItem[] = [
        ...(userInfo?.role !== USER_ROLE.DIRECTOR ? [{ path: "/admin/manage-directors", label: "Directors", icon: <Users size={17} /> }] : []),
        ...(userInfo?.role === USER_ROLE.SUPER_ADMIN || userInfo?.role === USER_ROLE.ADMIN ? [{ path: "/admin/manage-users", label: "Users & Roles", icon: <UserCheck size={17} /> }] : []),
    ];

    const sidebarSections: SidebarSection[] = [
        {
            category: "OVERVIEW",
            items: [
                { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
            ]
        },
        ...(userManagementItems.length > 0 ? [{
            category: "USER MANAGEMENT",
            items: userManagementItems
        }] : []),
        {
            category: "PROPOSALS & REVIEW",
            items: [
                { path: "/admin/view-proposals", label: "Project Proposals", icon: <FileText size={17} /> },
                { path: "/admin/manage-reviewers", label: "Pending Reviewers", icon: <UserCheck size={17} /> },
                { path: "/admin/reviewer-settings", label: "Reviewer Settings", icon: <Settings size={17} /> },
            ]
        },
        {
            category: "MEDIA & PUBLICATIONS",
            items: [
                { path: "/admin/manage-news", label: "News & Updates", icon: <Newspaper size={17} /> },
                { path: "/admin/manage-announcements", label: "Announcements", icon: <Megaphone size={17} /> },
                { path: "/admin/manage-blog", label: "Blogs & Articles", icon: <BookOpen size={17} /> },
                { path: "/admin/manage-downloads", label: "Downloads Library", icon: <DownloadCloud size={17} /> },
            ]
        },
        {
            category: "WEBSITE CONTENT",
            items: [
                { path: "/admin/home-content", label: "Home Page", icon: <LayoutTemplate size={17} /> },
                { path: "/admin/about-content", label: "About Page", icon: <Building size={17} /> },
                { path: "/admin/manage-ads", label: "Advertisements", icon: <Tv size={17} /> },
                { path: "/admin/manage-inquiries", label: "Contact Inquiries", icon: <MessageSquare size={17} /> },
                { path: "/admin/manage-contact", label: "Contact Details", icon: <PhoneCall size={17} /> },
            ]
        }
    ];

    const getInitial = () => (userInfo?.userName?.[0] || "A").toUpperCase();

    // ─── Sidebar Content (shared between desktop & mobile) ───
    const SidebarContent = ({onLinkClick}: { onLinkClick?: () => void }) => (
        <div className="flex flex-col h-full text-white" style={{ background: 'linear-gradient(180deg, #001438 0%, #002561 50%, #00183b 100%)' }}>
            {/* Logo Header */}
            <div className="px-5 py-5 flex items-center justify-between">
                <Link to="/admin/dashboard" onClick={onLinkClick} className="block transition-opacity hover:opacity-90">
                    <img src={logo} alt="NIRDC Logo" className="h-9 w-auto brightness-0 invert drop-shadow-sm" />
                </Link>
            </div>

            <div className="h-px bg-white/10 mx-4" />

            {/* Categorized Nav Links */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-3.5">
                {sidebarSections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                        <div className="px-3 pt-1 pb-0.5">
                            <span className="text-[10px] font-black tracking-widest text-blue-200/50 uppercase select-none">
                                {section.category}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            {section.items.map((link, iIdx) => (
                                <NavLink
                                    key={iIdx}
                                    to={link.path}
                                    onClick={onLinkClick}
                                    className={({isActive}) =>
                                        `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-150 no-underline cursor-pointer group ${
                                            isActive
                                                ? 'bg-white/20 text-white font-bold shadow-sm backdrop-blur-sm border-l-[3px] border-amber-400 pl-2.5'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`
                                    }
                                >
                                    <span className="shrink-0 text-white/80 group-hover:text-white transition-colors">
                                        {link.icon}
                                    </span>
                                    <span className="truncate">{link.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom: Visit Public Website */}
            <div className="p-3 border-t border-white/10 shrink-0 bg-black/20">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onLinkClick}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 no-underline cursor-pointer text-white/80 hover:bg-white/15 hover:text-white"
                >
                    <div className="flex items-center gap-2.5">
                        <ExternalLink size={16} className="text-white/70" />
                        <span>Visit Website</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">Live</span>
                </a>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            <CssBaseline />

            {/* ─── Desktop Sidebar (permanent) ─── */}
            <aside
                className="hidden md:flex flex-col flex-shrink-0 fixed top-0 left-0 bottom-0 z-30"
                style={{ width: SIDEBAR_WIDTH }}
            >
                <SidebarContent />
            </aside>

            {/* ─── Mobile Sidebar (overlay) ─── */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside
                        className="fixed top-0 left-0 bottom-0 z-50 md:hidden flex flex-col"
                        style={{ width: SIDEBAR_WIDTH }}
                    >
                        <div className="absolute top-3 right-3 z-10">
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X size={18} className="text-white" />
                            </button>
                        </div>
                        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
                    </aside>
                </>
            )}

            {/* ─── Main Content Area ─── */}
            <div className="flex flex-col flex-1 min-w-0 md:ml-[260px]">
                    {/* ─── Unified Top Bar ─── */}
                    <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-2 md:px-8 md:py-3" style={{ background: 'linear-gradient(90deg, #001d4a 0%, #003893 100%)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors">
                                <Menu size={20} className="text-white/80" />
                            </button>
                            <Link to="/admin/dashboard" className="md:hidden flex items-center">
                                <img src={logo} alt="NIRDC Logo" className="h-8 w-auto brightness-0 invert" />
                            </Link>
                        </div>

                        {/* User Profile Dropdown */}
                        {isLoggedIn && (
                            <div className="flex items-center ml-auto">
                                <button
                                    onClick={handleMenuClick}
                                    className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
                                >
                                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)' }}>
                                        {getInitial()}
                                    </Avatar>
                                    <div className="hidden md:flex flex-col items-start text-left">
                                        <span className="text-sm font-semibold text-white leading-tight">{userInfo?.userName || "Admin"}</span>
                                        <span className="text-xs text-white/70 font-medium leading-tight">{userInfo?.role?.replace("_", " ") || "Admin"}</span>
                                    </div>
                                    <ChevronDown size={16} className="text-white/70 hidden md:block" />
                                </button>
                                <MuiMenu
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.1))',
                                            mt: 1.5,
                                            minWidth: 200,
                                            borderRadius: 2,
                                            bgcolor: 'white',
                                            color: '#111827',
                                            '& .MuiMenuItem-root': {
                                                px: 2,
                                                py: 1.5,
                                                fontSize: '0.875rem',
                                                gap: 1.5,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={() => { handleMenuClose(); setShowChangePassword(true); }} sx={{ color: '#4B5563', '&:hover': { bgcolor: '#f9fafb' } }}>
                                        <Lock size={16} className="text-gray-500" />
                                        Change Password
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }} sx={{ color: '#dc2626', '&:hover': { bgcolor: '#fef2f2' } }}>
                                        <LogOut size={16} />
                                        Logout
                                    </MenuItem>
                                </MuiMenu>
                            </div>
                        )}
                    </div>

                    {/* Page Content */}
                    <div className="flex-grow p-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                            <Route path="dashboard" element={<AdminDashboardScreen />} />
                            {(userInfo?.role !== USER_ROLE.DIRECTOR) && (
                                <>
                                    <Route path="manage-directors" element={<ManageDirectorsScreen />} />
                                </>
                            )}
                            {(userInfo?.role === USER_ROLE.SUPER_ADMIN || userInfo?.role === USER_ROLE.ADMIN) && (
                                <Route path="manage-users" element={<ManageUsersPage />} />
                            )}
                            <Route path="add-director" element={<RegisterDirectorScreen />} />
                            <Route path="create-news" element={<CreateNewsScreen />} />
                            <Route path="manage-news" element={<ManageNewsScreen />} />
                            <Route path="view-proposals" element={<ViewProposalsScreen />} />
                            <Route path="manage-reviewers" element={<PendingReviewersPage />} />
                            <Route path="reviewer-settings" element={<ReviewerSettingsPage />} />
                            <Route path="proposal-details/:id" element={<ProposalDetails />} />
                            <Route path="user-profile/:id" element={<UserProfileScreen />} />
                            <Route path="create-announcement" element={<ProtectedRoute><CreateAnnouncementScreen /></ProtectedRoute>} />
                            <Route path="manage-announcements" element={<ProtectedRoute><ManageAnnouncementsScreen /></ProtectedRoute>} />
                            <Route path="create-blog" element={<ProtectedRoute><CreateblogScreen /></ProtectedRoute>} />
                            <Route path="manage-blog" element={<ProtectedRoute><ManageBlogScreen /></ProtectedRoute>} />
                            <Route path="manage-ads" element={<ProtectedRoute><ManageAdsScreen /></ProtectedRoute>} />
                            <Route path="create-ad" element={<ProtectedRoute><CreateAdScreen /></ProtectedRoute>} />
                            <Route path="manage-banner" element={<Navigate to="/admin/home-content" replace />} />
                            <Route path="home-content" element={<ProtectedRoute><HomePageContentManagementScreen /></ProtectedRoute>} />
                            <Route path="about-content" element={<ProtectedRoute><AboutUsContentManagementScreen /></ProtectedRoute>} />
                            <Route path="manage-inquiries" element={<ProtectedRoute><ManageContactContentPage defaultTab="inquiries" /></ProtectedRoute>} />
                            <Route path="manage-contact" element={<ProtectedRoute><ManageContactContentPage defaultTab="general" /></ProtectedRoute>} />
                            <Route path="manage-downloads" element={<ProtectedRoute><ManageDownloadsPage /></ProtectedRoute>} />
                            <Route path="create-download" element={<ProtectedRoute><CreateDownloadPage /></ProtectedRoute>} />
                    </Routes>
                </div>
            </div>

            <ChangePasswordDialog open={showChangePassword} onClose={() => setShowChangePassword(false)} />
        </div>
    );
};

export default AdminContextScreen;

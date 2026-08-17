import React, {useContext, useState} from "react";
import {Route, Routes, NavLink, Link, useNavigate, Navigate} from "react-router-dom";
import {CssBaseline} from "@mui/material";
import {
    Menu, X, LayoutDashboard, Users, Newspaper,
    FileText, Megaphone, BookOpen, LogOut, Lock, ExternalLink, ChevronDown
} from "lucide-react";
import { Tv, Image as ImageIcon } from "lucide-react";
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
import ManageBannerScreen from "./home/ManageBannerPage.tsx";
import ProtectedRoute from "../../ProtectedRoute";
import {USER_ROLE} from "../../constants/AppConstants.tsx";
import ChangePasswordDialog from "../../components/common/ChangePasswordDialog";
import PendingReviewersPage from "./reviewers/PendingReviewersPage.tsx";
import ReviewerSettingsPage from "./reviewer-settings/ReviewerSettingsPage.tsx";
import { UserCheck, Settings } from "lucide-react";

const SIDEBAR_WIDTH = 260;

const sidebarIcons: Record<string, React.ReactNode> = {
    "Dashboard": <LayoutDashboard size={18} />,
    "Manage Directors": <Users size={18} />,
    "Manage News": <Newspaper size={18} />,
    "Manage Proposals": <FileText size={18} />,
    "Pending Reviewers": <UserCheck size={18} />,
    "Reviewer Settings": <Settings size={18} />,
    "Manage Announcements": <Megaphone size={18} />,
    "Manage Blogs": <BookOpen size={18} />,
    "Manage Ads": <Tv size={18} />,
    "Manage Banner": <ImageIcon size={18} />,
};

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

    const sidebarLinks = [
        {path: "/admin/dashboard", label: "Dashboard"},
        ...(userInfo?.role !== USER_ROLE.DIRECTOR ? [{path: "/admin/manage-directors", label: "Manage Directors"}] : []),
        {path: "/admin/manage-news", label: "Manage News"},
        {path: "/admin/view-proposals", label: "Manage Proposals"},
        {path: "/admin/manage-reviewers", label: "Pending Reviewers"},
        {path: "/admin/reviewer-settings", label: "Reviewer Settings"},
        {path: "/admin/manage-announcements", label: "Manage Announcements"},
        {path: "/admin/manage-blog", label: "Manage Blogs"},
        {path: "/admin/manage-ads", label: "Manage Ads"},
        {path: "/admin/manage-banner", label: "Manage Banner"},
    ];

    const getInitial = () => (userInfo?.userName?.[0] || "A").toUpperCase();

    // ─── Sidebar Content (shared between desktop & mobile) ───
    const SidebarContent = ({onLinkClick}: { onLinkClick?: () => void }) => (
        <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #001d4a 0%, #003893 100%)' }}>
            {/* Logo */}
            <div className="px-5 py-5 flex items-center gap-3">
                <Link to="/admin/dashboard" onClick={onLinkClick}>
                    <img src={logo} alt="NIRDC Logo" className="h-9 w-auto brightness-0 invert" />
                </Link>
            </div>

            <div className="h-px bg-white/15 mx-4" />

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {sidebarLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        onClick={onLinkClick}
                        className={({isActive}) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline cursor-pointer ${
                                isActive
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        {sidebarIcons[link.label] || <FileText size={18} />}
                        {link.label}
                    </NavLink>
                ))}

                {/* Visit Website — opens in new tab */}
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline cursor-pointer text-white/70 hover:bg-white/10 hover:text-white mt-2 border-t border-white/10 pt-3"
                >
                    <ExternalLink size={18} />
                    Visit Website
                </a>
            </nav>
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
                            <Route path="manage-banner" element={<ProtectedRoute><ManageBannerScreen /></ProtectedRoute>} />
                    </Routes>
                </div>
            </div>

            <ChangePasswordDialog open={showChangePassword} onClose={() => setShowChangePassword(false)} />
        </div>
    );
};

export default AdminContextScreen;

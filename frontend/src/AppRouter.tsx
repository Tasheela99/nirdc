import { useContext, useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import Header from "./components/layout/HeaderComponent.tsx";
import FooterComponent from "./components/layout/FooterComponent.tsx";
import UserContext from "./store/UserContext.tsx";
import { USER_ROLE } from "./constants/AppConstants.tsx";

// ===== Lazy-loaded route components =====
// Auth
const LoginScreen = lazy(() => import("@/pages/auth/LoginScreen.tsx"));
const SignUpPage = lazy(() => import("@/pages/auth/RegisterScreen.tsx"));
const ResendOtpPage = lazy(() => import("@/pages/auth/ResendOtpScreen.tsx"));
const ForgottenPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordScreen.tsx"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordScreen.tsx"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailScreen.tsx"));
const ForceChangePasswordScreen = lazy(() => import("@/pages/auth/ForceChangePasswordScreen.tsx"));

const VerifyAccountScreen = lazy(() => import("@/pages/auth/VerifyAccountScreen.tsx"));
const ReviewerRegistrationPage = lazy(() => import("@/pages/auth/ReviewerRegistrationScreen.tsx"));

// Public pages
const HomePage = lazy(() => import("@/pages/public/HomePage.tsx"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage.tsx"));
const StrategicObjectivesScreen = lazy(() => import("@/pages/public/home/StrategicObjectivesPage.tsx"));
const NewsUpdatesScreen = lazy(() => import("@/pages/public/home/NewsUpdatesPage.tsx"));
const MainBannerPage = lazy(() => import("@/pages/public/home/MainBannerPage.tsx"));
const PrivacyPolicy = lazy(() => import("@/pages/public/PrivacyPolicyPage.tsx"));

// Proposals
const Proposal = lazy(() => import("@/pages/user/proposals/ProposalPage.tsx"));
const MainPageScreen = lazy(() => import("@/pages/user/proposals/MainPage.tsx"));
const RelevantAvenuesScreen = lazy(() => import("@/pages/user/proposals/RelevantAvenuesPage.tsx"));
const InvestorApplicationScreen = lazy(() => import("@/pages/user/proposals/applications/InvestorApplicationPage.tsx"));
const ResearchInvestmentApplicationScreen = lazy(() => import("@/pages/user/proposals/applications/ResearchInvestmentApplicationPage.tsx"));
const ResearchProposalApplicationScreen = lazy(() => import("@/pages/user/proposals/applications/ResearchProposalApplicationPage.tsx"));
const ProposalDetails = lazy(() => import("@/pages/proposals/ProposalDetailsPage.tsx"));
const ViewProposalsScreen = lazy(() => import("@/pages/admin/proposals/ViewProposalsPage.tsx"));
const ViewMyProposals = lazy(() => import("@/pages/user/proposals/my-proposals/ViewMyProposals.tsx"));

// Guidelines
const ResearchInvestmentGuidelines = lazy(() => import("@/pages/public/proposals/guidelines/ResearchInvestmentGuidelinesPage.tsx"));
const InvestorGuidelinesScreen = lazy(() => import("@/pages/public/proposals/guidelines/InvestorGuidelinesPage.tsx"));
const ResearchProposalGuidelines = lazy(() => import("@/pages/public/proposals/guidelines/ResearcherGuidelinesPage.tsx"));

// News / Announcements / Blogs
const NewsViewScreen = lazy(() => import("@/pages/public/news/NewsViewPage.tsx"));
const AllNewsScreen = lazy(() => import("@/pages/public/news/AllNewsPage.tsx"));
const AnnouncementScreen = lazy(() => import("@/pages/public/announcement/AnnouncementPage.tsx"));
const AnnouncementViewScreen = lazy(() => import("@/pages/public/announcement/AnnouncementViewPage.tsx"));
const BlogScreen = lazy(() => import("@/pages/public/blog/BlogPage.tsx"));
const BlogViewScreen = lazy(() => import("@/pages/public/blog/BlogViewPage.tsx"));

// Admin / Director (heavy chunks — lazy loaded)
const AdminContextScreen = lazy(() => import("@/pages/admin/AdminContextPage.tsx"));
const DirectorContextScreen = lazy(() => import("@/pages/director/DirectorContextPage.tsx"));
const ReviewerContextScreen = lazy(() => import("@/pages/reviewer/ReviewerContextPage.tsx"));
const CreateNewsScreen = lazy(() => import("@/pages/admin/news/CreateNewsPage.tsx"));
const CreateAnnouncementScreen = lazy(() => import("@/pages/admin/announcement/CreateAnnouncementPage.tsx"));
const CreateblogScreen = lazy(() => import("@/pages/admin/blog/CreateBlogPage.tsx"));
const NotFoundScreen = lazy(() => import("@/pages/public/NotFoundPage.tsx"));

import ProtectedRoute from "./ProtectedRoute";

// Loading fallback
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    </div>
);


const AppRouter = () => {
    const { userInfo } = useContext(UserContext);
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    const isAdminRoute = location.pathname.startsWith("/admin");
    const isDirectorRoute = location.pathname.startsWith("/director");
    const isReviewerRoute = location.pathname.startsWith("/reviewer") && location.pathname !== "/reviewer-registration";

    useEffect(() => {
        if (userInfo !== undefined) {
            setLoading(false);
        }
    }, [userInfo]);

    if (loading) {
        return <LoadingSpinner />;
    }

    const hideLayout = isAdminRoute || isDirectorRoute || isReviewerRoute;

    return (
        <>
            {/* Header */}
            {!hideLayout && <Header />}

            <div className="flex flex-auto flex-col min-h-[calc(100vh-64px)]">
                <div className="flex-grow flex flex-col">
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/research-investment-guidelines" element={<ResearchInvestmentGuidelines />} />
                            <Route path="/investor-guidelines" element={<InvestorGuidelinesScreen />} />
                            <Route path="/research-proposal-guidelines" element={<ResearchProposalGuidelines />} />
                            <Route path="/login" element={<LoginScreen />} />
                            <Route path="/register" element={<SignUpPage />} />
                            <Route path="/reviewer-registration" element={<ReviewerRegistrationPage />} />
                            <Route path="/mainbanner" element={<MainBannerPage />} />
                            <Route path="/about-us" element={<AboutPage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/strategic-objectives" element={<StrategicObjectivesScreen />} />
                            <Route path="/updates-news" element={<NewsUpdatesScreen />} />
                            <Route path="/all-news" element={<AllNewsScreen />} />
                            <Route path="/news-updates/:id" element={<NewsViewScreen />} />
                            <Route path="/resend-otp" element={<ResendOtpPage />} />
                            <Route path="/forgotten-password" element={<ForgottenPasswordPage />} />
                            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                            <Route path="/verify-email/:email?" element={<VerifyEmailPage />} />

                            <Route path="/security/verify-account/:email?" element={<VerifyAccountScreen />} />
                            <Route path="/force-change-password" element={<ForceChangePasswordScreen />} />
                            <Route path="/announcements" element={<AnnouncementScreen />} />
                            <Route path="/announcements/:id" element={<AnnouncementViewScreen />} />
                            <Route path="/blogs" element={<BlogScreen />} />
                            <Route path="/blogs/:id" element={<BlogViewScreen />} />

                            {/* Proposal Routes */}
                            <Route path="/proposal" element={<ProtectedRoute path="/proposal"><Proposal /></ProtectedRoute>} />
                            <Route path="/forgotten-password" element={<ForgottenPasswordPage />} />
                            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                            <Route path="/main-page" element={<ProtectedRoute path="/main-page"><MainPageScreen /></ProtectedRoute>} />
                            <Route path="/relevant" element={<RelevantAvenuesScreen />} />

                            {/* User-only Routes */}
                            {(userInfo?.role === USER_ROLE.USER) && (
                                <>
                                    <Route path="/investor-application/:title" element={<InvestorApplicationScreen />} />
                                    <Route path="/research-investment-application/:title" element={<ResearchInvestmentApplicationScreen />} />
                                    <Route path="/research-proposal-application/:title" element={<ResearchProposalApplicationScreen />} />
                                    <Route path="/view-my-proposals" element={<ViewMyProposals />} />
                                </>
                            )}

                            {/* Admin/Director/Reviewer Routes */}
                            {(userInfo?.role === USER_ROLE.ADMIN || userInfo?.role === USER_ROLE.DIRECTOR ||
                                userInfo?.role === USER_ROLE.SUPER_ADMIN || userInfo?.role === USER_ROLE.REVIEWER) && (
                                <>
                                    <Route path="/dashboard" element={<Navigate to={userInfo?.role === USER_ROLE.REVIEWER ? "/reviewer/dashboard" : "/admin/dashboard"} replace />} />
                                    <Route path="/admin/*" element={<ProtectedRoute path="/admin"><AdminContextScreen /></ProtectedRoute>} />
                                    <Route path="/reviewer/*" element={<ProtectedRoute path="/reviewer"><ReviewerContextScreen /></ProtectedRoute>} />
                                </>
                            )}

                            {(userInfo?.role === USER_ROLE.DIRECTOR) && (
                                <>
                                    <Route path="/director/create-blog" element={<ProtectedRoute path="/director/create-blog"><CreateblogScreen /></ProtectedRoute>} />
                                    <Route path="/director/create-announcement" element={<ProtectedRoute path="/director/create-announcement"><CreateAnnouncementScreen /></ProtectedRoute>} />
                                    <Route path="/director/create-news" element={<ProtectedRoute path="/director/create-news"><CreateNewsScreen /></ProtectedRoute>} />
                                    <Route path="/director/proposal-details/:id" element={<ProtectedRoute path="/director/proposal-details/:id"><ProposalDetails /></ProtectedRoute>} />
                                    <Route path="/proposal-details/:id" element={<ProtectedRoute path="/proposal-details/:id"><ProposalDetails /></ProtectedRoute>} />
                                    <Route path="/view-proposals" element={<ProtectedRoute path="/view-proposals"><ViewProposalsScreen /></ProtectedRoute>} />
                                    <Route path="/director/*" element={<ProtectedRoute path="/director"><DirectorContextScreen /></ProtectedRoute>} />
                                </>
                            )}

                            <Route path="*" element={<NotFoundScreen />} />
                        </Routes>
                    </Suspense>
                </div>

                {/* Footer */}
                {(!hideLayout && location.pathname !== "/reviewer-registration") && <FooterComponent />}
            </div>
        </>
    );
};

export default AppRouter;
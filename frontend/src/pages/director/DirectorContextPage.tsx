import { useContext, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import UserContext from "../../store/UserContext";
import { USER_ROLE } from "../../constants/AppConstants";
import Header from "../../components/layout/HeaderComponent";
import FooterComponent from "../../components/layout/FooterComponent";
import AdminDashboardScreen from "../admin/AdminDashboardPage";
import CreateNewsScreen from "../admin/news/CreateNewsPage";
import ManageNewsScreen from "../admin/news/ManageNewsPage";
import ViewProposalsScreen from "../admin/proposals/ViewProposalsPage";
import ProposalDetails from "../proposals/ProposalDetailsPage";
import ProtectedRoute from "../../ProtectedRoute";
import CreateAnnouncementScreen from "../admin/announcement/CreateAnnouncementPage";
import ManageAnnouncementsScreen from "../admin/announcement/ManageAnnouncementsPage";
import ManageBlogScreen from "../admin/blog/ManageBlogPage";
import CreateblogScreen from "../admin/blog/CreateBlogPage";

const DirectorContextScreen = () => {
    const { userInfo } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userInfo !== undefined) {
            setLoading(false);
        }
    }, [userInfo]);

    // Check if user is director
    useEffect(() => {
        if (userInfo && userInfo.role !== USER_ROLE.DIRECTOR) {
            // Redirect non-directors
            window.location.href = "/";
        }
    }, [userInfo]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {/* Custom header for director dashboard */}
            <Header />
            <div className="flex flex-auto flex-col">
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Navigate to="/"/>}/>
                        <Route path="dashboard" element={<AdminDashboardScreen/>}/>
                        <Route path="create-news" element={<ProtectedRoute><CreateNewsScreen/></ProtectedRoute>}/>
                        <Route path="manage-news" element={<ProtectedRoute><ManageNewsScreen/></ProtectedRoute>}/>
                        <Route path="view-proposals" element={<ProtectedRoute><ViewProposalsScreen/></ProtectedRoute>}/>
                        <Route path="proposal-details/:id" element={<ProtectedRoute><ProposalDetails/></ProtectedRoute>}/>
                        <Route path="create-announcement" element={<ProtectedRoute><CreateAnnouncementScreen /></ProtectedRoute>} />
                        <Route path="manage-announcements" element={<ProtectedRoute><ManageAnnouncementsScreen /></ProtectedRoute>} />
                        <Route path="create-blog" element={<ProtectedRoute><CreateblogScreen /></ProtectedRoute>} />
                        <Route path="manage-blog" element={<ProtectedRoute><ManageBlogScreen /></ProtectedRoute>} />
                        {/* Default redirect for invalid director routes */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </div>
            <FooterComponent />
        </>
    );
};

export default DirectorContextScreen;
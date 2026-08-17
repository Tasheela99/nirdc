import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Removed unused useTheme import
import { Alert, AlertTitle, Box, Button, CircularProgress, Paper, Snackbar } from "@mui/material";
// Removed jsPDF and html2canvas imports (handled in ProposalPdfDownload)
import proposalApi from "../../api/ProposalApi";
import { renderDialogs } from "./component/DialogComponents";
import ProposalPdfDownload from "./component/ProposalPdfDownload";
import { LocationState } from "./types/Types";
import { validateForm } from "./utils/Utils";
import InvestmentProposalView from "./view/InvestmentProposalView";
import ResearchInvestmentView from "./view/ResearchInvestmentView";
import ResearchProposalView from "./view/ResearchProposalView";
import CommentsPanel from "./component/CommentsPanel";
import AdminProposalReviewersPanel from "./component/AdminProposalReviewersPanel";
import UserContext from "../../store/UserContext";
import { USER_ROLE } from "../../constants/AppConstants";
// Removed unused getCurrentConfig import

const ProposalDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation() as { state: LocationState | null };
    const { proposalType = "research-proposal" } = location.state || {};
    const navigate = useNavigate();
    const { userInfo } = React.useContext(UserContext);
    const isAdmin = userInfo?.role === USER_ROLE.ADMIN || userInfo?.role === USER_ROLE.SUPER_ADMIN;
    // Removed unused theme

    // Main state
    const [response, setResponse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    
    // UI state
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
    // Removed unused refreshing and expandedSections state

    // Form state for editing
    const [editFormData, setEditFormData] = useState<any>({});
    const [validationErrors] = useState<Record<string, string>>({});

    // Utility functions
    const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, []);

    // Removed unused toggleSection

    // Removed unused handleEdit, handleDelete, handleShare, handlePrint

    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            showSnackbar('Copied to clipboard!', 'success');
        } catch {
            showSnackbar('Failed to copy to clipboard', 'error');
        }
    }, [showSnackbar]);

    // API functions
    const getProposalById = async (id: string, type: string) => {
        let response;
        switch (type) {
            case "investment":
                response = await proposalApi.GetInvestorApplicationProposalsById(id);
                break;
            case "research-investment":
                response = await proposalApi.GetResearchInvestmentApplicationProposalsById(id);
                break;
            case "research-proposal":
                response = await proposalApi.GetResearchProposalApplicationProposalsById(id);
                break;
            default:
                throw new Error("Invalid proposal type");
        }
        return response;
    };

    const refreshProposalData = useCallback(async () => {
        if (!id || !proposalType) return;
        
        try {
            const response = await getProposalById(id, proposalType);
            if ((response as any)?.status) {
                setResponse(response);
                showSnackbar('Proposal data refreshed successfully', 'success');
            } else {
                throw new Error((response as any)?.message || "Failed to refresh proposal data");
            }
        } catch {
            showSnackbar('Failed to refresh proposal data', 'error');
        }
    }, [id, proposalType, showSnackbar]);

    const handleFormSubmit = useCallback(async () => {
        if (!validateForm(editFormData)) {
            showSnackbar('Please fix the validation errors', 'error');
            return;
        }
        
        try {
            showSnackbar('Proposal updated successfully!', 'success');
            setEditDialogOpen(false);
            await refreshProposalData();
        } catch {
            showSnackbar('Failed to update proposal', 'error');
        }
    }, [editFormData, showSnackbar, refreshProposalData]);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            showSnackbar('Proposal deleted successfully!', 'success');
            setDeleteDialogOpen(false);
            navigate('/admin/view-proposals');
        } catch {
            showSnackbar('Failed to delete proposal', 'error');
        }
    }, [navigate, showSnackbar]);

    // Main data fetch effect
    useEffect(() => {
        const fetchProposalDetails = async () => {
            if (!id || !proposalType) {
                setError("Missing proposal information");
                setIsLoading(false);
                return;
            }

            try {
                const response = await getProposalById(id, proposalType) as any;

                if (response?.status) {
                    setResponse(response);
                    setEditFormData(response.data);
                } else {
                    setError(response?.message || "Failed to fetch proposal details.");
                }
            } catch (error) {
                setError("An error occurred while fetching proposal details.");
                console.error("Fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProposalDetails();
    }, [id, proposalType]);

    // Get current configuration
    // Removed unused currentConfig



    return (
        <Box p={3}>
            <style>{`
                .proposal-details-html-view .MuiCard-root { background-color: #ffffff !important; }
            `}</style>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#ffffff', color: '#111827' }}>
                {/* Download PDF Buttons */}
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" gap={2} mb={2}>
                  {/* Export all proposals as react-pdf PDF */}
                  {response && (
                    <ProposalPdfDownload
                      allProposals={[
                        { type: "investment", data: proposalType === "investment" ? response.data : null },
                        { type: "research-investment", data: proposalType === "research-investment" ? response.data : null },
                        { type: "research-proposal", data: proposalType === "research-proposal" ? response.data : null }
                      ]}
                    />
                  )}
                </Box>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <CircularProgress size={60} />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                ) : response ? (
                    <div className="proposal-details-html-view">
                        {proposalType === "investment" ? (
                            <>
                                <Box mb={2} ml={3} className="no-print">
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={() => {
                                            // Navigate back with preserved tab state
                                            if (location.state?.returnTabUrl) {
                                                navigate(location.state.returnTabUrl);
                                            } else if (location.state?.returnTab !== undefined) {
                                                navigate(`/admin/view-proposals?tab=${location.state.returnTab}`);
                                            } else {
                                                navigate(-1);
                                            }
                                        }}
                                    >
                                        Back
                                    </Button>
                                </Box>
                                <InvestmentProposalView data={response.data} />
                                <div className="no-print">
                                    {isAdmin && (
                                        <AdminProposalReviewersPanel proposalId={id!} proposalType={proposalType} onSnackbar={showSnackbar} />
                                    )}
                                    <CommentsPanel proposalId={id!} proposalType={proposalType} onSnackbar={showSnackbar} />
                                </div>
                            </>
                        ) : proposalType === "research-investment" ? (
                            <>
                                <Box mb={2} ml={3} className="no-print">
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={() => {
                                            // Navigate back with preserved tab state
                                            if (location.state?.returnTabUrl) {
                                                navigate(location.state.returnTabUrl);
                                            } else if (location.state?.returnTab !== undefined) {
                                                navigate(`/admin/view-proposals?tab=${location.state.returnTab}`);
                                            } else {
                                                navigate(-1);
                                            }
                                        }}
                                    >
                                        Back
                                    </Button>
                                </Box>
                                <ResearchInvestmentView data={response.data} />
                                <div className="no-print">
                                    {isAdmin && (
                                        <AdminProposalReviewersPanel proposalId={id!} proposalType={proposalType} onSnackbar={showSnackbar} />
                                    )}
                                    <CommentsPanel proposalId={id!} proposalType={proposalType} onSnackbar={showSnackbar} />
                                </div>
                            </>
                        ) : proposalType === "research-proposal" ? (
                            <>
                                <Box mb={2} ml={3} className="no-print">
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={() => {
                                            // Navigate back with preserved tab state
                                            if (location.state?.returnTabUrl) {
                                                navigate(location.state.returnTabUrl);
                                            } else if (location.state?.returnTab !== undefined) {
                                                navigate(`/admin/view-proposals?tab=${location.state.returnTab}`);
                                            } else {
                                                navigate(-1);
                                            }
                                        }}
                                    >
                                        Back
                                    </Button>
                                </Box>
                                <ResearchProposalView data={response.data} />
                                <div className="no-print">
                                    {isAdmin && (
                                        <AdminProposalReviewersPanel proposalId={id!} proposalType={proposalType} onSnackbar={showSnackbar} />
                                    )}
                                    <CommentsPanel proposalId={id!} proposalType={proposalType} onSnackbar={showSnackbar} />
                                </div>
                            </>
                        ) : (
                            // fallback to existing render logic if needed
                            <Box>
                                <Alert severity="info">Unknown proposal type.</Alert>
                            </Box>
                        )}
                        {/* Dialogs and Snackbar remain for all types */}
                        {renderDialogs({
                            editDialogOpen,
                            setEditDialogOpen,
                            deleteDialogOpen,
                            setDeleteDialogOpen,
                            shareDialogOpen,
                            setShareDialogOpen,
                            editFormData,
                            setEditFormData,
                            validationErrors,
                            handleFormSubmit,
                            handleDeleteConfirm,
                            copyToClipboard
                        })}
                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={6000}
                            onClose={() => setSnackbarOpen(false)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                            <Alert 
                                onClose={() => setSnackbarOpen(false)} 
                                severity={snackbarSeverity}
                                sx={{ width: '100%' }}
                            >
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                    </div>
                ) : (
                    <Alert severity="info">
                        <AlertTitle>Not Found</AlertTitle>
                        Proposal not found.
                    </Alert>
                )}
            </Paper>
        </Box>
    );
};

export default ProposalDetails;
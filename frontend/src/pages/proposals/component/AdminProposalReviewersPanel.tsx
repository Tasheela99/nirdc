import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    Button,
    CircularProgress,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    IconButton
} from "@mui/material";
import { Users, Plus, CheckCircle, Clock, Trash2, ShieldCheck } from "lucide-react";
import reviewAssignmentApi from "../../../api/ReviewAssignmentApi";
import adminApi from "../../../api/AdminApi";

interface Props {
    proposalId: string;
    proposalType: string;
    onSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const AdminProposalReviewersPanel: React.FC<Props> = ({ proposalId, proposalType, onSnackbar }) => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Assign Dialog state
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [availableReviewers, setAvailableReviewers] = useState<any[]>([]);
    const [selectedReviewerId, setSelectedReviewerId] = useState("");
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        if (proposalId) {
            fetchAssignments();
        }
    }, [proposalId]);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const response = await reviewAssignmentApi.getReviewsForProposal(proposalId);
            if (response.status) {
                setAssignments(response.data);
            } else {
                onSnackbar(response.message || "Failed to fetch reviewers", "error");
            }
        } catch (error) {
            onSnackbar("Error fetching reviewers", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAssignDialog = async () => {
        if (assignments.length >= 3) {
            onSnackbar("Maximum of 3 reviewers can be assigned to a proposal.", "warning");
            return;
        }

        setAssignDialogOpen(true);
        try {
            // Fetch all approved reviewers
            const response: any = await adminApi.getApprovedReviewers();
            if (response?.data) {
                const reviewers = response.data;
                
                // Filter out already assigned reviewers
                const assignedIds = assignments.map(a => a.reviewerId._id);
                const unassigned = reviewers.filter((r: any) => !assignedIds.includes(r._id));
                
                setAvailableReviewers(unassigned);
            }
        } catch (error) {
            onSnackbar("Failed to fetch available reviewers", "error");
        }
    };

    const handleAssign = async () => {
        if (!selectedReviewerId) {
            onSnackbar("Please select a reviewer", "error");
            return;
        }
        
        setAssigning(true);
        try {
            const response = await reviewAssignmentApi.assignReviewer(proposalId, proposalType, selectedReviewerId);
            if (response.status) {
                onSnackbar("Reviewer assigned successfully", "success");
                setAssignDialogOpen(false);
                setSelectedReviewerId("");
                fetchAssignments();
            } else {
                onSnackbar(response.message || "Failed to assign reviewer", "error");
            }
        } catch (error) {
            onSnackbar("Error assigning reviewer", "error");
        } finally {
            setAssigning(false);
        }
    };

    const handleRemoveAssignment = async (assignmentId: string) => {
        if (!window.confirm("Are you sure you want to remove this reviewer assignment?")) return;
        
        try {
            const response = await reviewAssignmentApi.removeAssignment(assignmentId);
            if (response.status) {
                onSnackbar("Reviewer removed successfully", "success");
                fetchAssignments();
            } else {
                onSnackbar(response.message || "Failed to remove reviewer", "error");
            }
        } catch (error) {
            onSnackbar("Error removing reviewer", "error");
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase() || 'R';
    };

    return (
        <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', mb: 4, overflow: 'hidden', bgcolor: '#ffffff', color: '#111827' }}>
            <Box p={3} borderBottom="1px solid #e2e8f0" display="flex" justifyContent="space-between" alignItems="center" bgcolor="#f8fafc">
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Users size={20} className="text-[#111827]" />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Assigned Reviewers ({assignments.length}/3)
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<Plus size={16} />}
                    onClick={handleOpenAssignDialog}
                    disabled={assignments.length >= 3}
                    sx={{ bgcolor: '#111827', '&:hover': { bgcolor: '#374151' }, textTransform: 'none', borderRadius: '8px' }}
                >
                    Assign Reviewer
                </Button>
            </Box>

            <Box p={3}>
                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress size={30} sx={{ color: '#111827' }} />
                    </Box>
                ) : assignments.length === 0 ? (
                    <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                        <ShieldCheck size={40} className="text-gray-300 mb-2" />
                        <Typography color="textSecondary" variant="body2">No reviewers assigned yet.</Typography>
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={3}>
                        {assignments.map((assignment, index) => (
                            <Box key={assignment._id}>
                                {index > 0 && <Divider sx={{ my: 3 }} />}
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                                    <Box display="flex" gap={2}>
                                        <Avatar sx={{ bgcolor: '#f1f5f9', color: '#111827', border: '1px solid #e2e8f0' }}>
                                            {getInitials(assignment.reviewerId?.firstName, assignment.reviewerId?.lastName)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                {assignment.reviewerId?.firstName} {assignment.reviewerId?.lastName}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" display="block">
                                                {assignment.reviewerId?.designation} at {assignment.reviewerId?.institution}
                                            </Typography>
                                            <Box display="flex" gap={1} mt={0.5}>
                                                {assignment.status === 'COMPLETED' ? (
                                                    <Chip icon={<CheckCircle size={12} />} label="Reviewed" size="small" color="success" sx={{ height: '20px', fontSize: '0.65rem' }} />
                                                ) : (
                                                    <Chip icon={<Clock size={12} />} label="Pending" size="small" color="warning" sx={{ height: '20px', fontSize: '0.65rem' }} />
                                                )}
                                                <Typography variant="caption" color="textSecondary">
                                                    Assigned: {new Date(assignment.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    
                                    {assignment.status === 'COMPLETED' ? (
                                        <Box textAlign="right">
                                            <Typography variant="caption" color="textSecondary" display="block">Marks Awarded</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                                {assignment.marks} <Typography component="span" variant="caption" color="textSecondary">/ 100</Typography>
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <IconButton size="small" onClick={() => handleRemoveAssignment(assignment._id)} sx={{ color: '#ef4444' }} title="Remove Reviewer">
                                            <Trash2 size={18} />
                                        </IconButton>
                                    )}
                                </Box>
                                
                                {assignment.status === 'COMPLETED' && assignment.comment && (
                                    <Box mt={2} p={2} bgcolor="#f8fafc" borderRadius="8px" border="1px solid #f1f5f9">
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', mb: 1, display: 'block' }}>REVIEWER'S FEEDBACK:</Typography>
                                        <Typography variant="body2" sx={{ color: '#334155', whiteSpace: 'pre-wrap' }}>
                                            {assignment.comment}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Assign Dialog */}
            <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>Assign Reviewer</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="textSecondary" mb={3}>
                        Select an approved reviewer to evaluate this proposal. They will be notified automatically.
                    </Typography>
                    <FormControl fullWidth size="small">
                        <InputLabel id="reviewer-select-label">Select Reviewer</InputLabel>
                        <Select
                            labelId="reviewer-select-label"
                            value={selectedReviewerId}
                            label="Select Reviewer"
                            onChange={(e) => setSelectedReviewerId(e.target.value)}
                        >
                            {availableReviewers.length === 0 ? (
                                <MenuItem disabled value="">
                                    <em>No available approved reviewers</em>
                                </MenuItem>
                            ) : (
                                availableReviewers.map((reviewer) => (
                                    <MenuItem key={reviewer._id} value={reviewer._id}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {reviewer.firstName} {reviewer.lastName}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {reviewer.areasOfExpertise?.slice(0, 2).join(', ')} {reviewer.areasOfExpertise?.length > 2 ? '...' : ''}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setAssignDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button 
                        onClick={handleAssign} 
                        variant="contained" 
                        disabled={assigning || !selectedReviewerId}
                        sx={{ bgcolor: '#6B1D4A', '&:hover': { bgcolor: '#8C2963' } }}
                    >
                        {assigning ? <CircularProgress size={24} color="inherit" /> : 'Assign Reviewer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default AdminProposalReviewersPanel;

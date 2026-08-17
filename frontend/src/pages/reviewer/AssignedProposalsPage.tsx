import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    TablePagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Clock } from "lucide-react";
import reviewAssignmentApi from "../../api/ReviewAssignmentApi";
import { useAlert } from "../../components/common/AlertContextScreen";

const AssignedProposalsPage = () => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    // Review Dialog State
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [marks, setMarks] = useState<number | ''>('');
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchAssignments();
    }, [page, rowsPerPage]);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const response = await reviewAssignmentApi.getAssignedProposals(page + 1, rowsPerPage);
            if (response.status) {
                setAssignments(response.data);
                if (response.pagination) {
                    setTotalCount(response.pagination.total);
                } else {
                    setTotalCount(response.data.length);
                }
            } else {
                showAlert(response.message || "Failed to fetch assignments", "error");
            }
        } catch (error) {
            showAlert("An error occurred while fetching assignments", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReviewDialog = (assignment: any) => {
        setSelectedAssignment(assignment);
        setMarks(assignment.marks !== null ? assignment.marks : '');
        setComment(assignment.comment || "");
        setReviewDialogOpen(true);
    };

    const handleCloseReviewDialog = () => {
        setReviewDialogOpen(false);
        setSelectedAssignment(null);
        setMarks('');
        setComment('');
    };

    const handleSubmitReview = async () => {
        if (marks === '' || Number(marks) < 0 || Number(marks) > 100) {
            showAlert("Please enter valid marks between 0 and 100", "error");
            return;
        }
        if (!comment.trim()) {
            showAlert("Please enter a comment", "error");
            return;
        }

        setSubmitting(true);
        try {
            const response = await reviewAssignmentApi.submitReview(selectedAssignment._id, Number(marks), comment);
            if (response.status) {
                showAlert("Review submitted successfully!", "success");
                handleCloseReviewDialog();
                fetchAssignments(); // Refresh list
            } else {
                showAlert(response.message || "Failed to submit review", "error");
            }
        } catch (error) {
            showAlert("An error occurred while submitting review", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const navigateToProposal = (assignment: any) => {
        navigate(`/reviewer/proposal-details/${assignment.proposalId}`, {
            state: { proposalType: assignment.proposalType }
        });
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, md: 4 } }}>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#6B1D4A' }}>
                        Assigned Proposals
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        Manage and submit your reviews for the proposals assigned to you.
                    </Typography>
                </Box>
            </Box>

            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', bgcolor: '#ffffff', color: '#111827' }}>
                <TableContainer component={Paper} elevation={0} sx={{ bgcolor: '#ffffff' }}>
                    <Table sx={{ minWidth: 650, bgcolor: '#ffffff' }}>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Proposal ID / Title</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Assigned Date</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <CircularProgress size={40} sx={{ color: '#6B1D4A' }} />
                                    </TableCell>
                                </TableRow>
                            ) : assignments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                            <FileText size={48} className="text-gray-300" />
                                            <Typography variant="body1" color="textSecondary">
                                                No proposals have been assigned to you yet.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                assignments.map((assignment) => (
                                    <TableRow key={assignment._id} hover>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {assignment.proposalDetails?.applicationId || assignment.proposalId}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={assignment.proposalType.replace('-', ' ').toUpperCase()}
                                                size="small"
                                                sx={{ fontSize: '0.7rem', bgcolor: '#f1f5f9', color: '#111827', fontWeight: 600, border: '1px solid #e2e8f0' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {assignment.status === 'COMPLETED' ? (
                                                <Chip icon={<CheckCircle size={14} />} label="Completed" size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, bgcolor: '#f1f5f9', color: '#111827', border: '1px solid #e2e8f0' }} />
                                            ) : (
                                                <Chip icon={<Clock size={14} />} label="Pending Review" size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, bgcolor: '#f1f5f9', color: '#111827', border: '1px solid #e2e8f0' }} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(assignment.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box display="flex" justifyContent="flex-end" gap={1}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => navigateToProposal(assignment)}
                                                    sx={{ borderColor: '#e2e8f0', color: '#475569', textTransform: 'none' }}
                                                >
                                                    View Proposal
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    onClick={() => handleOpenReviewDialog(assignment)}
                                                    sx={{ bgcolor: '#111827', '&:hover': { bgcolor: '#374151' }, textTransform: 'none' }}
                                                >
                                                    {assignment.status === 'COMPLETED' ? 'Edit Review' : 'Submit Review'}
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ color: '#111827', '.MuiTablePagination-selectIcon': { color: '#111827' } }}
                />
            </Card>

            {/* Submit Review Dialog */}
            <Dialog
                open={reviewDialogOpen}
                onClose={handleCloseReviewDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { bgcolor: '#ffffff', color: '#111827' } }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
                    {selectedAssignment?.status === 'COMPLETED' ? 'Edit Review' : 'Submit Review'}
                </DialogTitle>
                <DialogContent dividers sx={{ borderColor: '#e2e8f0' }}>
                    <Box display="flex" flexDirection="column" gap={3} py={1}>
                        <TextField
                            label="Marks (0-100)"
                            type="number"
                            value={marks}
                            onChange={(e) => setMarks(e.target.value === '' ? '' : Number(e.target.value))}
                            fullWidth
                            required
                            sx={{ '& .MuiInputBase-root': { color: '#111827' }, '& .MuiInputLabel-root': { color: '#475569' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' } }}
                        />
                        <TextField
                            label="Comments / Feedback"
                            multiline
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            fullWidth
                            required
                            sx={{ '& .MuiInputBase-root': { color: '#111827' }, '& .MuiInputLabel-root': { color: '#475569' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <Button onClick={handleCloseReviewDialog} sx={{ color: '#475569' }} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmitReview}
                        variant="contained"
                        disabled={submitting || !marks || !comment.trim()}
                        sx={{ bgcolor: '#111827', '&:hover': { bgcolor: '#374151' } }}
                    >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Review'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AssignedProposalsPage;

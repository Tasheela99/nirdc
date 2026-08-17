import { useState, useEffect } from "react";
import { Typography, Button, TableCell, TableRow, Chip, Tabs, Tab, Box, IconButton, TablePagination } from "@mui/material";
import { FileText, Trash2 } from "lucide-react";
import { callAPI } from "../../../config/AxiosInstance";
import { useAlert } from "../../../components/common/AlertContextScreen";
import adminApi from "../../../api/AdminApi";
import DeleteUserDialog from "../../../components/admin/DeleteUserDialog";
import AdminTable from "../../../components/admin/AdminTable";

interface Reviewer {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    designation: string;
    institution: string;
    mcqScore: number;
    reviewerCvUrl: string;
    areasOfExpertise: string[];
    createdAt: string;
    reviewerStatus: string;
}

const PendingReviewersPage = () => {
    const { showAlert } = useAlert();
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
    const [password, setPassword] = useState("");

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchReviewers();
    }, [page, rowsPerPage, filter]);

    const fetchReviewers = async () => {
        setIsLoading(true);
        try {
            const response = await callAPI<any>("GET", `/users/admin/reviewers/all?page=${page + 1}&limit=${rowsPerPage}&status=${filter}`);
            if (response.data && Array.isArray(response.data)) {
                setReviewers(response.data);
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                setReviewers(response.data.data);
            } else if (Array.isArray(response)) {
                setReviewers(response);
            }
            if (response.pagination) {
                setTotalCount(response.pagination.total);
            } else if (response.data && Array.isArray(response.data)) {
                setTotalCount(response.data.length);
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                setTotalCount(response.data.data.length);
            }
        } catch (error) {
            console.error("Error fetching pending reviewers", error);
            showAlert("Failed to load pending reviewers.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        if (!window.confirm(`Are you sure you want to ${action} this reviewer?`)) return;
        
        setIsActionLoading(id);
        try {
            await callAPI("PUT", `/users/admin/reviewers/${id}/${action}`);
            showAlert(`Reviewer ${action}d successfully.`, "success");
            fetchReviewers();
        } catch (error) {
            showAlert(`Failed to ${action} reviewer.`, "error");
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleDeleteReviewer = async () => {
        if (!userToDelete) return;
        try {
            await adminApi.deleteUser(userToDelete.id, password);
            showAlert("Reviewer deleted successfully.", "success");
            fetchReviewers();
        } catch (error: any) {
            showAlert(error.response?.data?.message || "Failed to delete reviewer.", "error");
        } finally {
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
            setPassword("");
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (newValue: 'ALL' | 'PENDING' | 'APPROVED') => {
        setFilter(newValue);
        setPage(0); // Reset to first page when changing filter
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">Reviewers Management</h1>
                <p className="text-[#64748B]">Manage all pending and approved reviewers in the system.</p>
            </div>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={filter} onChange={(_, v) => handleFilterChange(v)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }} textColor="primary" indicatorColor="primary">
                    <Tab label={`All`} value="ALL" />
                    <Tab label={`Pending`} value="PENDING" />
                    <Tab label={`Approved`} value="APPROVED" />
                </Tabs>
            </Box>

            <AdminTable
                isLoading={isLoading}
                emptyMessage="No reviewers found."
                columns={[
                    { key: 'name', label: 'Name' },
                    { key: 'email', label: 'Email' },
                    { key: 'institution', label: 'Institution' },
                    { key: 'expertise', label: 'Expertise' },
                    { key: 'score', label: 'Score' },
                    { key: 'status', label: 'Status' },
                    { key: 'cv', label: 'CV', width: 100 },
                    { key: 'actions', label: 'Actions', width: 160 },
                ]}
                rows={reviewers.map((reviewer) => (
                    <TableRow key={reviewer._id} sx={{ '&:last-child td': { borderBottom: 0 }, bgcolor: 'white' }}>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: '#111827' }}>{reviewer.firstName} {reviewer.lastName}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" sx={{ color: '#4B5563' }}>{reviewer.email}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" sx={{ color: '#111827' }}>{reviewer.designation}</Typography>
                            <Typography variant="caption" sx={{ color: '#4B5563' }}>{reviewer.institution}</Typography>
                        </TableCell>
                        <TableCell>
                            {reviewer.areasOfExpertise && reviewer.areasOfExpertise.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {reviewer.areasOfExpertise.map((area, idx) => (
                                        <Chip key={idx} label={area} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: '20px', borderColor: '#cbd5e1', color: '#64748b' }} />
                                    ))}
                                </div>
                            )}
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" sx={{ color: '#111827', fontWeight: 600 }}>{reviewer.mcqScore}/10</Typography>
                        </TableCell>
                        <TableCell>
                            <Chip
                                label={reviewer.reviewerStatus}
                                size="small"
                                variant="outlined"
                                sx={{ color: '#111827', borderColor: '#D1D5DB', fontWeight: 'bold', fontSize: '0.7rem' }}
                            />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {reviewer.reviewerCvUrl ? (
                                <Button variant="outlined" size="small" startIcon={<FileText size={14} />}
                                    href={reviewer.reviewerCvUrl} target="_blank"
                                    sx={{ borderColor: '#D1D5DB', color: '#111827', textTransform: 'none', whiteSpace: 'nowrap', minWidth: '95px' }}
                                >
                                    View CV
                                </Button>
                            ) : (
                                <span className="text-xs text-gray-500">No CV</span>
                            )}
                        </TableCell>
                        <TableCell>
                            {reviewer.reviewerStatus === 'PENDING' ? (
                                <div className="flex gap-2">
                                    <Button variant="outlined" size="small"
                                        onClick={() => handleAction(reviewer._id, 'approve')}
                                        disabled={isActionLoading === reviewer._id}
                                        sx={{ borderColor: '#111827', color: '#111827', textTransform: 'none', fontSize: '0.75rem' }}
                                    >
                                        Approve
                                    </Button>
                                    <Button variant="outlined" size="small"
                                        onClick={() => handleAction(reviewer._id, 'reject')}
                                        disabled={isActionLoading === reviewer._id}
                                        sx={{ borderColor: '#4B5563', color: '#4B5563', textTransform: 'none', fontSize: '0.75rem' }}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <IconButton size="small" sx={{ color: '#4B5563' }} onClick={() => { setUserToDelete({ id: reviewer._id, name: `${reviewer.firstName} ${reviewer.lastName}` }); setIsDeleteDialogOpen(true); }}>
                                        <Trash2 size={16} />
                                    </IconButton>
                                </div>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            />
            {reviewers.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        color: '#111827',
                        bgcolor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: 2,
                        mt: 2,
                        '.MuiTablePagination-selectIcon': { color: '#4B5563' },
                        '.MuiIconButton-root': { color: '#4B5563' },
                        '.MuiTablePagination-displayedRows': { color: '#111827', fontWeight: 500 }
                    }}
                />
            )}
            <DeleteUserDialog
                open={isDeleteDialogOpen}
                selectedUser={{ userName: userToDelete?.name }}
                password={password}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setUserToDelete(null);
                    setPassword("");
                }}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onDelete={handleDeleteReviewer}
            />
        </div>
    );
};

export default PendingReviewersPage;

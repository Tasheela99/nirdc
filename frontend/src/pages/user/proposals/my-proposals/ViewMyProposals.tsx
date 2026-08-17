import {
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  FileText, Calendar, Building2, Download, Trash2, Search,
  ClipboardList, Clock, CheckCircle2, XCircle, ArrowUpDown,
  Filter, RefreshCw, PlusCircle, Eye
} from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
import proposalApi from "../../../../api/ProposalApi.ts";
import UserContext from "../../../../store/UserContext.tsx";
import { downloadUserProposalPDF } from '@/components/pdf/DownloadUserProposalPDF.tsx';
import { ProposalType } from '@/components/pdf/UserProposalPDF.tsx';
import { useNavigate } from 'react-router-dom';
import './ViewMyProposals.css';

interface Proposal {
    _id: string;
    userId: { firstName?: string; lastName?: string };
    department: string;
    applicationId: string;
    applicationStatus: string;
    createdAt: string;
    updatedAt: string;
    title?: string;
    projectTitle?: string;
    [key: string]: any;
}

const ViewMyProposals = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('newest');
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; proposalId: string; proposalTitle: string }>({ open: false, proposalId: '', proposalTitle: '' });
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (!userInfo || !userInfo.id) {
                    setError('User not authenticated');
                    return;
                }
                const response = await proposalApi.getUserProposals(userInfo.id) as any;
                if (response.data) {
                    const { investorApplications, researchProposals, researchInvestments } = response.data;
                    setProposals([
                        ...investorApplications,
                        ...researchProposals,
                        ...researchInvestments,
                    ]);
                } else {
                    setError('Failed to fetch proposals');
                }
            } catch (err) {
                console.error("Error during proposal fetching:", err);
                setError('Failed to fetch proposals');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userInfo]);

    // ── Stats ──
    const stats = {
        total: proposals.length,
        pending: proposals.filter(p => p.applicationStatus === 'PENDING').length,
        approved: proposals.filter(p => p.applicationStatus === 'APPROVED').length,
        rejected: proposals.filter(p => p.applicationStatus === 'REJECTED').length,
    };

    // ── Helpers ──
    const getStripeClass = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED': return 'approved';
            case 'REJECTED': return 'rejected';
            case 'PENDING': return 'pending';
            default: return '';
        }
    };

    const getStatusColor = (status: string | undefined) => {
        if (!status) return 'default';
        switch (status.toUpperCase()) {
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            case 'PENDING': return 'warning';
            case 'UNDER_REVIEW': return 'info';
            default: return 'default';
        }
    };

    const getProposalTitle = (p: Proposal) =>
        p.title || p.projectTitle || p.department || 'Untitled Proposal';

    const getProposalType = (p: Proposal): ProposalType => {
        if (p.title) return 'research';
        if (p.projectTitle) return 'researchInvestment';
        return 'investment';
    };

    // ── Delete handlers ──
    const handleDeleteProposal = (proposalId: string, proposalTitle: string) => {
        setDeleteDialog({ open: true, proposalId, proposalTitle });
        setDeletePassword('');
    };

    const confirmDeleteProposal = async () => {
        if (!deleteDialog.proposalId || !userInfo?.id || !deletePassword) return;
        try {
            setDeleteLoading(true);
            await proposalApi.deleteUserProposal(userInfo.id, deleteDialog.proposalId, deletePassword);
            setProposals(prev => prev.filter(p => p._id !== deleteDialog.proposalId));
            setSnackbar({ open: true, message: 'Proposal deleted successfully', severity: 'success' });
            setDeleteDialog({ open: false, proposalId: '', proposalTitle: '' });
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || 'Failed to delete proposal';
            setSnackbar({ open: true, message: msg, severity: 'error' });
            setDeleteDialog({ open: false, proposalId: '', proposalTitle: '' });
        } finally {
            setDeleteLoading(false);
        }
    };

    // ── Filter & sort ──
    const filtered = proposals.filter(p => {
        const q = searchTerm.toLowerCase();
        const matchSearch = p.applicationId.toLowerCase().includes(q) ||
                            p.department.toLowerCase().includes(q) ||
                            (p.title || '').toLowerCase().includes(q) ||
                            (p.projectTitle || '').toLowerCase().includes(q);
        const matchStatus = statusFilter === 'ALL' || p.applicationStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
            case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'status': return a.applicationStatus.localeCompare(b.applicationStatus);
            case 'department': return a.department.localeCompare(b.department);
            default: return 0;
        }
    });

    // ── Loading ──
    if (loading) {
        return (
            <div className="vmp flex items-center justify-center">
                <div className="text-center">
                    <CircularProgress size={56} sx={{ color: '#003893' }} />
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg font-medium">Loading your proposals…</p>
                </div>
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <div className="vmp flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                        <XCircle size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-xl transition-all"
                    >
                        <RefreshCw size={16} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="vmp">
            {/* ── Hero Banner ── */}
            <div className="vmp-hero">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="pt-8 pb-2">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Proposals</h1>
                        <p className="mt-2 text-blue-100 text-lg max-w-xl">
                            Track and manage your research & investment proposals
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Stats Cards (overlapping hero) ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total */}
                    <div className="vmp-stat">
                        <div className="vmp-stat-icon bg-blue-50 dark:bg-blue-900/30">
                            <ClipboardList size={22} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Total</p>
                        </div>
                    </div>
                    {/* Pending */}
                    <div className="vmp-stat">
                        <div className="vmp-stat-icon bg-amber-50 dark:bg-amber-900/30">
                            <Clock size={22} className="text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Pending</p>
                        </div>
                    </div>
                    {/* Approved */}
                    <div className="vmp-stat">
                        <div className="vmp-stat-icon bg-emerald-50 dark:bg-emerald-900/30">
                            <CheckCircle2 size={22} className="text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Approved</p>
                        </div>
                    </div>
                    {/* Rejected */}
                    <div className="vmp-stat">
                        <div className="vmp-stat-icon bg-red-50 dark:bg-red-900/30">
                            <XCircle size={22} className="text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Rejected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="vmp-toolbar">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="proposal-search"
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search proposals…"
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 text-gray-900  dark:bg-dark-bg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                            />
                        </div>
                    </div>
                    {/* Status filter */}
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel><span className="flex items-center gap-1"><Filter size={14} /> Status</span></InputLabel>
                        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label="Status">
                            <MenuItem value="ALL">All Status</MenuItem>
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="APPROVED">Approved</MenuItem>
                            <MenuItem value="REJECTED">Rejected</MenuItem>
                            <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Sort */}
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel><span className="flex items-center gap-1"><ArrowUpDown size={14} /> Sort By</span></InputLabel>
                        <Select value={sortBy} onChange={e => setSortBy(e.target.value)} label="Sort By">
                            <MenuItem value="newest">Newest First</MenuItem>
                            <MenuItem value="oldest">Oldest First</MenuItem>
                            <MenuItem value="status">Status</MenuItem>
                            <MenuItem value="department">Department</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>

            {/* ── Proposals Grid ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">
                {sorted.length === 0 ? (
                    <div className="vmp-empty">
                        <div className="vmp-empty-icon">
                            <FileText size={36} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No proposals found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            {searchTerm || statusFilter !== 'ALL'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'You haven\'t submitted any proposals yet. Start by submitting a new proposal.'}
                        </p>
                        {!searchTerm && statusFilter === 'ALL' && (
                            <button
                                onClick={() => navigate('/proposal')}
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-xl transition-all hover:shadow-lg"
                            >
                                <PlusCircle size={18} /> Submit New Proposal
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {sorted.map((proposal, index) => (
                            <div
                                key={proposal._id}
                                className="vmp-card"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                {/* Accent stripe */}
                                <div className={`vmp-card-stripe ${getStripeClass(proposal.applicationStatus)}`} />

                                <div className="p-5">
                                    {/* Top: status + actions */}
                                    <div className="flex items-center justify-between mb-3">
                                        <Chip
                                            label={proposal.applicationStatus}
                                            color={getStatusColor(proposal.applicationStatus) as any}
                                            size="small"
                                            sx={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.5px', borderRadius: '8px' }}
                                        />
                                        <div className="flex items-center gap-1">
                                            <Tooltip title="Download PDF">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => downloadUserProposalPDF(proposal, getProposalType(proposal))}
                                                    sx={{ color: '#003893' }}
                                                >
                                                    <Download size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Proposal">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteProposal(proposal._id, proposal.applicationId)}
                                                >
                                                    <Trash2 size={16} />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-snug">
                                        {getProposalTitle(proposal)}
                                    </h3>

                                    {/* Application ID */}
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-3">
                                        {proposal.applicationId}
                                    </p>

                                    {/* Department */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <Building2 size={13} className="text-primary" />
                                        </div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{proposal.department}</span>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-100 dark:border-dark-border my-3" />

                                    {/* Dates */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            <span>{new Date(proposal.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Eye size={12} />
                                            <span>{new Date(proposal.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Snackbar ── */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* ── Delete Confirmation Dialog ── */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => !deleteLoading && setDeleteDialog({ open: false, proposalId: '', proposalTitle: '' })}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ background: 'linear-gradient(135deg, #003893, #1B4F72)', color: 'white', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Trash2 size={20} />
                    Delete Proposal
                </DialogTitle>
                <DialogContent sx={{ pt: 3, pb: 1 }}>
                    <DialogContentText sx={{ mb: 2 }}>
                        Are you sure you want to delete <strong>"{deleteDialog.proposalTitle}"</strong>? This action cannot be undone.
                    </DialogContentText>
                    <TextField
                        label="Enter your password to confirm"
                        type="password"
                        fullWidth
                        size="small"
                        value={deletePassword}
                        onChange={e => setDeletePassword(e.target.value)}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Eye size={16} className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteDialog({ open: false, proposalId: '', proposalTitle: '' })}
                        disabled={deleteLoading}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDeleteProposal}
                        color="error"
                        variant="contained"
                        disabled={deleteLoading || !deletePassword}
                        startIcon={deleteLoading ? <CircularProgress size={16} /> : <Trash2 size={16} />}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        {deleteLoading ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewMyProposals;
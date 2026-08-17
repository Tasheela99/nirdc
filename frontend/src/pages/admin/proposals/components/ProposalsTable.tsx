import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    Switch,
    FormControl,
    MenuItem,
    Select as MuiSelect,
    FormControlLabel,
    Chip,
    Tooltip,
    Box,
    Typography,
    CircularProgress,
    Alert
} from "@mui/material";
import { Visibility as ViewIcon } from '@mui/icons-material';
import { ClipboardList, RefreshCw, RotateCcw } from 'lucide-react';
import { Proposal } from '../types/ProposalTypes';

interface ProposalsTableProps {
    proposals: Proposal[];
    loading: boolean;
    error: string;
    page: number;
    rowsPerPage: number;
    statusSwitches: { [key: string]: boolean };
    proposalStatuses: { [key: string]: string | null };
    onViewDetails: (proposal: Proposal) => void;
    onChangePage: (event: unknown, newPage: number) => void;
    onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onStatusSwitchChange: (proposalId: string, checked: boolean) => void;
    onStatusUpdate: (proposalId: string, status: string) => void;
    onRefresh: () => void;
    onResetFilters: () => void;
}

const ProposalsTable = ({
    proposals,
    loading,
    error,
    page,
    rowsPerPage,
    statusSwitches,
    proposalStatuses,
    onViewDetails,
    onChangePage,
    onChangeRowsPerPage,
    onStatusSwitchChange,
    onStatusUpdate,
    onRefresh,
    onResetFilters
}: ProposalsTableProps) => {
    // Delete functionality removed - kept for future use if needed
    // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    // const [deleteLoading, setDeleteLoading] = useState(false);
    
    if (loading) {
        return (
            <Box className="flex items-center justify-center py-16">
                <div className="text-center">
                    <CircularProgress 
                        size={80} 
                        thickness={4}
                        sx={{ 
                            color: '#002E78',
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            }
                        }} 
                    />
                    <Typography variant="h6" className="mt-6 text-gray-600 font-medium">
                        Loading proposals...
                    </Typography>
                    <Typography variant="body2" className="mt-2 text-gray-500">
                        Please wait while we fetch your data
                    </Typography>
                </div>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="p-8">
                <Alert severity="error" className="mb-6" sx={{ borderRadius: '12px' }}>
                    <Typography variant="h6" className="font-semibold mb-2">Error</Typography>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    onClick={onRefresh}
                    startIcon={<RefreshCw size={18} />}
                    sx={{ 
                        backgroundColor: '#002E78', 
                        '&:hover': { backgroundColor: '#001C4A' },
                        borderRadius: '12px',
                        padding: '12px 24px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600
                    }}
                    className="hover-lift"
                >
                    Retry Loading
                </Button>
            </Box>
        );
    }

    return (
        <TableContainer className="custom-scrollbar">
            <Table size="small" className="professional-table">
                <TableHead>
                    <TableRow>
                        {['Proposal ID', 'Department', 'Applicant', 'Contact', 'Submitted', 'Status', 'Actions'].map((col) => (
                            <TableCell key={col} sx={{
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                color: '#4B5563',
                                backgroundColor: '#F9FAFB',
                                borderBottom: '2px solid #E5E7EB',
                                py: 1,
                                whiteSpace: 'nowrap',
                            }}>
                                {col}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {proposals.length === 0 ? (
                        <TableRow sx={{ bgcolor: 'white' }}>
                            <TableCell colSpan={7} align="center" className="py-16">
                                <div className="empty-state-modern">
                                    <ClipboardList size={64} style={{ margin: '0 auto 16px', opacity: 0.4, color: '#002E78' }} />
                                    <Typography variant="h5" className="text-gray-600 mb-3 font-semibold">
                                        No proposals found
                                    </Typography>
                                    <Typography variant="body1" className="text-gray-500 mb-6">
                                        Try adjusting your filters or search criteria to find proposals
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={onResetFilters}
                                        startIcon={<RotateCcw size={16} />}
                                        sx={{
                                            borderColor: '#002E78',
                                            color: '#002E78',
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                borderColor: '#001C4A',
                                                backgroundColor: 'rgba(0, 46, 120, 0.04)'
                                            }
                                        }}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        proposals
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((proposal: Proposal) => (
                                <TableRow
                                    key={proposal._id}
                                    data-proposal-id={proposal._id}
                                    sx={{
                                        bgcolor: 'white',
                                    }}
                                >
                                    <TableCell>
                                        <span className="font-bold text-gray-900 text-sm">
                                            {proposal.applicationId}
                                        </span>
                                        {proposal.isOpenedByAdmin === false && (
                                            <span className="ml-2 text-xs font-bold text-orange-600">NEW</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium text-gray-800">
                                            {proposal.department}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm">
                                                {proposal.userId?.email || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                ID: {proposal.userId?._id?.slice(-6) || 'N/A'}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium text-gray-700">
                                            {proposal.userId?.mobile || 'N/A'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div className="font-semibold text-gray-900">
                                                {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : "-"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {proposal.createdAt ? new Date(proposal.createdAt).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : "-"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Box className="flex items-center gap-2">
                                            <FormControlLabel
                                                control={
                                                    <Switch 
                                                        checked={!!statusSwitches[proposal._id]} 
                                                        onChange={(e) => onStatusSwitchChange(proposal._id, e.target.checked)}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                }
                                                label=""
                                            />
                                            {statusSwitches[proposal._id] ? (
                                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                                    <MuiSelect
                                                        value={proposalStatuses[proposal._id] || proposal.applicationStatus || "PENDING"}
                                                        onChange={(e) => onStatusUpdate(proposal._id, e.target.value as string)}
                                                        sx={{
                                                            height: '30px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.85rem'
                                                        }}
                                                        MenuProps={{
                                                            disablePortal: false,
                                                            PaperProps: {
                                                                sx: { zIndex: 9999 }
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem value="PENDING">PENDING</MenuItem>
                                                        <MenuItem value="UNDER_REVIEW">UNDER REVIEW</MenuItem>
                                                        <MenuItem value="APPROVED">APPROVED</MenuItem>
                                                        <MenuItem value="REJECTED">REJECTED</MenuItem>
                                                    </MuiSelect>
                                                </FormControl>
                                            ) : (
                                                <Chip
                                                    label={proposal.applicationStatus || "PENDING"}
                                                    size="small"
                                                    color={
                                                        proposal.applicationStatus === "APPROVED" ? "success" :
                                                        proposal.applicationStatus === "REJECTED" ? "error" : 
                                                        proposal.applicationStatus === "UNDER_REVIEW" ? "info" : "warning"
                                                    }
                                                    className="font-medium"
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Tooltip title="View Proposal Details" arrow>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => onViewDetails(proposal)}
                                                    sx={{ textTransform: 'none' }}
                                                    startIcon={<ViewIcon />}
                                                >
                                                    View Details
                                                </Button>
                                            </Tooltip>
                                            
                                            {/* Delete button - Only for ADMIN and SUPER_ADMIN */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={proposals.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
                sx={{
                    borderRadius: '0 0 16px 16px',
                    '.MuiTablePagination-select': {
                        color: '#002E78',
                        fontWeight: 600,
                    },
                    '.MuiTablePagination-displayedRows': {
                        color: '#002E78',
                        fontWeight: 600,
                    },
                    '.MuiTablePagination-actions': {
                        color: '#002E78',
                    },
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                        fontSize: '0.875rem',
                        fontWeight: 500,
                    },
                    '.MuiIconButton-root': {
                        color: '#002E78',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 46, 120, 0.08)',
                            transform: 'scale(1.1)',
                        },
                        '&.Mui-disabled': {
                            color: '#d1d5db',
                        }
                    }
                }}
            />

            {/* Delete functionality removed - kept for future use if needed */}
        </TableContainer>
    );
};

export default ProposalsTable;

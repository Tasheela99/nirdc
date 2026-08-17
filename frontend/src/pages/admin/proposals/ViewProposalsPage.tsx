import {
    Box,
    Button,
    Card,
    Fade,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useProposalTypes } from "./hooks/useProposalTypes";
import ProposalsTable from "./components/ProposalsTable";
import proposalApi from "../../../api/ProposalApi";
import { useAlert } from "../../../components/common/AlertContextScreen";




const ViewProposalsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showAlert } = useAlert();
  
  // Get initial tab index from URL query params or navigation state
  const getInitialTabIndex = (): number => {
    // First, check if we have a tab in the URL query params
    const urlTab = searchParams.get('tab');
    if (urlTab !== null) {
      const parsedTab = parseInt(urlTab, 10);
      if (!isNaN(parsedTab) && parsedTab >= 0 && parsedTab <= 2) {
        return parsedTab;
      }
    }
    
    // Second, check if we came back from proposal details with a saved tab
    if (location.state?.returnTab !== undefined) {
      const returnTab = location.state.returnTab;
      if (returnTab >= 0 && returnTab <= 2) {
        return returnTab;
      }
    }
    
    // Default to Investment tab
    return 0;
  };
  
  // Tab state: 0 = investment, 1 = research-investment, 2 = research-proposal
  const [tabIndex, setTabIndex] = useState(getInitialTabIndex());
  
  // Status switches state (for UI toggles)
  const [statusSwitches, setStatusSwitches] = useState<Record<string, boolean>>({});
  const [proposalStatuses, setProposalStatuses] = useState<Record<string, string | null>>({});

  // Use our new hook with lazy loading
  const {
    fetchInvestmentProposals,
    fetchResearchInvestmentProposals,
    fetchResearchProposals,
    updateSearchTerm,
    updatePage,
    updateRowsPerPage,
    getFilteredProposals,
    getStateForType
  } = useProposalTypes();

  // Get current proposal type based on tab index
  const getCurrentProposalType = (): 'investment' | 'research-investment' | 'research-proposal' => {
    switch (tabIndex) {
      case 0: return 'investment';
      case 1: return 'research-investment';
      case 2: return 'research-proposal';
      default: return 'investment';
    }
  };

  // Sync URL with tab index on mount (to handle browser back button)
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    const currentUrlTab = urlTab ? parseInt(urlTab, 10) : 0;
    
    // If URL and state are out of sync, update URL
    if (currentUrlTab !== tabIndex) {
      setSearchParams({ tab: tabIndex.toString() }, { replace: true });
    }
  }, []); // Only run on mount

  // Get current state and proposals (moved up before useEffects that use them)
  const currentType = getCurrentProposalType();
  const currentState = getStateForType(currentType);
  const currentProposals = getFilteredProposals(currentType);

  // Lazy load data when tab changes
  useEffect(() => {
    // Only fetch if we haven't fetched data yet for this tab and not currently loading
    if (!currentState.fetched && !currentState.loading) {
      switch (currentType) {
        case 'investment':
          fetchInvestmentProposals();
          break;
        case 'research-investment':
          fetchResearchInvestmentProposals();
          break;
        case 'research-proposal':
          fetchResearchProposals();
          break;
      }
    }
  }, [tabIndex, currentState.fetched, currentState.loading, currentType, fetchInvestmentProposals, fetchResearchInvestmentProposals, fetchResearchProposals]);

  // Scroll to specific proposal if proposalId is in URL
  useEffect(() => {
    const proposalId = searchParams.get('proposalId');
    if (proposalId && currentProposals.length > 0 && !currentState.loading) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const proposalElement = document.querySelector(`[data-proposal-id="${proposalId}"]`);
        if (proposalElement) {
          proposalElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add temporary highlight effect
          proposalElement.classList.add('highlight-proposal');
          setTimeout(() => {
            proposalElement.classList.remove('highlight-proposal');
          }, 2000);
        }
      }, 300);
    }
  }, [searchParams, currentProposals.length, currentState.loading]);

  // Handle view details
  const handleViewDetails = (proposal: any) => {
    const proposalType = proposal._proposalType;
    
    if (!proposalType) {
      showAlert('Error: Could not determine proposal type', 'error');
      return;
    }
    
    navigate(`/admin/proposal-details/${proposal._id}`, {
      state: {
        proposalType: proposalType,
        selectedDepartment: null,
        previousStatusRoute: '/admin/view-proposals',
        returnTab: tabIndex, // Save current tab index to return to
        returnTabUrl: `/admin/view-proposals?tab=${tabIndex}&proposalId=${proposal._id}`, // Full URL with tab and proposal ID
        returnProposalId: proposal._id, // Save proposal ID for scrolling
      },
    });
  };

  // Handle status switch toggle
  const handleStatusSwitchChange = (proposalId: string, checked: boolean) => {
    setStatusSwitches((prev) => ({ ...prev, [proposalId]: checked }));
  };

  // Handle status update with proper API calls
  const handleStatusUpdate = async (proposalId: string, status: string) => {
    try {
      const proposalType = getCurrentProposalType();
      let response;

      switch (proposalType) {
        case 'investment':
          response = await proposalApi.InvestmentUpdateProposalStatus(proposalId, status);
          break;
        case 'research-investment':
          response = await proposalApi.ResearchInvestmentUpdateProposalStatus(proposalId, status);
          break;
        case 'research-proposal':
          response = await proposalApi.ResearchProposalUpdateProposalStatus(proposalId, status);
          break;
      }

      if (response) {
        setProposalStatuses((prev) => ({ ...prev, [proposalId]: status }));
        showAlert('Proposal status updated successfully', 'success');
        // Refresh current tab data
        refreshCurrentTab();
      }
    } catch (error) {
      console.error('Failed to update proposal status:', error);
      showAlert('Failed to update proposal status', 'error');
    }
  };

  // Refresh current tab
  const refreshCurrentTab = () => {
    const currentType = getCurrentProposalType();
    switch (currentType) {
      case 'investment':
        fetchInvestmentProposals();
        break;
      case 'research-investment':
        fetchResearchInvestmentProposals();
        break;
      case 'research-proposal':
        fetchResearchProposals();
        break;
    }
  };

  const handleExportCSV = () => {
    const headers = ['Proposal ID', 'Department', 'Applicant Email', 'Contact', 'Status', 'Submitted Date'];
    const rows = currentProposals.map((p: any) => [
      p.applicationId || '',
      p.department || '',
      p.userId?.email || '',
      p.userId?.mobile || '',
      p.applicationStatus || 'PENDING',
      p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
    ]);
    const csvContent = [headers, ...rows].map(row => row.map((cell: string) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `proposals_${['Investment', 'Research_Investment', 'Research'][tabIndex] || 'export'}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Handle tab change and update URL
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    // Update URL query parameter to persist tab state
    setSearchParams({ tab: newValue.toString() });
  };

  return (
    <Box sx={{ padding: 4 }}>

      {/* Header — matches News/Blog/Directors pages */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ color: '#003893' }} fontWeight="bold">
            Manage Proposals
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Review and manage research and investment proposals
          </Typography>
        </Box>
        {!currentState.loading && currentProposals.length > 0 && (
          <Button
            variant="outlined"
            sx={{ borderColor: '#003893', color: '#003893', textTransform: 'none', fontWeight: 600 }}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        )}
      </Box>

      {/* Tabs + Search — inline row */}
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem' },
          }}
        >
          <Tab label="Investment Proposals" />
          <Tab label="Research Investment Proposals" />
          <Tab label="Research Proposals" />
        </Tabs>

        {/* Search bar — matches News page style */}
        <div className="relative mb-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input
            type="text"
            placeholder="Search by ID, applicant, title..."
            value={currentState.searchTerm}
            onChange={(e) => updateSearchTerm(currentType, e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all"
            style={{ minWidth: 260 }}
          />
        </div>
      </Box>

      {/* Summary Stats Bar */}
      {!currentState.loading && (
        <Box mb={2} display="flex" gap={1.5} flexWrap="wrap">
          {[
            { label: 'Total', count: currentProposals.length, color: '#003893', bg: 'rgba(0,56,147,0.06)' },
            { label: 'Pending', count: currentProposals.filter((p: any) => !p.applicationStatus || p.applicationStatus === 'PENDING').length, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
            { label: 'Under Review', count: currentProposals.filter((p: any) => p.applicationStatus === 'UNDER_REVIEW').length, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
            { label: 'Approved', count: currentProposals.filter((p: any) => p.applicationStatus === 'APPROVED').length, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
            { label: 'Rejected', count: currentProposals.filter((p: any) => p.applicationStatus === 'REJECTED').length, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
          ].map((stat) => (
            <Box key={stat.label} sx={{
              flex: '1 1 120px',
              background: stat.bg,
              border: `1px solid ${stat.color}22`,
              borderRadius: '10px',
              padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 1.2,
            }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stat.color, flexShrink: 0 }} />
              <Box>
                <Box sx={{ fontSize: '0.68rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</Box>
                <Box sx={{ fontSize: '1.1rem', fontWeight: 700, color: stat.color, lineHeight: 1.2 }}>{stat.count}</Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Table */}
      <Fade in={true} timeout={600}>
        <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
          <ProposalsTable
            proposals={currentProposals}
            loading={currentState.loading}
            error={currentState.error}
            page={currentState.page}
            rowsPerPage={currentState.rowsPerPage}
            statusSwitches={statusSwitches}
            proposalStatuses={proposalStatuses}
            onViewDetails={handleViewDetails}
            onChangePage={(_, newPage) => updatePage(currentType, newPage)}
            onChangeRowsPerPage={(event) => {
              updateRowsPerPage(currentType, parseInt(event.target.value, 10));
            }}
            onStatusSwitchChange={handleStatusSwitchChange}
            onStatusUpdate={handleStatusUpdate}
            onRefresh={refreshCurrentTab}
            onResetFilters={() => updateSearchTerm(currentType, '')}
          />
        </Card>
      </Fade>
    </Box>
  );
};

export default ViewProposalsScreen;

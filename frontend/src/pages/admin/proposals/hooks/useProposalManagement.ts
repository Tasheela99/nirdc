import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import proposalApi from "../../../../api/ProposalApi";
import { useAlert } from "../../../../components/common/AlertContextScreen";
import { ProposalType, ProposalApiEndpoint, Proposal } from '../types/ProposalTypes';

export const useProposalManagement = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [allProposals, setAllProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
    const [selectedProposalType, setSelectedProposalType] = useState<ProposalType | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusSwitches, setStatusSwitches] = useState<{[key: string]: boolean}>({});
    const [proposalStatuses, setProposalStatuses] = useState<{[key: string]: string}>({});
    const [selectedStatus, setSelectedStatus] = useState<any>({ value: "ALL", label: "All Status" });
    const [searchTerm, setSearchTerm] = useState("");
    
    const navigate = useNavigate();
    const location = useLocation();
    const { showAlert } = useAlert();

    const departments = useMemo(() => [
        { value: "ALL", label: "All Departments" },
        { value: "TECHNOLOGY", label: "TECHNOLOGY" },
        { value: "FOOD & SUSTENANCE", label: "FOOD & SUSTENANCE" },
        { value: "ENVIRONMENT", label: "ENVIRONMENT" },
        { value: "SOCIAL DEVELOPMENT", label: "SOCIAL DEVELOPMENT" },
        { value: "WELL-BEING & INTELLECTUAL", label: "WELL-BEING & INTELLECTUAL" },
        { value: "OTHER", label: "OTHER" },
    ], []);

    const proposalTypes: ProposalType[] = useMemo(() => [
        {
            value: "research-proposal",
            label: "Research Proposals",
            endpoint: "GetResearchProposalApplicationProposals"
        },
        {
            value: "research-investment",
            label: "Research Investment Proposals",
            endpoint: "GetResearchInvestmentApplicationProposals"
        },
        {
            value: "investment",
            label: "Investment Proposals",
            endpoint: "GetInvestorApplicationProposals"
        },
    ], []);

    const statusOptions = useMemo(() => [
        { value: "ALL", label: "All Status" },
        { value: "PENDING", label: "Pending" },
        { value: "APPROVED", label: "Approved" },
        { value: "REJECTED", label: "Rejected" }
    ], []);

    const fetchProposals = useCallback(async (endpoint: ProposalApiEndpoint) => {
        setLoading(true);
        setError("");

        try {
            const response = await proposalApi[endpoint]() as any;
            if (response?.status) {
                setAllProposals(response.data || []);
                setProposals(response.data || []);
            } else {
                setError(response?.message || "Failed to fetch proposals.");
                showAlert(response?.message || "Failed to fetch proposals.", "error");
            }
        } catch (err) {
            setError("An error occurred while fetching proposals.");
            showAlert("An error occurred while fetching proposals.", "error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    const filterProposals = useCallback((
        departmentOption: any, 
        proposalTypeOption: ProposalType | null, 
        statusOption: any, 
        search: string = ""
    ) => {
        if (!proposalTypeOption) return;

        let filtered = [...allProposals];

        if (departmentOption && departmentOption.value !== "ALL") {
            filtered = filtered.filter(
                (proposal: Proposal) => proposal.department === departmentOption.value
            );
        }

        if (statusOption && statusOption.value !== "ALL") {
            filtered = filtered.filter(
                (proposal: Proposal) => proposal.applicationStatus === statusOption.value
            );
        }

        if (search.trim()) {
            filtered = filtered.filter((proposal: Proposal) => 
                proposal.applicationId?.toLowerCase().includes(search.toLowerCase()) ||
                proposal.department?.toLowerCase().includes(search.toLowerCase()) ||
                proposal.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
                proposal.userId?.mobile?.includes(search)
            );
        }

        setProposals(filtered);
    }, [allProposals]);

    const handleDepartmentChange = useCallback((selectedOption: any) => {
        setSelectedDepartment(selectedOption);
        filterProposals(selectedOption, selectedProposalType, selectedStatus, searchTerm);
    }, [selectedProposalType, selectedStatus, searchTerm, filterProposals]);

    const handleProposalTypeChange = useCallback((value: string) => {
        const selectedType = proposalTypes.find(type => type.value === value);
        setSelectedProposalType(selectedType || null);
        if (selectedType) {
            fetchProposals(selectedType.endpoint);
            setSelectedDepartment(null);
        }
    }, [proposalTypes, fetchProposals]);

    const handleStatusChange = useCallback((selectedOption: any) => {
        setSelectedStatus(selectedOption);
        filterProposals(selectedDepartment, selectedProposalType, selectedOption, searchTerm);
        
        localStorage.setItem(
            "viewProposalsFilters",
            JSON.stringify({
                selectedProposalType,
                selectedDepartment,
                selectedStatus: selectedOption,
                searchTerm
            })
        );
    }, [selectedDepartment, selectedProposalType, searchTerm, filterProposals]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        filterProposals(selectedDepartment, selectedProposalType, selectedStatus, value);
    }, [selectedDepartment, selectedProposalType, selectedStatus, filterProposals]);

    const handleViewDetails = useCallback((proposal: Proposal) => {
        console.log('[useProposalManagement] handleViewDetails called with proposal:', proposal);
        console.log('[useProposalManagement] selectedProposalType:', selectedProposalType);
        console.log('[useProposalManagement] selectedDepartment:', selectedDepartment);
        
        const navigationState = {
            proposalType: selectedProposalType?.value,
            selectedDepartment,
            previousStatusRoute: location.pathname + location.search,
        };
        
        console.log('[useProposalManagement] Navigation state:', navigationState);
        console.log('[useProposalManagement] Navigating to:', `/admin/proposal-details/${proposal._id}`);
        
        navigate(`/admin/proposal-details/${proposal._id}`, {
            state: navigationState,
        });
    }, [navigate, selectedProposalType, selectedDepartment, location]);

    const handleChangePage = useCallback((_event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    // Initialize filters from localStorage
    useEffect(() => {
        const savedFilters = localStorage.getItem("viewProposalsFilters");
        if (savedFilters) {
            const { selectedProposalType, selectedDepartment, selectedStatus } = JSON.parse(savedFilters);
            setSelectedProposalType(selectedProposalType || null);
            setSelectedDepartment(selectedDepartment || null);
            setSelectedStatus(selectedStatus || { value: "ALL", label: "All Status" });

            if (selectedProposalType) {
                fetchProposals(selectedProposalType.endpoint);
            }
        } else if (proposalTypes.length > 0) {
            setSelectedProposalType(proposalTypes[0]);
            fetchProposals(proposalTypes[0].endpoint);
        }
    }, [fetchProposals, proposalTypes]);

    return {
        // State
        proposals,
        allProposals,
        loading,
        error,
        selectedDepartment,
        selectedProposalType,
        page,
        rowsPerPage,
        statusSwitches,
        proposalStatuses,
        selectedStatus,
        searchTerm,
        
        // Options
        departments,
        proposalTypes,
        statusOptions,
        
        // Handlers
        handleDepartmentChange,
        handleProposalTypeChange,
        handleStatusChange,
        handleSearchChange,
        handleViewDetails,
        handleChangePage,
        handleChangeRowsPerPage,
        fetchProposals,
        
        // Setters
        setStatusSwitches,
        setProposalStatuses,
        setLoading,
        setProposals,
        setAllProposals,
        setSearchTerm,
        setSelectedDepartment,
        setSelectedStatus,
        showAlert
    };
};

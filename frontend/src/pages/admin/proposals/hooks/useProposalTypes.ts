import { useState, useCallback } from 'react';
import proposalApi from '../../../../api/ProposalApi';

export interface ProposalState {
    data: any[];
    loading: boolean;
    fetched: boolean;
    error: string;
    searchTerm: string;
    page: number;
    rowsPerPage: number;
}

export const useProposalTypes = () => {
    // Investment Proposals State
    const [investmentProposals, setInvestmentProposals] = useState<ProposalState>({
        data: [],
        loading: false,
        fetched: false,
        error: '',
        searchTerm: '',
        page: 0,
        rowsPerPage: 10
    });

    // Research Investment Proposals State
    const [researchInvestmentProposals, setResearchInvestmentProposals] = useState<ProposalState>({
        data: [],
        loading: false,
        fetched: false,
        error: '',
        searchTerm: '',
        page: 0,
        rowsPerPage: 10
    });

    // Research Proposals State
    const [researchProposals, setResearchProposals] = useState<ProposalState>({
        data: [],
        loading: false,
        fetched: false,
        error: '',
        searchTerm: '',
        page: 0,
        rowsPerPage: 10
    });

    // Helper to handle API response structure
    const getProposalsArray = (response: any) => {
        if (Array.isArray(response)) {
            return response;
        }
        if (response && Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    };

    // Fetch Investment Proposals (lazy load)
    const fetchInvestmentProposals = useCallback(async () => {
        setInvestmentProposals(prev => ({ ...prev, loading: true, error: '' }));
        try {
            const response = await proposalApi.GetInvestorApplicationProposals();
            const proposals = getProposalsArray(response);
            setInvestmentProposals(prev => ({
                ...prev,
                data: proposals.map((p: any) => ({ ...p, _proposalType: 'investment' })),
                loading: false,
                fetched: true
            }));
        } catch (error) {
            console.error('Failed to fetch investment proposals:', error);
            setInvestmentProposals(prev => ({
                ...prev,
                loading: false,
                fetched: true,
                error: 'Failed to fetch investment proposals'
            }));
        }
    }, []);

    // Fetch Research Investment Proposals (lazy load)
    const fetchResearchInvestmentProposals = useCallback(async () => {
        setResearchInvestmentProposals(prev => ({ ...prev, loading: true, error: '' }));
        try {
            const response = await proposalApi.GetResearchInvestmentApplicationProposals();
            const proposals = getProposalsArray(response);
            setResearchInvestmentProposals(prev => ({
                ...prev,
                data: proposals.map((p: any) => ({ ...p, _proposalType: 'research-investment' })),
                loading: false,
                fetched: true
            }));
        } catch (error) {
            console.error('Failed to fetch research investment proposals:', error);
            setResearchInvestmentProposals(prev => ({
                ...prev,
                loading: false,
                fetched: true,
                error: 'Failed to fetch research investment proposals'
            }));
        }
    }, []);

    // Fetch Research Proposals (lazy load)
    const fetchResearchProposals = useCallback(async () => {
        setResearchProposals(prev => ({ ...prev, loading: true, error: '' }));
        try {
            const response = await proposalApi.GetResearchProposalApplicationProposals();
            const proposals = getProposalsArray(response);
            setResearchProposals(prev => ({
                ...prev,
                data: proposals.map((p: any) => ({ ...p, _proposalType: 'research-proposal' })),
                loading: false,
                fetched: true
            }));
        } catch (error) {
            console.error('Failed to fetch research proposals:', error);
            setResearchProposals(prev => ({
                ...prev,
                loading: false,
                fetched: true,
                error: 'Failed to fetch research proposals'
            }));
        }
    }, []);

    // Update search term for specific type
    const updateSearchTerm = useCallback((type: 'investment' | 'research-investment' | 'research-proposal', term: string) => {
        switch (type) {
            case 'investment':
                setInvestmentProposals(prev => ({ ...prev, searchTerm: term, page: 0 }));
                break;
            case 'research-investment':
                setResearchInvestmentProposals(prev => ({ ...prev, searchTerm: term, page: 0 }));
                break;
            case 'research-proposal':
                setResearchProposals(prev => ({ ...prev, searchTerm: term, page: 0 }));
                break;
        }
    }, []);

    // Update page for specific type
    const updatePage = useCallback((type: 'investment' | 'research-investment' | 'research-proposal', page: number) => {
        switch (type) {
            case 'investment':
                setInvestmentProposals(prev => ({ ...prev, page }));
                break;
            case 'research-investment':
                setResearchInvestmentProposals(prev => ({ ...prev, page }));
                break;
            case 'research-proposal':
                setResearchProposals(prev => ({ ...prev, page }));
                break;
        }
    }, []);

    // Update rows per page for specific type
    const updateRowsPerPage = useCallback((type: 'investment' | 'research-investment' | 'research-proposal', rowsPerPage: number) => {
        switch (type) {
            case 'investment':
                setInvestmentProposals(prev => ({ ...prev, rowsPerPage, page: 0 }));
                break;
            case 'research-investment':
                setResearchInvestmentProposals(prev => ({ ...prev, rowsPerPage, page: 0 }));
                break;
            case 'research-proposal':
                setResearchProposals(prev => ({ ...prev, rowsPerPage, page: 0 }));
                break;
        }
    }, []);

    // Get filtered proposals based on search term
    const getFilteredProposals = useCallback((type: 'investment' | 'research-investment' | 'research-proposal') => {
        let state: ProposalState;
        switch (type) {
            case 'investment':
                state = investmentProposals;
                break;
            case 'research-investment':
                state = researchInvestmentProposals;
                break;
            case 'research-proposal':
                state = researchProposals;
                break;
        }

        if (!state.searchTerm) return state.data;

        const searchLower = state.searchTerm.toLowerCase();
        return state.data.filter((p: any) =>
            p.applicant?.toLowerCase().includes(searchLower) ||
            p.department?.toLowerCase().includes(searchLower) ||
            p._id?.toLowerCase().includes(searchLower) ||
            p.applicationId?.toLowerCase().includes(searchLower) ||
            p.userId?.email?.toLowerCase().includes(searchLower) ||
            p.projectTitle?.toLowerCase().includes(searchLower) ||
            p.title?.toLowerCase().includes(searchLower)
        );
    }, [investmentProposals, researchInvestmentProposals, researchProposals]);

    // Get state for specific type
    const getStateForType = useCallback((type: 'investment' | 'research-investment' | 'research-proposal'): ProposalState => {
        switch (type) {
            case 'investment':
                return investmentProposals;
            case 'research-investment':
                return researchInvestmentProposals;
            case 'research-proposal':
                return researchProposals;
        }
    }, [investmentProposals, researchInvestmentProposals, researchProposals]);

    return {
        investmentProposals,
        researchInvestmentProposals,
        researchProposals,
        fetchInvestmentProposals,
        fetchResearchInvestmentProposals,
        fetchResearchProposals,
        updateSearchTerm,
        updatePage,
        updateRowsPerPage,
        getFilteredProposals,
        getStateForType
    };
};

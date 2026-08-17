
// NOTE: As per backend schema refactor (see SCHEMA_REFACTOR_REPORT.md),
// Research Investment Application, Research Proposal Application, and Investor Application
// now return embedded objects (e.g., significance, intellectualProperty, existingResources, requiredAssistanceFromGovernment)
// directly in the main application document. No references or separate collections are used.
// All API consumers should expect these fields as embedded objects.
// No UI changes are required, but if you use types/interfaces, update them accordingly.

import { callAPI } from "../config/AxiosInstance";

const ProposalEndpoints = {
    GetInvestorApplicationProposals: "/investment-questionnaire/admin/get-all",
    GetResearchInvestmentApplicationProposals: "/research-investment-questionnaire/admin/get-all",
    GetResearchProposalApplicationProposals: "/research-proposal-questionnaire/admin/get-all",

    GetInvestorApplicationProposalsById: "/investment-questionnaire/get-by-id",
    GetResearchInvestmentApplicationProposalsById: "/research-investment-questionnaire/get-by-id",
    GetResearchProposalApplicationProposalsById: "/research-proposal-questionnaire/get-by-id",

    GetUserProposals: (userId: string) => `users/user/proposals/${userId}`,
    GetProposalsByStatus: "/investment-questionnaire/status",
    ResearchInvestmentUpdateProposalStatus: "/research-investment-questionnaire/update-status",
    ResearchProposalUpdateProposalStatus: "/research-proposal-questionnaire/update-status",
    InvestmentUpdateProposalStatus: "/investment-questionnaire/update-status",

    // Admin proposal deletion endpoints - unified endpoint for all proposal types
    DeleteInvestmentProposal: "/investment-questionnaire/admin/delete-proposal",
    DeleteResearchInvestmentProposal: "/research-investment-questionnaire/admin/delete-proposal",
    DeleteResearchProposal: "/research-proposal-questionnaire/admin/delete-proposal",
};

const proposalApi = {
    getUserProposals: async (userId: string) =>
        await callAPI("GET", ProposalEndpoints.GetUserProposals(userId)),

    getApprovedProposals: async () =>
        await callAPI("GET", `${ProposalEndpoints.GetProposalsByStatus}?status=APPROVED`),

    getRejectedProposals: async () =>
        await callAPI("GET", `${ProposalEndpoints.GetProposalsByStatus}?status=REJECTED`),

    GetInvestorApplicationProposals: async () =>
        await callAPI("GET", ProposalEndpoints.GetInvestorApplicationProposals),
    GetResearchInvestmentApplicationProposals: async () =>
        await callAPI("GET", ProposalEndpoints.GetResearchInvestmentApplicationProposals),
    GetResearchProposalApplicationProposals: async () =>
        await callAPI("GET", ProposalEndpoints.GetResearchProposalApplicationProposals),
    GetInvestorApplicationProposalsById: async (id: string) =>
        await callAPI("GET", `${ProposalEndpoints.GetInvestorApplicationProposalsById}/${id}`),
    GetResearchInvestmentApplicationProposalsById: async (id: string) =>
        await callAPI("GET", `${ProposalEndpoints.GetResearchInvestmentApplicationProposalsById}/${id}`),
    GetResearchProposalApplicationProposalsById: async (id: string) =>
        await callAPI("GET", `${ProposalEndpoints.GetResearchProposalApplicationProposalsById}/${id}`),
    InvestmentUpdateProposalStatus: async (id: string, status: string) =>
        await callAPI("PUT", `${ProposalEndpoints.InvestmentUpdateProposalStatus}/${id}`, { status }),

    ResearchProposalUpdateProposalStatus: async (id: string, status: string) =>
        await callAPI("PUT", `${ProposalEndpoints.ResearchProposalUpdateProposalStatus}/${id}`, { status }),

    ResearchInvestmentUpdateProposalStatus: async (id: string, status: string) =>
        await callAPI("PUT", `${ProposalEndpoints.ResearchInvestmentUpdateProposalStatus}/${id}`, { status }),

    // User proposal deletion
    deleteUserProposal: async (userId: string, proposalId: string, password: string) => {
        if (!userId) throw new Error('User ID required for proposal deletion');
        // POST /users/user/proposals/:userId/delete { proposalId, password }
        return await callAPI("POST", `/users/user/proposals/${userId}/delete`, { proposalId, password });
    },

    // Admin proposal deletion functions - updated to use RESTful :id approach
    adminDeleteInvestmentProposal: async (proposalId: string) =>
        await callAPI("DELETE", `${ProposalEndpoints.DeleteInvestmentProposal}/${proposalId}`),

    adminDeleteResearchInvestmentProposal: async (proposalId: string) =>
        await callAPI("DELETE", `${ProposalEndpoints.DeleteResearchInvestmentProposal}/${proposalId}`),

    adminDeleteResearchProposal: async (proposalId: string) =>
        await callAPI("DELETE", `${ProposalEndpoints.DeleteResearchProposal}/${proposalId}`),

    // Generic admin delete function - updated for RESTful approach
    adminDeleteProposal: async (proposalId: string, proposalType?: string) => {

        // If type is provided, use specific endpoint
        if (proposalType) {
            switch (proposalType) {
                case 'investment':
                    return await proposalApi.adminDeleteInvestmentProposal(proposalId);
                case 'research-investment':
                    return await proposalApi.adminDeleteResearchInvestmentProposal(proposalId);
                case 'research-proposal':
                    return await proposalApi.adminDeleteResearchProposal(proposalId);
                default:
                    console.warn(`Unknown proposal type: ${proposalType}, using generic delete endpoint`);
            }
        }

        // Fallback: Try to delete using generic endpoint or try all types
        // This allows deletion of proposals with unknown/missing types
        try {
            return await proposalApi.adminDeleteResearchProposal(proposalId);
        } catch {
            try {
                return await proposalApi.adminDeleteInvestmentProposal(proposalId);
            } catch {
                return await proposalApi.adminDeleteResearchInvestmentProposal(proposalId);
            }
        }
    },

    // ========== Comments API ==========
    addComment: async (proposalId: string, text: string, proposalType: string) => {
        const endpointMap: Record<string, string> = {
            'investment': '/investment-questionnaire/add-comment',
            'research-investment': '/research-investment-questionnaire/add-comment',
            'research-proposal': '/research-proposal-questionnaire/add-comment',
        };
        const endpoint = endpointMap[proposalType] || endpointMap['investment'];
        return await callAPI("POST", `${endpoint}/${proposalId}`, { text });
    },

    getComments: async (proposalId: string, proposalType: string) => {
        const endpointMap: Record<string, string> = {
            'investment': '/investment-questionnaire/comments',
            'research-investment': '/research-investment-questionnaire/comments',
            'research-proposal': '/research-proposal-questionnaire/comments',
        };
        const endpoint = endpointMap[proposalType] || endpointMap['investment'];
        return await callAPI("GET", `${endpoint}/${proposalId}`);
    },
};

export default proposalApi;

// NOTE: As per backend schema refactor (see SCHEMA_REFACTOR_REPORT.md),
// Research Investment Application, Research Proposal Application, and Investor Application
// now expect and return embedded objects (e.g., significance, intellectualProperty, existingResources, requiredAssistanceFromGovernment)
// directly in the main application document. No references or separate collections are used.
// All API consumers should expect these fields as embedded objects.
// No UI changes are required, but if you use types/interfaces, update them accordingly.

import {callAPI} from "../config/AxiosInstance";

const questionnaireEndpoints = {
    CreateInvestorQuestionnaire: "/investment-questionnaire/create",
    ResearchInvestmentApplicationCreate: "/research-investment-questionnaire/create",
    ResearchProposalApplicationCreate: "/research-proposal-questionnaire/create",

    InvestorApplicationCount: "/investment-questionnaire/count",
    ResearchInvestmentApplicationCount: "/research-investment-questionnaire/count",
    ResearchProposalApplicationCount: "/research-proposal-questionnaire/count",
};

const questionnaireApi = {
    CreateInvestorQuestionnaire: async (params: any) =>
        await callAPI("POST", questionnaireEndpoints.CreateInvestorQuestionnaire, params),
    ResearchInvestmentApplicationCreate: async (params: any) =>
        await callAPI("POST", questionnaireEndpoints.ResearchInvestmentApplicationCreate, params),
    ResearchProposalApplicationCreate: async (params: any) =>
        await callAPI("POST", questionnaireEndpoints.ResearchProposalApplicationCreate, params),

    InvestorApplicationCount: async () =>
        await callAPI("GET", questionnaireEndpoints.InvestorApplicationCount),
    ResearchInvestmentApplicationCount: async () =>
        await callAPI("GET", questionnaireEndpoints.ResearchInvestmentApplicationCount),
    ResearchProposalApplicationCount: async () =>
        await callAPI("GET", questionnaireEndpoints.ResearchProposalApplicationCount),
};

export default questionnaireApi;
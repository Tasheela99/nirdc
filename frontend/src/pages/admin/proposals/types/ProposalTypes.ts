// Only include the GET methods that fetch all proposals (no parameters)
export type ProposalApiEndpoint =
    | "GetInvestorApplicationProposals"
    | "GetResearchInvestmentApplicationProposals"
    | "GetResearchProposalApplicationProposals";

export interface ProposalType {
    value: string;
    label: string;
    endpoint: ProposalApiEndpoint;
}

// Updated to match backend refactor: embedded objects for significance, intellectualProperty, existingResources, requiredAssistanceFromGovernment
export interface Proposal {
    _id: string;
    applicationId: string;
    department: string;
    _proposalType?: string; // Added for type tracking
    userId: {
        _id: string;
        email: string;
        mobile: string;
        // ...other user fields
    };
    createdAt: string;
    applicationStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
    status?: string;
    isOpenedByAdmin?: boolean; // Track if admin has opened this proposal
    // Fields for proposal type identification
    investmentObjectives?: any;
    researchObjectives?: any;
    objectives?: any;
    // Embedded objects
    significance?: {
        // fields for significance
        [key: string]: any;
    };
    intellectualProperty?: {
        // fields for intellectual property
        [key: string]: any;
    };
    existingResources?: {
        // fields for existing resources
        [key: string]: any;
    };
    requiredAssistanceFromGovernment?: {
        // fields for required assistance
        [key: string]: any;
    };
    // ...other embedded fields as needed
}

export interface FilterOptions {
    value: string;
    label: string;
}

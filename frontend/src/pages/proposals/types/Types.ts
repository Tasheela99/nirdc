

export interface LocationState {
    proposalType?: string;
    previousStatusRoute?: string;
    returnTab?: number; // Tab index to return to (0, 1, or 2)
    returnTabUrl?: string; // Full URL with tab parameter
    returnProposalId?: string; // Proposal ID for scrolling back to specific proposal
}

export interface ProposalField {
    label: string;
    value: any;
    type?: 'text' | 'boolean' | 'date' | 'currency' | 'email' | 'phone';
    icon?: React.ReactNode;
    category?: string;
}

export interface ProposalTypeConfig {
    title: string;
    icon: React.ElementType;
    color: string;
    fieldMapping: FieldMappingType;
    sections: ProposalSection[];
}

export interface ProposalSection {
    id: string;
    title: string;
    icon: React.ElementType;
    fields: string[];
}

export type FieldMappingType = {
    [key: string]: {
        label: string;
        type?: 'text' | 'boolean' | 'date' | 'currency' | 'email' | 'phone';
        category: string;
        formatter?: (value: any) => any;
    }
};
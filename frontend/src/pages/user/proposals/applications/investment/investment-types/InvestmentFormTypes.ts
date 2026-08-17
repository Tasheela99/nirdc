// Form data types for Research Investment Application
export interface IntellectualPropertyData {
    patentNumber: string;
    receivedDate: string;
    localOrInternational: string;
    status: string;
}

export interface SignificanceData {
    economicImpact: string;
    other: string;
    socialImpact: string;
    environmentalImpact: string;
}

// Single-select string

export interface RequiredAssistanceFromGovernment {
    funds: boolean;
    regulatory: boolean;
    land: boolean;
    infrastructure: boolean;
    technicalAssistance: boolean;
    partnerships: boolean;
    ip: boolean;
    other: string;
}

export interface InvestmentFormData {
    department: any;
    projectTitle: string;
    investmentObjectives: string;
    marketDemand: string;
    requiredAssistanceFromGovernment: RequiredAssistanceFromGovernment;
    researchGaps: string;
    researchObjectives: string;
    researchPlan: string;
    currencyValue: string;
    projectCost: string;
    expenditure: string;
    budget: string;
    milestone_budget?: string;
    researchPlace: string;
    significance: SignificanceData;
    intellectualProperty: IntellectualPropertyData;
    trl: string;
    publications: string;
    totalInvestment: string;
    roi: string;
    resourcesCollaborations: string;
    riskAssumptions: string;
    fundingRequirement?: string | number;
    investmentPeriod?: string | number;
    certificationsDocuments: FileList | null;
    extraCertificationsDocuments: FileList | null;
}

export interface InvestmentFormSectionProps {
    formData: InvestmentFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<InvestmentFormData>>;
}

export interface FormSectionProps {
    formData: InvestmentFormData;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData?: React.Dispatch<React.SetStateAction<InvestmentFormData>>;
    fixDataStructure?: () => void;
}

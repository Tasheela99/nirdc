export type EconomicImpactType = "exportPotential" | "importSubstitution" | "other";

export interface Assistance {
    funds: boolean;
    regulatory: boolean;
    land: boolean;
    infrastructure: boolean;
    technicalAssistance: boolean;
    partnerships: boolean;
    ip: boolean;
    other: string;
}

export interface ExistingResources {
    local: boolean;
    international: boolean;
}

export interface Significance {
    economicImpactType: EconomicImpactType;
    other: string;
    socialImpact: string;
    environmentalImpact: string;
}


export interface InvestorFormData {
    investmentObjectives: string;
    department: any;
    marketDemand: string;
    // economicImpact: EconomicImpact;
    socialImpact: string;
    environmentalImpact: string;
    totalInvestment: string;
    expectedROI: string;
    existingResources: ExistingResources;
    requiredAssistanceFromGovernment: Assistance;
    riskAssumptions: string;
    documents: FileList | null;
    significance: Significance;
    expectedReturn?: string | number;
    timeframe?: string | number;
}

export interface InvestorFormProps {
    formData: InvestorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<InvestorFormData>>;
}

export interface FormSectionProps {
    formData: InvestorFormData;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData?: React.Dispatch<React.SetStateAction<InvestorFormData>>;
    fixDataStructure?: () => void;
}

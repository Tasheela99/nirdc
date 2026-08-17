// Form data types for Research Proposal Application
export interface SignificanceData {
    // exportPotential: boolean;
    // importSubstitution: boolean;
    other: string;
    socialImpact: string;
    environmentalImpact: string;
    economicImpact: string;
}

export interface IntellectualPropertyData {
    status: string;
    patentNumber: string;
    receivedDate: string;
    localOrInternational: string;
}

export interface FormData {
    title: string;
    department: string;
    researchGaps: string;
    objectives: string;
    significance: SignificanceData;
    marketDemand: string;
    innovation: string;
    intellectualProperty: IntellectualPropertyData;
    technologyReadinessLevel: string;
    publications: string;
    researchPlan: string;
    supportingDocuments: FileList | null;
    certifications: FileList | null;
    currency: string;
    currencyValue: string;
    expenditure: string;
    budget: string;
    milestone_budget: string;
    research_place: string;
    resources: string;
}

export interface FormSectionProps {
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    fixDataStructure?: () => void;
}

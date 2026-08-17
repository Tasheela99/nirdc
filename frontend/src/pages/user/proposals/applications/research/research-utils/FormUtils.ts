import { FormData } from '../research-types/FormTypes.ts';

export const validateFormData = (formData: FormData): string[] => {
    const missingFields: string[] = [];

    // General Fields
    if (!formData.title.trim()) missingFields.push("Title of the Research Project");
    if (!formData.department.trim()) missingFields.push("Department");

    // Research Details
    if (!formData.researchGaps.trim()) missingFields.push("Research Gaps");
    if (!formData.objectives.trim()) missingFields.push("Objectives");
    if (!formData.marketDemand.trim()) missingFields.push("Market Demand");
    if (!formData.innovation.trim()) missingFields.push("Innovation/Novelty");
    if (!formData.researchPlan.trim()) missingFields.push("Research Plan");
    if (!formData.research_place.trim()) missingFields.push("Research Place");
    if (!formData.resources.trim()) missingFields.push("Existing Resources & Collaborations");

    // Total Project Cost
    if (!formData.currency.trim()) missingFields.push("Currency for Total Project Cost");
    if (!formData.currencyValue) missingFields.push("Currency Value for Total Project Cost");
    if (!formData.expenditure) missingFields.push("Total Expenditure to Date");
    if (!formData.budget) missingFields.push("Expected Budget for Gap Filling Research");
    if (!formData.milestone_budget.trim()) missingFields.push("Budget for Milestones");

    // Significance
    if (!formData.significance.economicImpact.trim()) missingFields.push("Economic Impact Type");
    if (formData.significance.economicImpact === "other" && !formData.significance.other.trim()) {
        missingFields.push("Other Economic Impact Details");
    }
    if (!formData.significance.socialImpact.trim()) missingFields.push("Social Impact");
    if (!formData.significance.environmentalImpact.trim()) missingFields.push("Environmental Impact");

    // Intellectual Property
    if (formData.intellectualProperty.status !== "None") {
        if (!formData.intellectualProperty.patentNumber.trim()) missingFields.push("Patent Number");
        if (!formData.intellectualProperty.receivedDate.trim()) missingFields.push("Patent Received Date");
        if (!formData.intellectualProperty.localOrInternational.trim())
            missingFields.push("Patent Local/International");
    }

    // Technology Readiness Level and Publications
    if (!formData.technologyReadinessLevel.trim()) missingFields.push("Technology Readiness Level (TRL)");
    if (!formData.publications.trim()) missingFields.push("Publications");

    // Supporting Files
    if (!formData.supportingDocuments || formData.supportingDocuments.length === 0)
        missingFields.push("Supporting Letters and Recommendations");
    if (!formData.certifications || formData.certifications.length === 0)
        missingFields.push("Certifications and Any Other Relevant Documents");

    return missingFields;
};

export const getInitialFormData = (title?: string): FormData => ({
    title: "",
    department: title || "",
    researchGaps: "",
    objectives: "",
    significance: {
        // exportPotential: false,
        // importSubstitution: false,
        other: "",
        socialImpact: "",
        environmentalImpact: "",
        economicImpact: "",
    },
    marketDemand: "",
    innovation: "",
    intellectualProperty: {
        status: "",
        patentNumber: "",
        receivedDate: "",
        localOrInternational: "",
    },
    technologyReadinessLevel: "",
    publications: "",
    researchPlan: "",
    supportingDocuments: null,
    certifications: null,
    currency: "",
    currencyValue: "",
    expenditure: "",
    budget: "",
    milestone_budget: "",
    research_place: "",
    resources: "",
});

export const LOCAL_STORAGE_KEY = "research-proposal-form-data";
export const EXPIRATION_KEY = "research-proposal-expiration";

export const getStorageKey = (title?: string) => title ? `${LOCAL_STORAGE_KEY}-${decodeURIComponent(title).replace(/\s+/g, '-')}` : LOCAL_STORAGE_KEY;
export const getExpirationKey = (title?: string) => title ? `${EXPIRATION_KEY}-${decodeURIComponent(title).replace(/\s+/g, '-')}` : EXPIRATION_KEY;

export const clearFormDataFromStorage = (title?: string): void => {
    localStorage.removeItem(getStorageKey(title));
    localStorage.removeItem(getExpirationKey(title));
};

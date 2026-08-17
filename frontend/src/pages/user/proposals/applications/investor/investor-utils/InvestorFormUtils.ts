import { InvestorFormData } from "../investor-types/InvestorFormTypes.ts";

export const INVESTOR_LOCAL_STORAGE_KEY = "investorFormData";
export const INVESTOR_EXPIRATION_KEY = "investorFormDataExpiration";

export const getInvestorStorageKey = (title?: string) => title ? `${INVESTOR_LOCAL_STORAGE_KEY}-${decodeURIComponent(title).replace(/\s+/g, '-')}` : INVESTOR_LOCAL_STORAGE_KEY;
export const getInvestorExpirationKey = (title?: string) => title ? `${INVESTOR_EXPIRATION_KEY}-${decodeURIComponent(title).replace(/\s+/g, '-')}` : INVESTOR_EXPIRATION_KEY;

export const getDefaultInvestorFormData = (title?: string): InvestorFormData => ({
    investmentObjectives: "",
    department: title,
    marketDemand: "",
    // economicImpact: { exportPotential: false, importSubstitution: false, other: "" }, // if needed
    socialImpact: "",
    environmentalImpact: "",
    totalInvestment: "",
    expectedROI: "",
    existingResources: { local: false, international: false },
    requiredAssistanceFromGovernment: { funds: false, regulatory: false, land: false, infrastructure: false, technicalAssistance: false, partnerships: false, ip: false, other: "" },
    riskAssumptions: "",
    documents: null,
    significance: {
        economicImpactType: "exportPotential",
        other: "",
        socialImpact: "",
        environmentalImpact: ""
    }
});

export const validateInvestorFormData = (formData: InvestorFormData): string[] => {
    const missingFields: string[] = [];

    // General Fields
    if (!formData.investmentObjectives.trim()) missingFields.push("Investment Objectives");
    if (!formData.marketDemand.trim()) missingFields.push("Market Demand");

    // Significance Fields
    if (!formData.significance.economicImpactType) missingFields.push("Economic Impact");
    if (formData.significance.economicImpactType === "other" && !formData.significance.other.trim()) {
        missingFields.push("Other Economic Impact Details");
    }
    if (!formData.significance.socialImpact.trim()) missingFields.push("Social Impact");
    if (!formData.significance.environmentalImpact.trim()) missingFields.push("Environmental Impact");

    // Investment and ROI
    if (!formData.totalInvestment.trim()) missingFields.push("Total Project Investment");
    if (!formData.expectedROI.trim()) missingFields.push("Expected ROI");

    // Existing Resources
    if (!formData.existingResources.local && !formData.existingResources.international) {
        missingFields.push("Existing Resources (at least one must be selected: Local or International)");
    }

    // Required Assistance
    const hasRequiredAssistance = Object.entries(formData.requiredAssistanceFromGovernment)
        .filter(([key]) => key !== 'other')
        .some(([, val]) => val);
    if (!hasRequiredAssistance && !formData.requiredAssistanceFromGovernment.other.trim()) {
        missingFields.push("Required Assistance (at least one must be selected or specify 'Other')");
    }

    // Risk and Assumptions
    if (!formData.riskAssumptions.trim()) missingFields.push("Risk and Assumptions");

    // File Upload
    if (!formData.documents || formData.documents.length === 0) {
        missingFields.push("Certifications and Relevant Documents");
    }

    return missingFields;
};

export const migrateInvestorFormData = (data: any): InvestorFormData => {
    const correctedData = { ...data };
    
    // Ensure all required fields exist
    const defaultData = getDefaultInvestorFormData();
    Object.keys(defaultData).forEach(key => {
        if (correctedData[key] === undefined) {
            correctedData[key] = defaultData[key as keyof InvestorFormData];
        }
    });
    
    return correctedData as InvestorFormData;
};

export const loadInvestorFormDataFromStorage = (title?: string): InvestorFormData => {
    try {
        const savedData = localStorage.getItem(getInvestorStorageKey(title));
        const expiration = localStorage.getItem(getInvestorExpirationKey(title));
        const isExpired = expiration && new Date().getTime() > parseInt(expiration);

        if (savedData && !isExpired) {
            const parsedData = JSON.parse(savedData);
            return migrateInvestorFormData(parsedData);
        }
    } catch (error) {
        console.error("Error loading saved form data:", error);
    }
    return getDefaultInvestorFormData(title);
};

export const saveInvestorFormDataToStorage = (formData: InvestorFormData): void => {
    const expirationTime = new Date().getTime() + 14 * 24 * 60 * 60 * 1000; // 14 days
    try {
        const title = formData.department;
        localStorage.setItem(getInvestorStorageKey(title), JSON.stringify(formData));
        localStorage.setItem(getInvestorExpirationKey(title), expirationTime.toString());
    } catch (error) {
        console.error("Error saving form data:", error);
    }
};

export const clearInvestorFormDataFromStorage = (title?: string): void => {
    localStorage.removeItem(getInvestorStorageKey(title));
    localStorage.removeItem(getInvestorExpirationKey(title));
};

import { InvestmentFormData } from '../investment-types/InvestmentFormTypes.ts';

export const validateInvestmentFormData = (formData: InvestmentFormData): string[] => {
    const missingFields: string[] = [];

    // Validate core fields
    if (!formData.projectTitle.trim()) missingFields.push("Project Title");
    if (!formData.investmentObjectives.trim()) missingFields.push("Investment Objectives");
    if (!formData.marketDemand.trim()) missingFields.push("Market Demand");

    // Validate required assistance: at least one main checkbox or 'other' must be filled
    const mainOptions = [
        formData.requiredAssistanceFromGovernment.funds,
        formData.requiredAssistanceFromGovernment.regulatory,
        formData.requiredAssistanceFromGovernment.land,
        formData.requiredAssistanceFromGovernment.infrastructure,
        formData.requiredAssistanceFromGovernment.technicalAssistance,
        formData.requiredAssistanceFromGovernment.partnerships,
        formData.requiredAssistanceFromGovernment.ip
    ];
    const noneSelected = !mainOptions.some(Boolean);
    if (noneSelected && !formData.requiredAssistanceFromGovernment.other.trim()) {
        missingFields.push("Required Assistance (at least one must be selected or specify 'Other')");
    }

    // Validate required assistance details if funds are requested
    if (formData.requiredAssistanceFromGovernment.funds) {
        if (!formData.researchGaps.trim()) missingFields.push("Research Gaps");
        if (!formData.researchObjectives.trim()) missingFields.push("Research Objectives");
        if (!formData.researchPlan.trim()) missingFields.push("Research Plan");
        if (!formData.currencyValue.trim()) missingFields.push("Currency Value");
        // Accept both numbers and numeric strings
        const isValidNumber = (val: any) => {
            if (typeof val === 'number') return !isNaN(val);
            if (typeof val === 'string' && val.trim() !== '') return !isNaN(Number(val));
            return false;
        };
        if (!isValidNumber(formData.projectCost)) missingFields.push("Project Cost");
        if (!isValidNumber(formData.expenditure)) missingFields.push("Expenditure");
        if (!isValidNumber(formData.budget)) missingFields.push("Budget");
        if (!formData.researchPlace.trim()) missingFields.push("Research Place");
    }

    // Validate significance fields
    if (!formData.significance.economicImpact.trim()) {
        missingFields.push("Economic Impact Type");
    } else if (
        formData.significance.economicImpact === "other" &&
        !formData.significance.other.trim()
    ) {
        missingFields.push("Other Economic Impact Details");
    }
    if (!formData.significance.socialImpact.trim()) missingFields.push("Social Impact");
    if (!formData.significance.environmentalImpact.trim()) missingFields.push("Environmental Impact");

    // Validate investment and ROI
    if (!formData.totalInvestment.trim()) missingFields.push("Total Investment");
    if (!formData.roi.trim()) missingFields.push("Expected ROI");

    // Validate resources and collaborations
    if (!formData.resourcesCollaborations.trim()) missingFields.push("Resources & Collaborations");
    if (!formData.riskAssumptions.trim()) missingFields.push("Risk & Assumptions");

    // Validate file uploads
    if (!formData.certificationsDocuments || formData.certificationsDocuments.length === 0) {
        missingFields.push("Certifications Documents");
    }
    if (!formData.extraCertificationsDocuments || formData.extraCertificationsDocuments.length === 0) {
        missingFields.push("Extra Certifications Documents");
    }

    // Check optional intellectual property details if applicable
    if (formData.intellectualProperty.status !== "None") {
        if (!formData.intellectualProperty.patentNumber.trim()) {
            missingFields.push("Patent Number");
        }
        if (!formData.intellectualProperty.receivedDate.trim()) {
            missingFields.push("Patent Received Date");
        }
        if (!formData.intellectualProperty.localOrInternational.trim()) {
            missingFields.push("Patent Type (Local or International)");
        }
    }

    // Validate TRL and Publications
    if (!formData.trl.trim()) missingFields.push("Technology Readiness Level");
    if (!formData.publications.trim()) missingFields.push("Publications");

    return missingFields;
};

export const getInitialInvestmentFormData = (title?: string): InvestmentFormData => ({
    department: title,
    projectTitle: "",
    investmentObjectives: "",
    marketDemand: "",
    requiredAssistanceFromGovernment: {
        funds: false,
        regulatory: false,
        land: false,
        infrastructure: false,
        technicalAssistance: false,
        partnerships: false,
        ip: false,
        other: "",
    },
    researchGaps: "",
    researchObjectives: "",
    researchPlan: "",
    currencyValue: "",
    projectCost: "",
    expenditure: "",
    budget: "",
    researchPlace: "",
    significance: {
        economicImpact: "",
        other: "",
        socialImpact: "",
        environmentalImpact: "",
    },
    intellectualProperty: {
        patentNumber: "",
        receivedDate: "",
        localOrInternational: "",
        status: "None",
    },
    trl: "",
    publications: "",
    totalInvestment: "",
    roi: "",
    resourcesCollaborations: "",
    riskAssumptions: "",
    certificationsDocuments: null,
    extraCertificationsDocuments: null,
});

export const INVESTMENT_LOCAL_STORAGE_KEY = "investmentFormData";
export const INVESTMENT_EXPIRATION_KEY = "investmentExpiration";

export const getInvestmentStorageKey = (title?: string) => title ? `${INVESTMENT_LOCAL_STORAGE_KEY}-${decodeURIComponent(title).replace(/\s+/g, '-')}` : INVESTMENT_LOCAL_STORAGE_KEY;
export const getInvestmentExpirationKey = (title?: string) => title ? `${INVESTMENT_EXPIRATION_KEY}-${decodeURIComponent(title).replace(/\s+/g, '-')}` : INVESTMENT_EXPIRATION_KEY;

export const saveInvestmentFormDataToStorage = (formData: InvestmentFormData): void => {
    const expirationTime = new Date().getTime() + 14 * 24 * 60 * 60 * 1000; // 14 days
    try {
        const title = formData.department;
        localStorage.setItem(getInvestmentStorageKey(title), JSON.stringify(formData));
        localStorage.setItem(getInvestmentExpirationKey(title), expirationTime.toString());
    } catch (error) {
        console.error("Error saving investment form data", error);
    }
};

export const loadInvestmentFormDataFromStorage = (title?: string): InvestmentFormData | null => {
    try {
        const savedData = localStorage.getItem(getInvestmentStorageKey(title));
        const expiration = localStorage.getItem(getInvestmentExpirationKey(title));
        if (savedData && expiration && new Date().getTime() < parseInt(expiration)) {
            return JSON.parse(savedData);
        }
    } catch (error) {
        console.error("Error loading investment form data", error);
    }
    return null;
};

export const clearInvestmentFormDataFromStorage = (title?: string): void => {
    localStorage.removeItem(getInvestmentStorageKey(title));
    localStorage.removeItem(getInvestmentExpirationKey(title));
};

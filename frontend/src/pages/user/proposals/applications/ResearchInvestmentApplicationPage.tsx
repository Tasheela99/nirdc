import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import questionnaireApi from "../../../../api/QuestionnaireApi.ts";
import { ApiResponse } from "../../../../utils/ApiResponse.ts";
import AlertComponent from "../../../../components/common/Alert.tsx";
import FormWizard from "../../../../components/common/FormWizard.tsx";
import { useInvestmentFormData } from "./investment/investment-hooks/useInvestmentFormData";
import { validateInvestmentFormData, clearInvestmentFormDataFromStorage } from "./investment/investment-utils/InvestmentFormUtils";
import InvestmentBasicInfoSection from "./investment/investment-components/InvestmentBasicInfoSection";
import RequiredAssistanceSection from "./investment/investment-components/RequiredAssistanceSection";
import FundingSection from "./investment/investment-components/FundingSection";
import InvestmentSignificanceSection from "./investment/investment-components/InvestmentSignificanceSection";
import InvestmentIntellectualPropertySection from "./investment/investment-components/InvestmentIntellectualPropertySection";
import InvestmentAnalysisSection from "./investment/investment-components/InvestmentAnalysisSection";
import InvestmentFileUploadSection from "./investment/investment-components/InvestmentFileUploadSection";
import AutoSaveIndicator from "../../../../components/common/AutoSaveIndicator";

const ResearchInvestmentApplicationScreen = () => {
    const { title } = useParams<{ title: string }>();
    const { formData, setFormData, handleChange, resetForm, autoSaveStatus, lastSavedAt } = useInvestmentFormData(title);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // Step validators
    const validateStep1 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.projectTitle.trim()) errors.push("Project Title is required");
        if (!formData.investmentObjectives.trim()) errors.push("Investment Objectives is required");
        if (!formData.marketDemand.trim()) errors.push("Market Demand is required");
        return errors;
    }, [formData.projectTitle, formData.investmentObjectives, formData.marketDemand]);

    const validateStep2 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.significance.economicImpact.trim()) errors.push("Economic Impact type is required");
        if (formData.significance.economicImpact === "other" && !formData.significance.other.trim()) {
            errors.push("Please specify Other Economic Impact");
        }
        if (!formData.significance.socialImpact.trim()) errors.push("Social Impact is required");
        if (!formData.significance.environmentalImpact.trim()) errors.push("Environmental Impact is required");
        if (formData.intellectualProperty.status !== "None" && formData.intellectualProperty.status) {
            if (!formData.intellectualProperty.patentNumber.trim()) errors.push("Patent Number is required");
            if (!formData.intellectualProperty.receivedDate.trim()) errors.push("Patent Received Date is required");
        }
        return errors;
    }, [formData.significance, formData.intellectualProperty]);

    const validateStep3 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.totalInvestment.trim()) errors.push("Total Investment is required");
        if (!formData.roi.trim()) errors.push("Expected ROI is required");
        if (formData.requiredAssistanceFromGovernment.funds) {
            if (!formData.currencyValue.trim()) errors.push("Currency Value is required");
            if (!formData.researchPlan.trim()) errors.push("Research Plan is required");
        }
        return errors;
    }, [formData.totalInvestment, formData.roi, formData.requiredAssistanceFromGovernment.funds, formData.currencyValue, formData.researchPlan]);

    const validateStep4 = useCallback(() => {
        const errors: string[] = [];
        const hasAssistance = Object.entries(formData.requiredAssistanceFromGovernment)
            .filter(([key]) => key !== 'other')
            .some(([, val]) => val);
        if (!hasAssistance && !formData.requiredAssistanceFromGovernment.other.trim()) {
            errors.push("Select at least one Required Assistance option or specify Other");
        }
        if (!formData.resourcesCollaborations.trim()) errors.push("Resources & Collaborations is required");
        if (!formData.riskAssumptions.trim()) errors.push("Risk & Assumptions is required");
        return errors;
    }, [formData.requiredAssistanceFromGovernment, formData.resourcesCollaborations, formData.riskAssumptions]);

    const validateStep5 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.certificationsDocuments || formData.certificationsDocuments.length === 0) {
            errors.push("Certifications Documents is required");
        }
        if (!formData.extraCertificationsDocuments || formData.extraCertificationsDocuments.length === 0) {
            errors.push("Extra Certifications Documents is required");
        }
        return errors;
    }, [formData.certificationsDocuments, formData.extraCertificationsDocuments]);

    const handleSubmit = async () => {
        const missingFields = validateInvestmentFormData(formData);

        if (missingFields.length > 0) {
            const formattedMissingFields = `<ul class="list-disc ml-5">${missingFields
                .map((field) => `<li>${field}</li>`)
                .join("")}</ul>`;
            setAlertMessage(`<b class="font-bold">The following fields are required:</b><br>${formattedMissingFields}`);
            setShowAlert(true);
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            let certFilesCount = 0;
            if (formData.certificationsDocuments instanceof FileList) {
                Array.from(formData.certificationsDocuments).forEach((file) => {
                    if (file instanceof File) {
                        formDataToSend.append("certificationsDocuments", file);
                        certFilesCount++;
                    }
                });
            }
            if (certFilesCount === 0) {
                formDataToSend.append("certificationsDocuments", JSON.stringify([]));
            }

            let extraCertFilesCount = 0;
            if (formData.extraCertificationsDocuments instanceof FileList) {
                Array.from(formData.extraCertificationsDocuments).forEach((file) => {
                    if (file instanceof File) {
                        formDataToSend.append("extraCertificationsDocuments", file);
                        extraCertFilesCount++;
                    }
                });
            }
            if (extraCertFilesCount === 0) {
                formDataToSend.append("extraCertificationsDocuments", JSON.stringify([]));
            }

            Object.entries(formData).forEach(([key, value]) => {
                if (key !== "certificationsDocuments" && key !== "extraCertificationsDocuments") {
                    if (typeof value === "string" || typeof value === "number") {
                        formDataToSend.append(key, value.toString());
                    } else if (value instanceof Object && value !== null) {
                        formDataToSend.append(key, JSON.stringify(value));
                    }
                }
            });

            const response = await questionnaireApi.ResearchInvestmentApplicationCreate(
                formDataToSend
            ) as ApiResponse;

            if (response.status) {
                setAlertMessage("Form successfully submitted!");
                setShowAlert(true);
                resetForm();
            } else {
                setAlertMessage("Failed to submit the form. Please try again.");
                setShowAlert(true);
            }
        } catch (error: any) {
            console.error("Submission Error:", error);
            let message = "Error occurred during submission. Please try again later.";
            if (error?.code === 'ECONNABORTED') {
                message = "The server took too long to respond. Your submission may have succeeded. Please check your submissions or try again later.";
            } else if (error?.response?.data?.error) {
                message = typeof error.response.data.error === 'string' ? error.response.data.error : error.response.data.message;
            } else if (error?.response?.data?.message) {
                message = error.response.data.message;
            } else if (error?.message) {
                message = error.message;
            }
            setAlertMessage(message);
            setShowAlert(true);
        } finally {
            clearInvestmentFormDataFromStorage(title);
            setIsSubmitting(false);
        }
    };

    const handleAlertConfirm = () => {
        setShowAlert(false);
        if (alertMessage === "Form submitted successfully!") {
            clearInvestmentFormDataFromStorage(title);
            window.location.href = "/relevant";
        }
    };

    const wizardSteps = [
        {
            label: "Project Info",
            content: (
                <InvestmentBasicInfoSection
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                />
            ),
            validate: validateStep1,
        },
        {
            label: "Significance & IP",
            content: (
                <>
                    <InvestmentSignificanceSection
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                    />
                    <InvestmentIntellectualPropertySection
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                    />
                </>
            ),
            validate: validateStep2,
        },
        {
            label: "Analysis & Funding",
            content: (
                <>
                    <InvestmentAnalysisSection
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                    />
                    <FundingSection
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                    />
                </>
            ),
            validate: validateStep3,
        },
        {
            label: "Assistance & Resources",
            content: (
                <RequiredAssistanceSection
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                />
            ),
            validate: validateStep4,
        },
        {
            label: "Upload & Submit",
            content: (
                <InvestmentFileUploadSection
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                />
            ),
            validate: validateStep5,
        },
    ];

    return (
        <>
            {showAlert && (
                <AlertComponent
                    message={alertMessage}
                    onConfirm={handleAlertConfirm}
                />
            )}

            <FormWizard
                title="Research & Investment Application"
                steps={wizardSteps}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                guidelinesUrl="/research-investment-guidelines"
                headerRightContent={
                    <div className="bg-white/90 rounded-full px-3 py-1 shadow-sm">
                        <AutoSaveIndicator status={autoSaveStatus} lastSavedAt={lastSavedAt} />
                    </div>
                }
                noteContent={
                    <>
                        <h3 className="text-base font-semibold text-[#003893] mb-2">
                            Note: Additional requirements for next level selection
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Please ensure all documents and information are complete and accurate before submission.
                        </p>
                    </>
                }
            />
        </>
    );
};

export default ResearchInvestmentApplicationScreen;

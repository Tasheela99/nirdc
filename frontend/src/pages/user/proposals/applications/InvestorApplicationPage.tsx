import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import questionnaireApi from "../../../../api/QuestionnaireApi";
import { ApiResponse } from "../../../../utils/ApiResponse";
import AlertComponent from "../../../../components/common/Alert.tsx";
import FormWizard from "../../../../components/common/FormWizard.tsx";
import { useInvestorFormData } from "./investor/investor-hooks/useInvestorFormData";
import { validateInvestorFormData, clearInvestorFormDataFromStorage } from "./investor/investor-utils/InvestorFormUtils";
import InvestorBasicInfoSection from "./investor/investor-components/InvestorBasicInfoSection";
import InvestorSignificanceSection from "./investor/investor-components/InvestorSignificanceSection";
import InvestorAnalysisSection from "./investor/investor-components/InvestorAnalysisSection";
import InvestorResourcesSection from "./investor/investor-components/InvestorResourcesSection";
import InvestorRequiredAssistanceSection from "./investor/investor-components/InvestorRequiredAssistanceSection";
import InvestorFileUploadSection from "./investor/investor-components/InvestorFileUploadSection";
import AutoSaveIndicator from "../../../../components/common/AutoSaveIndicator";

const InvestorApplicationScreen: React.FC = () => {
    const { title } = useParams<{ title: string }>();
    const { formData, setFormData, handleChange, resetForm, autoSaveStatus, lastSavedAt } = useInvestorFormData(title);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // Step validators
    const validateStep1 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.investmentObjectives.trim()) errors.push("Investment Objectives is required");
        if (!formData.marketDemand.trim()) errors.push("Market Demand is required");
        return errors;
    }, [formData.investmentObjectives, formData.marketDemand]);

    const validateStep2 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.significance.economicImpactType) errors.push("Economic Impact type is required");
        if (formData.significance.economicImpactType === "other" && !formData.significance.other.trim()) {
            errors.push("Please specify Other Economic Impact");
        }
        if (!formData.significance.socialImpact.trim()) errors.push("Social Impact is required");
        if (!formData.significance.environmentalImpact.trim()) errors.push("Environmental Impact is required");
        if (!formData.totalInvestment.trim()) errors.push("Total Project Investment is required");
        if (!formData.expectedROI.trim()) errors.push("Expected ROI is required");
        return errors;
    }, [formData.significance, formData.totalInvestment, formData.expectedROI]);

    const validateStep3 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.existingResources.local && !formData.existingResources.international) {
            errors.push("Select at least one Existing Resource (Local or International)");
        }
        const hasAssistance = Object.entries(formData.requiredAssistanceFromGovernment)
            .filter(([key]) => key !== 'other')
            .some(([, val]) => val);
        if (!hasAssistance && !formData.requiredAssistanceFromGovernment.other.trim()) {
            errors.push("Select at least one Required Assistance option or specify Other");
        }
        if (!formData.riskAssumptions.trim()) errors.push("Risk and Assumptions is required");
        return errors;
    }, [formData.existingResources, formData.requiredAssistanceFromGovernment, formData.riskAssumptions]);

    const validateStep4 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.documents || formData.documents.length === 0) {
            errors.push("Please attach at least one document");
        }
        return errors;
    }, [formData.documents]);

    const handleSubmit = async () => {
        // Full validation
        const missingFields = validateInvestorFormData(formData);
        if (missingFields.length > 0) {
            const formattedMissingFields = `<ul class="list-disc ml-5">${missingFields
                .map((field) => `<li>${field}</li>`)
                .join("")}</ul>`;
            setAlertMessage(`<b class="font-bold">The following fields are required</b><br>${formattedMissingFields}`);
            setShowAlert(true);
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            if (formData.documents) {
                Array.from(formData.documents).forEach((file) => {
                    formDataToSend.append("resource", file);
                });
            }

            formDataToSend.append("department", title || "");
            formDataToSend.append("investmentObjectives", formData.investmentObjectives);
            formDataToSend.append("marketDemand", formData.marketDemand);
            const significanceToSend = {
                ...formData.significance,
                exportPotential: formData.significance.economicImpactType === "exportPotential",
                importSubstitution: formData.significance.economicImpactType === "importSubstitution",
            };
            formDataToSend.append("significance", JSON.stringify(significanceToSend));
            formDataToSend.append("totalProjectInvestment", formData.totalInvestment);
            formDataToSend.append("expectedROI", formData.expectedROI);
            formDataToSend.append("existingResources", JSON.stringify(formData.existingResources));
            formDataToSend.append("requiredAssistanceFromGovernment", JSON.stringify(formData.requiredAssistanceFromGovernment));
            formDataToSend.append("riskAndAssumptions", formData.riskAssumptions);

            const response = await questionnaireApi.CreateInvestorQuestionnaire(formDataToSend) as ApiResponse;

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
            clearInvestorFormDataFromStorage(title);
            setIsSubmitting(false);
        }
    };

    const handleAlertConfirm = () => {
        setShowAlert(false);
        if (alertMessage === "Form successfully submitted!") {
            clearInvestorFormDataFromStorage(title);
            window.location.href = "/relevant";
        }
    };

    const wizardSteps = [
        {
            label: "Objectives & Market",
            content: (
                <InvestorBasicInfoSection
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                />
            ),
            validate: validateStep1,
        },
        {
            label: "Significance & Analysis",
            content: (
                <>
                    <InvestorSignificanceSection
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                    />
                    <InvestorAnalysisSection
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                    />
                </>
            ),
            validate: validateStep2,
        },
        {
            label: "Resources & Assistance",
            content: (
                <>
                    <InvestorResourcesSection
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                    />
                    <InvestorRequiredAssistanceSection
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                    />
                </>
            ),
            validate: validateStep3,
        },
        {
            label: "Upload & Submit",
            content: (
                <InvestorFileUploadSection
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                />
            ),
            validate: validateStep4,
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
            <div className="max-w-4xl mx-auto flex justify-end px-4 mt-4">
                <AutoSaveIndicator status={autoSaveStatus} lastSavedAt={lastSavedAt} />
            </div>
            <FormWizard
                title="Investor Application Form"
                steps={wizardSteps}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                guidelinesUrl="/investor-guidelines"
                noteContent={
                    <>
                        <p className="text-gray-700 font-semibold mb-1">
                            <strong>Note:</strong> If selected for the next level, please prepare:
                        </p>
                        <ul className="list-disc ml-6 text-gray-600 text-sm space-y-0.5">
                            <li>Project implementation timeline</li>
                            <li>Detailed business/commercialization plan</li>
                            <li>Details of benefit sharing process</li>
                        </ul>
                    </>
                }
            />
        </>
    );
};

export default InvestorApplicationScreen;

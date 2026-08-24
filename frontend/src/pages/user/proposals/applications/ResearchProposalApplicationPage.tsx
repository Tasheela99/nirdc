import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import questionnaireApi from "../../../../api/QuestionnaireApi.ts";
import { ApiResponse } from "../../../../utils/ApiResponse.ts";
import AlertComponent from "../../../../components/common/Alert.tsx";
import FormWizard from "../../../../components/common/FormWizard.tsx";
import { useFormData } from "./research/research-hooks/useFormData";
import { validateFormData, clearFormDataFromStorage } from "./research/research-utils/FormUtils";
import BasicInfoSection from "./research/research-components/BasicInfoSection";
import SignificanceSection from "./research/research-components/SignificanceSection";
import MarketAndInnovationSection from "./research/research-components/MarketAndInnovationSection";
import IntellectualPropertySection from "./research/research-components/IntellectualPropertySection";
import ResearchPlanSection from "./research/research-components/ResearchPlanSection";
import BudgetSection from "./research/research-components/BudgetSection";
import LocationAndResourcesSection from "./research/research-components/LocationAndResourcesSection";
import FileUploadSection from "./research/research-components/FileUploadSection";
import AutoSaveIndicator from "../../../../components/common/AutoSaveIndicator";

const ResearchProposalApplicationScreen = () => {
    const { title } = useParams<{ title: string }>();
    const { formData, setFormData, handleChange, resetForm, autoSaveStatus, lastSavedAt } = useFormData(title);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // Step validators
    const validateStep1 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.title.trim()) errors.push("Title of the Research Project is required");
        if (!formData.researchGaps.trim()) errors.push("Research Gaps is required");
        if (!formData.objectives.trim()) errors.push("Objectives is required");
        return errors;
    }, [formData.title, formData.researchGaps, formData.objectives]);

    const validateStep2 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.significance.economicImpact.trim()) errors.push("Economic Impact type is required");
        if (formData.significance.economicImpact === "other" && !formData.significance.other.trim()) {
            errors.push("Please specify Other Economic Impact");
        }
        if (!formData.significance.socialImpact.trim()) errors.push("Social Impact is required");
        if (!formData.significance.environmentalImpact.trim()) errors.push("Environmental Impact is required");
        if (!formData.marketDemand.trim()) errors.push("Market Demand is required");
        if (!formData.innovation.trim()) errors.push("Innovation/Novelty is required");
        return errors;
    }, [formData.significance, formData.marketDemand, formData.innovation]);

    const validateStep3 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.researchPlan.trim()) errors.push("Research Plan is required");
        if (formData.intellectualProperty.status !== "None" && formData.intellectualProperty.status) {
            if (!formData.intellectualProperty.patentNumber.trim()) errors.push("Patent Number is required");
            if (!formData.intellectualProperty.receivedDate.trim()) errors.push("Patent Received Date is required");
        }
        if (!formData.technologyReadinessLevel.trim()) errors.push("Technology Readiness Level is required");
        if (!formData.publications.trim()) errors.push("Publications is required");
        return errors;
    }, [formData.researchPlan, formData.intellectualProperty, formData.technologyReadinessLevel, formData.publications]);

    const validateStep4 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.currency.trim()) errors.push("Currency is required");
        if (!formData.currencyValue) errors.push("Currency Value is required");
        if (!formData.expenditure) errors.push("Total Expenditure to Date is required");
        if (!formData.budget) errors.push("Expected Budget is required");
        if (!formData.milestone_budget.trim()) errors.push("Budget for Milestones is required");
        if (!formData.research_place.trim()) errors.push("Research Place is required");
        if (!formData.resources.trim()) errors.push("Existing Resources is required");
        return errors;
    }, [formData.currency, formData.currencyValue, formData.expenditure, formData.budget, formData.milestone_budget, formData.research_place, formData.resources]);

    const validateStep5 = useCallback(() => {
        const errors: string[] = [];
        if (!formData.supportingDocuments || formData.supportingDocuments.length === 0) {
            errors.push("Supporting Letters and Recommendations is required");
        }
        if (!formData.certifications || formData.certifications.length === 0) {
            errors.push("Certifications and relevant documents is required");
        }
        return errors;
    }, [formData.supportingDocuments, formData.certifications]);

    const handleSubmit = async () => {
        const missingFields = validateFormData(formData);

        if (missingFields.length > 0) {
            const formattedMissingFields = `<ul class="list-disc ml-5">${missingFields
                .map((field) => `<li>${field}</li>`)
                .join("")}</ul>`;
            setAlertMessage(`<b class="font-bold">The following fields are required</b><br>${formattedMissingFields}`);
            setShowAlert(true);
            return;
        }

        setIsSubmitting(true);

        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "supportingDocuments" || key === "certifications") {
                if (value instanceof FileList) {
                    Array.from(value).forEach((file) => {
                        formDataToSend.append(key, file);
                    });
                }
            } else if ((key === "significance" || key === "intellectualProperty") && typeof value === "object" && value !== null) {
                formDataToSend.append(key, JSON.stringify(value));
            } else if (typeof value === "object" && value !== null) {
                formDataToSend.append(key, JSON.stringify(value));
            } else {
                formDataToSend.append(key, value as string);
            }
        });

        try {
            const response = await questionnaireApi.ResearchProposalApplicationCreate(
                formDataToSend
            ) as ApiResponse;

            if (response.status) {
                setAlertMessage("Form submitted successfully!");
                setShowAlert(true);
                resetForm();
            } else {
                setAlertMessage("Failed to submit the form. Please try again.");
                setShowAlert(true);
            }
        } catch (error: any) {
            console.error("Form submission failed:", error);
            let message = "An error occurred during form submission.";
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
            clearFormDataFromStorage(title);
            setIsSubmitting(false);
        }
    };

    const handleAlertConfirm = () => {
        setShowAlert(false);
        if (alertMessage === "Form submitted successfully!") {
            clearFormDataFromStorage(title);
            window.location.href = "/relevant";
        }
    };

    const wizardSteps = [
        {
            label: "Project Info",
            content: (
                <BasicInfoSection formData={formData} handleChange={handleChange} setFormData={setFormData} />
            ),
            validate: validateStep1,
        },
        {
            label: "Significance & Innovation",
            content: (
                <>
                    <SignificanceSection formData={formData} handleChange={handleChange} setFormData={setFormData} />
                    <MarketAndInnovationSection formData={formData} handleChange={handleChange} setFormData={setFormData} />
                </>
            ),
            validate: validateStep2,
        },
        {
            label: "Research Plan & IP",
            content: (
                <>
                    <ResearchPlanSection formData={formData} handleChange={handleChange} setFormData={setFormData} />
                    <IntellectualPropertySection formData={formData} handleChange={handleChange} setFormData={setFormData} />
                </>
            ),
            validate: validateStep3,
        },
        {
            label: "Budget & Resources",
            content: (
                <>
                    <BudgetSection formData={formData} handleChange={handleChange} setFormData={setFormData} />
                    <LocationAndResourcesSection formData={formData} handleChange={handleChange} setFormData={setFormData} />
                </>
            ),
            validate: validateStep4,
        },
        {
            label: "Upload & Submit",
            content: (
                <FileUploadSection formData={formData} handleChange={handleChange} setFormData={setFormData} />
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
                title="Research Proposal Application"
                steps={wizardSteps}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                guidelinesUrl="/research-proposal-guidelines"
                headerRightContent={
                    <div className="bg-white/90 rounded-full px-3 py-1 shadow-sm">
                        <AutoSaveIndicator status={autoSaveStatus} lastSavedAt={lastSavedAt} />
                    </div>
                }
                noteContent={
                    <>
                        <h3 className="text-base font-semibold text-[#003893] mb-2">
                            Note: Documents needed if selected for next level:
                        </h3>
                        <ol className="list-decimal ml-6 text-gray-600 text-sm space-y-0.5">
                            <li>Detailed business/commercialization plan</li>
                            <li>Detailed research methodologies</li>
                            <li>Detailed budget including equipment, consumables, etc.</li>
                            <li>Details of collaborations</li>
                            <li>Details of the research group/staff</li>
                            <li>Risk, assumptions and contingency plan</li>
                        </ol>
                    </>
                }
            />
        </>
    );
};

export default ResearchProposalApplicationScreen;

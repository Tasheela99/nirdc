import React, { useState, useEffect } from "react";
import logo from "../../assets/NIRDC-logo-SVG.svg";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ExpandMore, CheckCircle, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../components/common/AlertContextScreen";
import authApi from "../../api/AuthApi";
import ReviewerIntro from "./reviewer-components/ReviewerIntro";
import ReviewerQualifications from "./reviewer-components/ReviewerQualifications";
import ReviewerConditions from "./reviewer-components/ReviewerConditions";
import ReviewerTrainingVideo from "./reviewer-components/ReviewerTrainingVideo";
import ReviewerMCQ from "./reviewer-components/ReviewerMCQ";
import ReviewerNDA from "./reviewer-components/ReviewerNDA";
import ReviewerForm from "./reviewer-components/ReviewerForm";
import ReviewerCVUpload from "./reviewer-components/ReviewerCVUpload";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const ReviewerRegistrationScreen = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { t } = useTranslation();

    const [expanded, setExpanded] = useState<string | false>("panel1");
    const [isLoading, setIsLoading] = useState(false);
    
    // Session state
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Prevent window scrollbar from showing, but keep page scrollable
    useEffect(() => {
        document.body.classList.add('no-scrollbar');
        return () => {
            document.body.classList.remove('no-scrollbar');
        };
    }, []);

    // States for each step
    const [steps, setSteps] = useState({
        whoIsReviewer: false,
        qualifications: false,
        conditions: false,
        trainingVideo: false,
        mcq: false,
        nda: false
    });

    const [mcqScore, setMcqScore] = useState<number | null>(null);
    const [formData, setFormData] = useState<any>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);

    useEffect(() => {
        const initSession = async () => {
            let storedSession = sessionStorage.getItem("reviewerSessionId");
            if (storedSession) {
                try {
                    const res: any = await authApi.getReviewerSessionState(storedSession);
                    if (res.success || res.status === 200) {
                        setSessionId(storedSession);
                        const state = res.stepsCompleted || res.data?.stepsCompleted;
                        if (state) setSteps(state);
                        return;
                    }
                } catch (e) {
                    sessionStorage.removeItem("reviewerSessionId");
                }
            }
            
            try {
                const res: any = await authApi.startReviewerSession();
                const newId = res.sessionId || res.data?.sessionId;
                if (newId) {
                    setSessionId(newId);
                    sessionStorage.setItem("reviewerSessionId", newId);
                    const state = res.stepsCompleted || res.data?.stepsCompleted;
                    if (state) setSteps(state);
                }
            } catch (e) {
                console.error("Failed to start session", e);
            }
        };
        initSession();
    }, []);

    const markStepCompleted = async (stepKey: string) => {
        if (!sessionId) return false;
        try {
            await authApi.completeReviewerSessionStep(sessionId, stepKey);
            setSteps(prev => ({ ...prev, [stepKey]: true }));
            return true;
        } catch (e) {
            showAlert("Failed to save progress. Please try again.", "error");
            return false;
        }
    };

    const handleAccordionChange = (panel: string, isUnlocked: boolean) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        if (isUnlocked) {
            setExpanded(isExpanded ? panel : false);
        }
    };

    const isStep2Unlocked = steps.whoIsReviewer;
    const isStep3Unlocked = isStep2Unlocked && steps.qualifications;
    const isStep4Unlocked = isStep3Unlocked && steps.conditions;
    const isStep5Unlocked = isStep4Unlocked && steps.trainingVideo;
    const isStep6Unlocked = isStep5Unlocked && steps.mcq;
    const isStep7Unlocked = isStep6Unlocked && steps.nda;

    const submitFullRegistration = async (formDetails: any) => {
        if (!sessionId || !isStep7Unlocked || !cvFile) {
            showAlert("Please complete all steps and upload your CV before submitting.", "error");
            return;
        }

        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            Object.keys(formDetails).forEach(key => {
                if (key === 'areasOfExpertise') {
                    // Split the string by commas to create an array for the backend
                    let expertiseArray = formDetails[key];
                    if (typeof expertiseArray === 'string') {
                        expertiseArray = expertiseArray.split(',').map((s: string) => s.trim()).filter(Boolean);
                    } else if (!Array.isArray(expertiseArray)) {
                        expertiseArray = [expertiseArray];
                    }
                    formDataToSend.append(key, JSON.stringify(expertiseArray));
                } else {
                    formDataToSend.append(key, formDetails[key]);
                }
            });
            formDataToSend.append('sessionId', sessionId);
            formDataToSend.append('mcqScore', mcqScore ? mcqScore.toString() : '0');
            formDataToSend.append('videoCompleted', 'true');
            formDataToSend.append('agreedToGuidelines', 'true');
            formDataToSend.append('cv', cvFile);

            const response = await authApi.registerReviewer(formDataToSend) as any;
            if (response.status || response.success) {
                showAlert(response.message || "Registration successful!", "success");
                sessionStorage.removeItem("reviewerSessionId");
                navigate(`/security/verify-account/${formDetails.email}`);
            } else {
                showAlert(response.message || "Registration failed.", "error");
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Something went wrong. Please try again.";
            showAlert(errorMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-66px)] flex-1 flex flex-col lg:flex-row w-full bg-[#FAFAFA] dark:bg-dark-bg relative">
            {/* Absolute Language Switcher at Top Right */}
            <div className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-lg shadow-sm p-1">
                <LanguageSwitcher />
            </div>

            {/* Left - Branding Panel */}
            <div className="hidden lg:flex lg:sticky lg:top-0 lg:h-[calc(100vh-66px)] lg:w-[45%] flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-12 text-center">
                <img src={logo} alt="NIRDC Logo" className="w-48 h-auto mb-6 brightness-0 invert" />
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{t('reviewerRegistration.brandingTitle')}</h2>
                <p className="text-white/80 text-[0.95rem] max-w-xs leading-relaxed font-body font-light">
                    {t('reviewerRegistration.brandingDesc')}
                </p>
            </div>

            {/* Right - Form Panel */}
            <div className="w-full lg:w-[55%] flex flex-col bg-white dark:bg-dark-surface p-6 lg:p-12 pt-16 lg:pt-12 border-l border-black/5 dark:border-white/5 min-h-[calc(100vh-66px)] lg:min-h-0">
                <div className="w-full h-full flex flex-col">
                    <div className="text-center lg:text-left mb-6 shrink-0">
                        <img src={logo} alt="NIRDC Logo" className="w-28 h-auto mx-auto mb-6 lg:hidden" />
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1A0D15] dark:text-white font-sans tracking-tight mb-2">
                            {t('reviewerRegistration.title')}
                        </h1>
                        <p className="text-[#475569] dark:text-[#94A3B8] font-body text-sm">
                            {t('reviewerRegistration.subtitle')}
                        </p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-2">
                        {/* Step 1: Who is a Reviewer */}
                        <Accordion expanded={expanded === "panel1"} onChange={handleAccordionChange("panel1", true)} className="!shadow-none border border-black/5 dark:border-white/5 !bg-transparent before:hidden rounded-lg">
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <div className="flex items-center gap-3">
                                    {steps.whoIsReviewer ? <CheckCircle color="success" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">1</div>}
                                    <Typography fontWeight="bold">{t('reviewerRegistration.step1Title')}</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ReviewerIntro onComplete={async () => {
                                    if (await markStepCompleted("whoIsReviewer")) setExpanded("panel2");
                                }} />
                            </AccordionDetails>
                        </Accordion>

                        {/* Step 2: Qualifications */}
                        <Accordion expanded={expanded === "panel2"} onChange={handleAccordionChange("panel2", isStep2Unlocked)} disabled={!isStep2Unlocked} className="!shadow-none border border-black/5 dark:border-white/5 !bg-transparent before:hidden rounded-lg">
                            <AccordionSummary expandIcon={!isStep2Unlocked ? <Lock fontSize="small" /> : <ExpandMore />}>
                                <div className="flex items-center gap-3">
                                    {steps.qualifications ? <CheckCircle color="success" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">2</div>}
                                    <Typography fontWeight="bold" color={!isStep2Unlocked ? "textSecondary" : "textPrimary"}>{t('reviewerRegistration.step2Title')}</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ReviewerQualifications onComplete={async () => {
                                    if (await markStepCompleted("qualifications")) setExpanded("panel3");
                                }} />
                            </AccordionDetails>
                        </Accordion>

                        {/* Step 3: Conditions */}
                        <Accordion expanded={expanded === "panel3"} onChange={handleAccordionChange("panel3", isStep3Unlocked)} disabled={!isStep3Unlocked} className="!shadow-none border border-black/5 dark:border-white/5 !bg-transparent before:hidden rounded-lg">
                            <AccordionSummary expandIcon={!isStep3Unlocked ? <Lock fontSize="small" /> : <ExpandMore />}>
                                <div className="flex items-center gap-3">
                                    {steps.conditions ? <CheckCircle color="success" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">3</div>}
                                    <Typography fontWeight="bold" color={!isStep3Unlocked ? "textSecondary" : "textPrimary"}>{t('reviewerRegistration.step3Title')}</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ReviewerConditions onComplete={async () => {
                                    if (await markStepCompleted("conditions")) setExpanded("panel4");
                                }} />
                            </AccordionDetails>
                        </Accordion>

                        {/* Step 4: Training Video */}
                        <Accordion expanded={expanded === "panel4"} onChange={handleAccordionChange("panel4", isStep4Unlocked)} disabled={!isStep4Unlocked} className="!shadow-none border border-black/5 dark:border-white/5 !bg-transparent before:hidden rounded-lg">
                            <AccordionSummary expandIcon={!isStep4Unlocked ? <Lock fontSize="small" /> : <ExpandMore />}>
                                <div className="flex items-center gap-3">
                                    {steps.trainingVideo ? <CheckCircle color="success" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">4</div>}
                                    <Typography fontWeight="bold" color={!isStep4Unlocked ? "textSecondary" : "textPrimary"}>{t('reviewerRegistration.step4Title')}</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ReviewerTrainingVideo 
                                    completed={steps.trainingVideo}
                                    onComplete={async () => {
                                        if (await markStepCompleted("trainingVideo")) setExpanded("panel5");
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>

                        {/* Step 5: MCQ Assessment */}
                        <Accordion expanded={expanded === "panel5"} onChange={handleAccordionChange("panel5", isStep5Unlocked)} disabled={!isStep5Unlocked} className="!shadow-none border border-black/5 dark:border-white/5 !bg-transparent before:hidden rounded-lg">
                            <AccordionSummary expandIcon={!isStep5Unlocked ? <Lock fontSize="small" /> : <ExpandMore />}>
                                <div className="flex items-center gap-3">
                                    {steps.mcq ? <CheckCircle color="success" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">5</div>}
                                    <Typography fontWeight="bold" color={!isStep5Unlocked ? "textSecondary" : "textPrimary"}>{t('reviewerRegistration.step5Title')}</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ReviewerMCQ 
                                    onComplete={async (score) => {
                                        setMcqScore(score);
                                        if (score >= 8) {
                                            if (await markStepCompleted("mcq")) setExpanded("panel6");
                                        } else {
                                            showAlert("You must score at least 8/10 to proceed. You may try again.", "warning");
                                        }
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>

                        {/* Step 6: NDA */}
                        <Accordion expanded={expanded === "panel6"} onChange={handleAccordionChange("panel6", isStep6Unlocked)} disabled={!isStep6Unlocked} className="!shadow-none border border-black/5 dark:border-white/5 !bg-transparent before:hidden rounded-lg">
                            <AccordionSummary expandIcon={!isStep6Unlocked ? <Lock fontSize="small" /> : <ExpandMore />}>
                                <div className="flex items-center gap-3">
                                    {steps.nda ? <CheckCircle color="success" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">6</div>}
                                    <Typography fontWeight="bold" color={!isStep6Unlocked ? "textSecondary" : "textPrimary"}>{t('reviewerRegistration.step6Title')}</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ReviewerNDA onComplete={async () => {
                                    if (await markStepCompleted("nda")) setExpanded("panel7");
                                }} />
                            </AccordionDetails>
                        </Accordion>

                        {/* Step 7: Personal Details & CV */}
                        <Accordion expanded={expanded === "panel7"} onChange={handleAccordionChange("panel7", isStep7Unlocked)} disabled={!isStep7Unlocked} className="!shadow-none border border-black/5 dark:border-white/5 !bg-transparent before:hidden rounded-lg">
                            <AccordionSummary expandIcon={!isStep7Unlocked ? <Lock fontSize="small" /> : <ExpandMore />}>
                                <div className="flex items-center gap-3">
                                    {(formData && cvFile) ? <CheckCircle color="success" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">7</div>}
                                    <Typography fontWeight="bold" color={!isStep7Unlocked ? "textSecondary" : "textPrimary"}>{t('reviewerRegistration.step7Title')}</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg text-[#6B1D4A] mb-4">{t('reviewerRegistration.personalDetails.heading')}</h3>
                                    <ReviewerForm 
                                        initialData={formData} 
                                        isLoading={isLoading}
                                        onComplete={(data) => {
                                            setFormData(data);
                                            submitFullRegistration(data);
                                        }} 
                                        cvUploadComponent={
                                            <div className="mt-8 border-t border-gray-200 pt-6">
                                                <h3 className="font-semibold text-lg text-[#6B1D4A] mb-4">{t('reviewerRegistration.personalDetails.cvHeading')}</h3>
                                                <ReviewerCVUpload 
                                                    file={cvFile}
                                                    onFileChange={(file) => setCvFile(file)}
                                                />
                                            </div>
                                        }
                                    />
                                </div>
                            </AccordionDetails>
                        </Accordion>

                    </div>
                
                    <div className="mt-auto pt-6 text-center shrink-0 pb-12 lg:pb-0">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-[#475569] dark:text-[#94A3B8] hover:text-[#6B1D4A] dark:hover:text-[#F2B705] font-medium text-[0.85rem] transition-colors"
                        >
                            {t('reviewerRegistration.alreadyHaveAccount')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewerRegistrationScreen;

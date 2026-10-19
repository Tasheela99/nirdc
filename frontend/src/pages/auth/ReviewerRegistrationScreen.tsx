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
import { motion } from "framer-motion";
import VantaNetBackground from "../../components/common/VantaNetBackground.tsx";

const ReviewerRegistrationScreen = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { t } = useTranslation();

    const [expanded, setExpanded] = useState<string | false>("panel1");
    const [isLoading, setIsLoading] = useState(false);

    // Session state
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Lock window scrolling on this screen and prevent white gaps at the bottom
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const originalBg = document.body.style.backgroundColor;
        const originalHtmlBg = document.documentElement.style.backgroundColor;

        document.body.style.overflow = 'hidden';
        document.body.style.backgroundColor = '#020204';
        document.documentElement.style.backgroundColor = '#020204';

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.backgroundColor = originalBg;
            document.documentElement.style.backgroundColor = originalHtmlBg;
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
            let storedSession = localStorage.getItem("reviewerSessionId");
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
                    localStorage.removeItem("reviewerSessionId");
                }
            }

            try {
                const res: any = await authApi.startReviewerSession();
                const newId = res.sessionId || res.data?.sessionId;
                if (newId) {
                    setSessionId(newId);
                    localStorage.setItem("reviewerSessionId", newId);
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
                } else if (key === 'customExpertise') {
                    // Ignore customExpertise as it is already merged into areasOfExpertise
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
                localStorage.removeItem("reviewerSessionId");
                navigate(`/security/verify-account/${formDetails.email}`);
            } else {
                showAlert(response.message || "Registration failed.", "error");
            }
        } catch (error: any) {
            if (error.response) {
                const errorData = error.response.data;
                if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                    showAlert(errorData.errors[0], "error");
                } else {
                    showAlert(errorData?.message || "Registration failed.", "error");
                }
            } else if (error.request) {
                showAlert("Network error. Please check your connection.", "error");
            } else {
                showAlert("Something went wrong. Please try again.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const glassAccordionSx = {
        backgroundColor: 'rgba(255, 255, 255, 0.06) !important',
        borderRadius: '16px !important',
        border: '1px solid rgba(255, 255, 255, 0.18) !important',
        color: '#ffffff',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.25s ease-in-out',
        '&:before': { display: 'none' },
        '&.Mui-expanded': {
            backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
            borderColor: 'rgba(255, 255, 255, 0.55) !important',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important',
        },
        '&.Mui-disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.02) !important',
            borderColor: 'rgba(255, 255, 255, 0.08) !important',
            opacity: 0.5,
        }
    };

    return (
        <div className="relative flex-1 h-[calc(100vh-80px)] min-h-[calc(100vh-80px)] w-full overflow-hidden px-4 sm:px-8 py-3 sm:py-5 flex items-center justify-center bg-gradient-to-b from-[#0b0c14] via-[#06070a] to-[#020204]">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-white/[0.08] rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/[0.04] rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute top-10 right-10 w-80 h-80 bg-white/[0.04] rounded-full blur-[110px] pointer-events-none" />

            {/* 3D Vanta Net Animated Background */}
            <VantaNetBackground
                color={0xFF0B132B}
                backgroundColor={0x0b0208}
                points={18.0}
                maxDistance={42.0}
                spacing={28.0}
                showDots={true}
            />

            {/* Glassmorphic Container Card */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[1400px] h-full max-h-[calc(100vh-80px-2.5rem)] rounded-3xl overflow-hidden flex flex-col lg:flex-row border border-white/25 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)]"
                style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.05) 100%)",
                }}
            >
                {/* Absolute Language Switcher at Top Right */}
                <div className="absolute top-4 right-4 z-20 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-1 shadow-md">
                    <LanguageSwitcher />
                </div>

                {/* Left - Branding Panel */}
                <div className="hidden lg:flex lg:w-[30%] xl:w-[28%] flex-col items-center justify-center p-8 lg:p-10 text-center relative overflow-hidden border-r border-white/15 bg-gradient-to-br from-white/[0.12] via-white/[0.05] to-black/30 backdrop-blur-xl shrink-0">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <img src={logo} alt="NIRDC Logo" className="w-44 h-auto mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]" />
                    <h2 className="text-2xl font-bold text-white mb-3 tracking-tight drop-shadow-sm">{t('reviewerRegistration.brandingTitle')}</h2>
                    <p className="text-white/80 text-[0.95rem] max-w-xs leading-relaxed font-body font-light">
                        {t('reviewerRegistration.brandingDesc')}
                    </p>
                </div>

                {/* Right - Form Panel */}
                <div
                    className="w-full lg:w-[70%] xl:w-[72%] flex flex-col p-6 sm:p-8 lg:p-10 relative overflow-y-auto h-full"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
                    }}
                >
                    <div className="w-full h-full flex flex-col">
                        <div className="text-center lg:text-left mb-6 shrink-0 pr-16">
                            <img src={logo} alt="NIRDC Logo" className="w-32 h-auto mx-auto mb-6 lg:hidden drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]" />
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-white font-sans tracking-tight mb-2 drop-shadow-sm">
                                {t('reviewerRegistration.title')}
                            </h1>
                            <p className="text-white/70 font-body text-sm font-light">
                                {t('reviewerRegistration.subtitle')}
                            </p>
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-3">
                            {/* Step 1: Who is a Reviewer */}
                            <Accordion
                                expanded={expanded === "panel1"}
                                onChange={handleAccordionChange("panel1", true)}
                                className="!shadow-none !bg-transparent before:hidden"
                                sx={glassAccordionSx}
                            >
                                <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />}>
                                    <div className="flex items-center gap-3">
                                        {steps.whoIsReviewer ? <CheckCircle className="text-emerald-400" /> : <div className="w-6 h-6 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-xs font-bold text-white">1</div>}
                                        <Typography fontWeight="bold" sx={{ color: '#ffffff' }}>{t('reviewerRegistration.step1Title')}</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ReviewerIntro completed={steps.whoIsReviewer} onComplete={async () => {
                                        if (await markStepCompleted("whoIsReviewer")) setExpanded("panel2");
                                    }} />
                                </AccordionDetails>
                            </Accordion>

                            {/* Step 2: Qualifications */}
                            <Accordion
                                expanded={expanded === "panel2"}
                                onChange={handleAccordionChange("panel2", isStep2Unlocked)}
                                disabled={!isStep2Unlocked}
                                className="!shadow-none !bg-transparent before:hidden"
                                sx={glassAccordionSx}
                            >
                                <AccordionSummary expandIcon={!isStep2Unlocked ? <Lock fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.4)' }} /> : <ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />}>
                                    <div className="flex items-center gap-3">
                                        {steps.qualifications ? <CheckCircle className="text-emerald-400" /> : <div className="w-6 h-6 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-xs font-bold text-white">2</div>}
                                        <Typography fontWeight="bold" sx={{ color: !isStep2Unlocked ? 'rgba(255, 255, 255, 0.5)' : '#ffffff' }}>{t('reviewerRegistration.step2Title')}</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ReviewerQualifications completed={steps.qualifications} onComplete={async () => {
                                        if (await markStepCompleted("qualifications")) setExpanded("panel3");
                                    }} />
                                </AccordionDetails>
                            </Accordion>

                            {/* Step 3: Conditions */}
                            <Accordion
                                expanded={expanded === "panel3"}
                                onChange={handleAccordionChange("panel3", isStep3Unlocked)}
                                disabled={!isStep3Unlocked}
                                className="!shadow-none !bg-transparent before:hidden"
                                sx={glassAccordionSx}
                            >
                                <AccordionSummary expandIcon={!isStep3Unlocked ? <Lock fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.4)' }} /> : <ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />}>
                                    <div className="flex items-center gap-3">
                                        {steps.conditions ? <CheckCircle className="text-emerald-400" /> : <div className="w-6 h-6 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-xs font-bold text-white">3</div>}
                                        <Typography fontWeight="bold" sx={{ color: !isStep3Unlocked ? 'rgba(255, 255, 255, 0.5)' : '#ffffff' }}>{t('reviewerRegistration.step3Title')}</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ReviewerConditions completed={steps.conditions} onComplete={async () => {
                                        if (await markStepCompleted("conditions")) setExpanded("panel4");
                                    }} />
                                </AccordionDetails>
                            </Accordion>

                            {/* Step 4: Training Video */}
                            <Accordion
                                expanded={expanded === "panel4"}
                                onChange={handleAccordionChange("panel4", isStep4Unlocked)}
                                disabled={!isStep4Unlocked}
                                className="!shadow-none !bg-transparent before:hidden"
                                sx={glassAccordionSx}
                            >
                                <AccordionSummary expandIcon={!isStep4Unlocked ? <Lock fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.4)' }} /> : <ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />}>
                                    <div className="flex items-center gap-3">
                                        {steps.trainingVideo ? <CheckCircle className="text-emerald-400" /> : <div className="w-6 h-6 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-xs font-bold text-white">4</div>}
                                        <Typography fontWeight="bold" sx={{ color: !isStep4Unlocked ? 'rgba(255, 255, 255, 0.5)' : '#ffffff' }}>{t('reviewerRegistration.step4Title')}</Typography>
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
                            <Accordion
                                expanded={expanded === "panel5"}
                                onChange={handleAccordionChange("panel5", isStep5Unlocked)}
                                disabled={!isStep5Unlocked}
                                className="!shadow-none !bg-transparent before:hidden"
                                sx={glassAccordionSx}
                            >
                                <AccordionSummary expandIcon={!isStep5Unlocked ? <Lock fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.4)' }} /> : <ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />}>
                                    <div className="flex items-center gap-3">
                                        {steps.mcq ? <CheckCircle className="text-emerald-400" /> : <div className="w-6 h-6 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-xs font-bold text-white">5</div>}
                                        <Typography fontWeight="bold" sx={{ color: !isStep5Unlocked ? 'rgba(255, 255, 255, 0.5)' : '#ffffff' }}>{t('reviewerRegistration.step5Title')}</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ReviewerMCQ
                                        sessionId={sessionId}
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
                            <Accordion
                                expanded={expanded === "panel6"}
                                onChange={handleAccordionChange("panel6", isStep6Unlocked)}
                                disabled={!isStep6Unlocked}
                                className="!shadow-none !bg-transparent before:hidden"
                                sx={glassAccordionSx}
                            >
                                <AccordionSummary expandIcon={!isStep6Unlocked ? <Lock fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.4)' }} /> : <ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />}>
                                    <div className="flex items-center gap-3">
                                        {steps.nda ? <CheckCircle className="text-emerald-400" /> : <div className="w-6 h-6 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-xs font-bold text-white">6</div>}
                                        <Typography fontWeight="bold" sx={{ color: !isStep6Unlocked ? 'rgba(255, 255, 255, 0.5)' : '#ffffff' }}>{t('reviewerRegistration.step6Title')}</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ReviewerNDA
                                        completed={steps.nda}
                                        onComplete={async () => {
                                            if (await markStepCompleted("nda")) setExpanded("panel7");
                                        }}
                                    />
                                </AccordionDetails>
                            </Accordion>

                            {/* Step 7: Personal Details & CV */}
                            <Accordion
                                expanded={expanded === "panel7"}
                                onChange={handleAccordionChange("panel7", isStep7Unlocked)}
                                disabled={!isStep7Unlocked}
                                className="!shadow-none !bg-transparent before:hidden"
                                sx={glassAccordionSx}
                            >
                                <AccordionSummary expandIcon={!isStep7Unlocked ? <Lock fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.4)' }} /> : <ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />}>
                                    <div className="flex items-center gap-3">
                                        {(formData && cvFile) ? <CheckCircle className="text-emerald-400" /> : <div className="w-6 h-6 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-xs font-bold text-white">7</div>}
                                        <Typography fontWeight="bold" sx={{ color: !isStep7Unlocked ? 'rgba(255, 255, 255, 0.5)' : '#ffffff' }}>{t('reviewerRegistration.step7Title')}</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-lg text-pink-300 mb-4">{t('reviewerRegistration.personalDetails.heading')}</h3>
                                        <ReviewerForm
                                            initialData={formData}
                                            isLoading={isLoading}
                                            onComplete={(data) => {
                                                setFormData(data);
                                                submitFullRegistration(data);
                                            }}
                                            cvUploadComponent={
                                                <div className="mt-8 border-t border-white/15 pt-6">
                                                    <h3 className="font-semibold text-lg text-pink-300 mb-4">{t('reviewerRegistration.personalDetails.cvHeading')}</h3>
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
                                className="text-white/80 hover:text-white font-medium text-[0.85rem] transition-colors"
                            >
                                {t('reviewerRegistration.alreadyHaveAccount')}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ReviewerRegistrationScreen;

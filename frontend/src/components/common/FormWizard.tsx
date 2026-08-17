import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, AlertTriangle, Info, X } from 'lucide-react';
import FormStepIndicator, { StepInfo } from './FormStepIndicator';

interface FormWizardStep extends StepInfo {
    content: React.ReactNode;
    validate?: () => string[]; // returns array of error messages, empty = valid
}

interface FormWizardProps {
    title: string;
    steps: FormWizardStep[];
    onSubmit: () => void;
    isSubmitting?: boolean;
    guidelinesUrl?: string;
    noteContent?: React.ReactNode;
}

const FormWizard: React.FC<FormWizardProps> = ({
    title,
    steps,
    onSubmit,
    isSubmitting = false,
    guidelinesUrl,
    noteContent,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
    const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);
    const [showExpirationAlert, setShowExpirationAlert] = useState(true);

    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;

    const markVisited = (stepIndex: number) => {
        if (!visitedSteps.includes(stepIndex)) {
            setVisitedSteps((prev) => [...prev, stepIndex]);
        }
    };

    const checkAndMarkComplete = (stepIndex: number) => {
        const step = steps[stepIndex];
        if (step.validate) {
            const errors = step.validate();
            if (errors.length === 0 && !completedSteps.includes(stepIndex)) {
                setCompletedSteps((prev) => [...prev, stepIndex]);
            } else if (errors.length > 0) {
                setCompletedSteps((prev) => prev.filter((s) => s !== stepIndex));
            }
        } else {
            // No validation = auto-complete
            if (!completedSteps.includes(stepIndex)) {
                setCompletedSteps((prev) => [...prev, stepIndex]);
            }
        }
    };

    const navigateToStep = (targetStep: number) => {
        // Check current step and show warnings (but don't block)
        const step = steps[currentStep];
        if (step.validate) {
            const errors = step.validate();
            if (errors.length > 0) {
                setValidationWarnings(errors);
            } else {
                setValidationWarnings([]);
            }
        } else {
            setValidationWarnings([]);
        }

        // Mark current step completion status
        checkAndMarkComplete(currentStep);

        // Navigate
        setCurrentStep(targetStep);
        markVisited(targetStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNext = () => {
        if (!isLastStep) {
            navigateToStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (!isFirstStep) {
            navigateToStep(currentStep - 1);
        }
    };

    const handleStepClick = (stepIndex: number) => {
        if (stepIndex !== currentStep) {
            navigateToStep(stepIndex);
        }
    };

    const handleSubmitClick = () => {
        // Collect ALL validation errors from ALL steps
        const allErrors: { step: string; errors: string[] }[] = [];

        steps.forEach((step) => {
            if (step.validate) {
                const errors = step.validate();
                if (errors.length > 0) {
                    allErrors.push({ step: step.label, errors });
                }
            }
        });

        if (allErrors.length > 0) {
            // Show all errors grouped by step
            const flatErrors = allErrors.flatMap(
                (group) => group.errors.map((e) => `${group.step}: ${e}`)
            );
            setValidationWarnings(flatErrors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setValidationWarnings([]);
        onSubmit();
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4">
            <div className="w-full max-w-5xl mx-auto">
                {/* Guidelines Button */}
                {guidelinesUrl && (
                    <div className="flex justify-center mb-6">
                        <button
                            type="button"
                            onClick={() => window.open(guidelinesUrl, '_blank', 'noopener noreferrer')}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-[#003893] border-2 border-[#003893]/20 hover:bg-[#003893] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            Read Guidelines Before You Start
                        </button>
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div
                        className="px-8 py-5 text-white text-xl font-bold"
                        style={{ background: 'linear-gradient(135deg, #003893 0%, #2E86C1 100%)' }}
                    >
                        {title}
                    </div>

                    {/* Step Indicator — clickable */}
                    <div className="bg-gray-50/50 border-b border-gray-100">
                        <FormStepIndicator
                            steps={steps}
                            currentStep={currentStep}
                            completedSteps={completedSteps}
                            onStepClick={handleStepClick}
                        />
                    </div>

                    {/* Validation Warnings (non-blocking) */}
                    {validationWarnings.length > 0 && (
                        <div className="mx-8 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={16} className="text-amber-600" />
                                <p className="text-sm font-semibold text-amber-700">Incomplete fields:</p>
                            </div>
                            <ul className="list-disc ml-5 text-sm text-amber-600 space-y-1">
                                {validationWarnings.map((warning, i) => (
                                    <li key={i}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Step Content */}
                    <div className="p-8">
                        {/* Step Title */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#2E86C1] uppercase tracking-wider mb-1">
                                Step {currentStep + 1} of {steps.length}
                            </div>
                            <h2 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>
                                {steps[currentStep].label}
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="space-y-6 text-gray-900">
                            {steps[currentStep].content}
                        </div>
                    </div>

                    {/* Note (only on last step) */}
                    {isLastStep && noteContent && (
                        <div className="mx-8 mb-6 bg-blue-50 border-l-4 border-[#003893] p-4 rounded-r-xl">
                            {noteContent}
                        </div>
                    )}

                    {/* Navigation Footer */}
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={isFirstStep}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                isFirstStep
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        >
                            <ChevronLeft size={18} />
                            Back
                        </button>

                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            {currentStep + 1} / {steps.length}
                        </div>

                        {isLastStep ? (
                            <button
                                type="button"
                                onClick={handleSubmitClick}
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ background: 'linear-gradient(135deg, #003893, #2E86C1)' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Submit Application
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                                style={{ background: 'linear-gradient(135deg, #003893, #2E86C1)' }}
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Expiration Alert */}
            {showExpirationAlert && (
                <div className="fixed top-24 right-8 z-50 max-w-sm bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-[#003893]/10 p-2.5 rounded-full text-[#003893] shrink-0">
                            <Info size={20} />
                        </div>
                        <div className="flex-1 pt-0.5">
                            <h4 className="text-sm font-bold text-[#1a1a2e]">Draft Auto-Saved</h4>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                Your progress is saved securely on this device for <strong>14 days</strong>. You can safely close this page and resume later.
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowExpirationAlert(false)}
                            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
                            aria-label="Dismiss notification"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormWizard;

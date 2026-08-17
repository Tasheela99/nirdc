import React from 'react';
import { Check } from 'lucide-react';

export interface StepInfo {
    label: string;
    icon?: React.ReactNode;
}

interface FormStepIndicatorProps {
    steps: StepInfo[];
    currentStep: number;
    completedSteps?: number[];
    onStepClick?: (stepIndex: number) => void;
}

const FormStepIndicator: React.FC<FormStepIndicatorProps> = ({ steps, currentStep, completedSteps = [], onStepClick }) => {
    return (
        <div className="w-full px-4 py-6">
            <div className="flex items-center justify-between relative">
                {/* Connecting line (background) */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ left: '10%', right: '10%' }} />

                {/* Progress line */}
                <div
                    className="absolute top-5 h-0.5 transition-all duration-500 ease-out"
                    style={{
                        left: '10%',
                        width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 80}%`,
                        background: 'linear-gradient(90deg, #003893, #2E86C1)',
                    }}
                />

                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(index) || index < currentStep;
                    const isActive = index === currentStep;
                    const isUpcoming = index > currentStep && !isCompleted;

                    return (
                        <div
                            key={index}
                            className={`flex flex-col items-center relative z-10 ${onStepClick ? 'cursor-pointer' : ''}`}
                            style={{ flex: 1 }}
                            onClick={() => onStepClick?.(index)}
                        >
                            {/* Circle */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
                                    isCompleted
                                        ? 'bg-gradient-to-br from-[#003893] to-[#2E86C1] text-white border-transparent shadow-md'
                                        : isActive
                                            ? 'bg-white text-[#003893] border-[#003893] shadow-lg ring-4 ring-[#003893]/10'
                                            : 'bg-white text-gray-400 border-gray-200'
                                }`}
                            >
                                {isCompleted ? <Check size={18} strokeWidth={3} /> : index + 1}
                            </div>

                            {/* Label */}
                            <span
                                className={`mt-2 text-xs font-medium text-center leading-tight max-w-[80px] transition-colors duration-300 ${
                                    isActive
                                        ? 'text-[#003893] font-semibold'
                                        : isCompleted
                                            ? 'text-[#2E86C1]'
                                            : isUpcoming
                                                ? 'text-gray-400'
                                                : 'text-gray-500'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FormStepIndicator;

import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';

const ResearchPlanSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <>
            <div className="mt-6">
                <label className="block text-main-color font-semibold text-lg mb-4">
                    8. Research Plan for Gap Filling
                    <p>(Your writeup should consider the following)</p>
                </label>

                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li className="font-medium">a. Background and introduction</li>
                    <li className="font-medium">b. Specific aims/actions</li>
                    <li className="font-medium">c. Methodologies</li>
                    <li className="font-medium">d. Timeline and milestones</li>
                    <li className="font-medium">e. Expected challenges and proposed alternative approaches</li>
                </ul>
            </div>

            <div className="mt-4">
                <label className="block text-main-color font-medium mb-2">
                    (Maximum 3500 characters)
                </label>
                <div className="space-y-4">
                    <div>
                        <textarea
                            name="researchPlan"
                            value={formData.researchPlan}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                            rows={4}
                            maxLength={3500}
                            placeholder="Research Plan"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResearchPlanSection;

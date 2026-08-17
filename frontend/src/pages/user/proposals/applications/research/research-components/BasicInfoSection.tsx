import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';

const BasicInfoSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <>
            {/* Title */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    1. Title of the Research Project
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                    placeholder="Enter project title"
                />
            </div>

            {/* Research Gaps */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    2. Research gap(s) identified for your project
                    <p>(1-3 gaps, not exceeding 400 characters in total)</p>
                </label>
                <textarea
                    name="researchGaps"
                    value={formData.researchGaps}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                    rows={3}
                    maxLength={400}
                    placeholder="Describe the research gaps"
                />
            </div>

            {/* Objectives */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    3. Objectives - proposed solutions/interventions to address those identified gaps
                    <p>(1-5 objectives not exceeding 1250 characters in total)</p>
                </label>
                <textarea
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                    rows={4}
                    maxLength={1250}
                    placeholder="Describe the objectives"
                />
            </div>
        </>
    );
};

export default BasicInfoSection;

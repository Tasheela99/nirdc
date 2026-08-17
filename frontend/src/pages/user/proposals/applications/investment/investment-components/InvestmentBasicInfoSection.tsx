import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';

const InvestmentBasicInfoSection: React.FC<InvestmentFormSectionProps> = ({ formData, handleChange }) => {
    return (
        <>
            {/* Title of the Project */}
            <div>
                <label className="block text-main-color font-medium mb-2">1. Title of the Project:</label>
                <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                    placeholder="Enter project title"
                    required
                />
            </div>

            {/* Investment Objectives */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    2. Investment Objectives (1-5 objectives, not exceeding 800 characters):
                </label>
                <textarea
                    name="investmentObjectives"
                    value={formData.investmentObjectives}
                    onChange={handleChange}
                    rows={4}
                    maxLength={3000}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                    placeholder="Describe the investment objectives"
                />
            </div>

            {/* Market Demand */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    3. Market Demand (not exceeding 800 characters):
                </label>
                <textarea
                    name="marketDemand"
                    value={formData.marketDemand}
                    onChange={handleChange}
                    rows={4}
                    maxLength={3000}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                    placeholder="Describe the market demand"
                />
            </div>
        </>
    );
};

export default InvestmentBasicInfoSection;

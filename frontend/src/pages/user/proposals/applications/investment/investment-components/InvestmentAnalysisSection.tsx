import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';

const InvestmentAnalysisSection: React.FC<InvestmentFormSectionProps> = ({ formData, handleChange }) => {
    return (
        <>
            {/* Total Project Investment */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    8. Total project investment (please indicate the source of funding and whether the value you
                    mentioned is in USD or LKR)
                </label>
                <textarea
                    name="totalInvestment"
                    value={formData.totalInvestment}
                    onChange={handleChange}
                    rows={3}
                    maxLength={3000}
                    placeholder="Enter total investment"
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                />
            </div>

            {/* Expected ROI */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    9. Expected return on investment (forecast should be provided - IRR, NPV, Payback Period,
                    Cost-Benefit Ratio, etc.)
                </label>
                <textarea
                    name="roi"
                    value={formData.roi}
                    onChange={handleChange}
                    rows={3}
                    maxLength={3000}
                    placeholder="Describe expected ROI"
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                />
            </div>

            {/* Resources & Collaborations */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    10. Resources & collaborations, if any (local/international)
                </label>
                <textarea
                    name="resourcesCollaborations"
                    value={formData.resourcesCollaborations}
                    onChange={handleChange}
                    rows={2}
                    maxLength={3000}
                    placeholder="List resources & collaborations"
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                />
            </div>

            {/* Risk and Assumptions */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    11. Risk and assumptions, and contingency plan
                </label>
                <textarea
                    name="riskAssumptions"
                    value={formData.riskAssumptions}
                    onChange={handleChange}
                    rows={3}
                    maxLength={3000}
                    placeholder="Describe risks and contingency plan"
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                />
            </div>
        </>
    );
};

export default InvestmentAnalysisSection;

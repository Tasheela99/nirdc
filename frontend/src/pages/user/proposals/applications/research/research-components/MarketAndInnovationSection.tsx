import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';

const MarketAndInnovationSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <>
            {/* Market Demand */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    5. Market Demand
                </label>
                <textarea
                    name="marketDemand"
                    value={formData.marketDemand}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                    rows={2}
                    maxLength={400}
                    placeholder="Describe market demand"
                />
            </div>

            {/* Innovation */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    6. Innovation/Novelty
                    <p>(including scientific and technical explanation, not exceeding 400 characters)</p>
                </label>
                <textarea
                    name="innovation"
                    value={formData.innovation}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                    rows={3}
                    maxLength={400}
                    placeholder="Describe innovation"
                />
            </div>
        </>
    );
};

export default MarketAndInnovationSection;

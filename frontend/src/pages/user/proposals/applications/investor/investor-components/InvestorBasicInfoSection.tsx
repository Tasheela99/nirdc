import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";

const InvestorBasicInfoSection: React.FC<InvestorFormProps> = ({ formData, handleChange }) => {
    return (
        <>
            {/* 1. Investment Objectives */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    1. Investment objectives (1-5 objectives not exceeding 1250 characters)
                </label>
                <textarea
                    name="investmentObjectives"
                    value={formData.investmentObjectives}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2 "
                    rows={4}
                    maxLength={1250}
                    placeholder="Describe your investment objectives"
                />
            </div>

            {/* 2. Market Demand */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    2. Market demand (not exceeding 1250 characters)
                </label>
                <textarea
                    name="marketDemand"
                    value={formData.marketDemand}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2 "
                    rows={4}
                    maxLength={1250}
                    placeholder="Describe the market demand"
                />
            </div>
        </>
    );
};

export default InvestorBasicInfoSection;

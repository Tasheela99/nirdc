import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";

const InvestorAnalysisSection: React.FC<InvestorFormProps> = ({ formData, handleChange }) => {
    return (
        <>
            {/* 4. Total Project Investment */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    4. Total project investment (please indicate the source of funding and whether the value you
                    mentioned is in USD or LKR)
                </label>
                <textarea
                    name="totalInvestment"
                    value={formData.totalInvestment}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2 "
                    rows={3}
                    maxLength={800}
                    placeholder="Describe total project investment including source of funding and currency"
                />
            </div>

            {/* 5. Expected return on investment */}
            <div>
                <label className="block text-main-color font-medium mb-2">
                    5. Expected return on investment
                    <p>(forecast should be provided - IRR, NPV, Payback Period, Cost-Benefit Ratio, etc.)</p>
                </label>
                <textarea
                    name="expectedROI"
                    value={formData.expectedROI}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2 "
                    rows={3}
                    maxLength={800}
                    placeholder="Provide detailed forecast including IRR, NPV, Payback Period, Cost-Benefit Ratio, etc."
                />
            </div>

            {/* 8. Risk and assumptions
            <div>
                <label className="block text-main-color font-medium mb-2">
                    8. Risk and assumptions, and contingency plan, if applicable
                    <p>(not exceeding 1250 characters)</p>
                </label>
                <textarea
                    name="riskAssumptions"
                    value={formData.riskAssumptions}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2 "
                    rows={3}
                    maxLength={1250}
                    placeholder="Describe risks, assumptions, and contingency plans"
                />
            </div> */}
        </>
    );
};

export default InvestorAnalysisSection;

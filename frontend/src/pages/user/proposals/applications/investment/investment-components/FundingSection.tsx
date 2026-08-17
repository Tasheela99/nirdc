import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';

const FundingSection: React.FC<InvestmentFormSectionProps> = ({ formData, handleChange }) => {
    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d+(\.\d*)?$/.test(value) || /^\.\d+$/.test(value)) {
            handleChange(e);
        }
    };

    if (!formData.requiredAssistanceFromGovernment.funds) {
        return null;
    }


    return (
        <div>
            <label className="block text-main-color font-medium mb-2">
                5. If gap-filling funding is needed (If you selected (4.a) "Funds" above)
            </label>
            <fieldset className="border border-gray-300 rounded-lg p-4">
                <legend className="text-main-color font-semibold"></legend>

                <div className="mt-4">
                    <label className="block font-medium text-main-color">
                        a. Research gap(s) identified for your project (1-3 gaps, not exceeding 800 characters in total)
                    </label>
                    <textarea
                        name="researchGaps"
                        value={formData.researchGaps}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                        rows={3}
                        maxLength={3000}
                        placeholder="Research gap(s)"
                    />
                </div>

                <div className="mt-4">
                    <label className="block font-medium text-main-color">
                        b. Research objectives - proposed solutions/interventions to address those identified gaps (1-5 objectives)
                    </label>
                    <textarea
                        name="researchObjectives"
                        value={formData.researchObjectives}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                        rows={3}
                        maxLength={3500}
                        placeholder="Proposed solutions"
                    />
                </div>

                <div className="mt-4">
                    <label className="block font-medium text-main-color">
                        c. Research plan for gap filling (Describe your plan based on following topics)
                    </label>
                    <ul className="list-disc py-4 pl-5 space-y-1 text-gray-700">
                        <li className="font-medium">a. Background and introduction</li>
                        <li className="font-medium">b. Specific aims/actions</li>
                        <li className="font-medium">c. Methodologies</li>
                        <li className="font-medium">d. Timeline and milestones</li>
                        <li className="font-medium">e. Expected challenges and proposed alternative approaches</li>
                    </ul>
                    <textarea
                        name="researchPlan"
                        value={formData.researchPlan}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                        rows={3}
                        maxLength={3000}
                        placeholder="Research plan"
                    />
                </div>

                <fieldset className="border border-gray-300 rounded-lg p-4">
                    <legend className="text-main-color font-semibold">d. Total Project Cost</legend>

                    {/* Currency Selection */}
                    <div className="mt-4">
                        <label className="block text-main-color font-medium mb-2">
                            1. Total project cost
                        </label>
                        <div className="flex items-center space-x-4">
                            <select
                                name="currencyValue"
                                value={formData.currencyValue}
                                onChange={handleChange}
                                className="w-1/3 border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                            >
                                <option value="">Select Currency</option>
                                <option value="USD">USD</option>
                                <option value="LKR">LKR</option>
                            </select>

                            <input
                                type="text"
                                name="projectCost"
                                value={formData.projectCost}
                                onChange={handleNumericChange}
                                className="w-2/3 border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>

                    {/* Total Expenditure */}
                    <div className="mt-4">
                        <label className="block text-main-color font-medium mb-2">
                            2. Total Expenditure to Date
                        </label>
                        <input
                            type="text"
                            name="expenditure"
                            value={formData.expenditure}
                            onChange={handleNumericChange}
                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                            placeholder="Enter total expenditure"
                        />
                    </div>

                    {/* Budget for Gap Filling */}
                    <div className="mt-4">
                        <label className="block text-main-color font-medium mb-2">
                            3. Expected TOTAL Budget for Gap Filling Research
                        </label>
                        <input
                            type="text"
                            name="budget"
                            value={formData.budget}
                            onChange={handleNumericChange}
                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                            placeholder="Enter total"
                        />
                    </div>

                    {/* Milestone Budget */}
                    <div className="mt-4">
                        <label className="block text-main-color font-medium mb-2">
                            4. Budget needed to achieve each milestone described in 5.d
                        </label>
                        <textarea
                            name="milestone_budget"
                            value={formData.milestone_budget}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                            rows={4}
                            maxLength={3000}
                            placeholder="Describe budget allocation for each milestone"
                        />
                    </div>
                </fieldset>

                <div className="mt-4">
                    <label className="block font-medium text-main-color">
                        e. Place(s) where the research is to be conducted
                    </label>
                    <textarea
                        name="researchPlace"
                        value={formData.researchPlace}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                        rows={1}
                        maxLength={3000}
                        placeholder="e.g: University, research institute, private company, etc."
                    />
                </div>
            </fieldset>
        </div>
    );
};

export default FundingSection;

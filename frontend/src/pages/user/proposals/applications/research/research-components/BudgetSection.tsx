import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';

const BudgetSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d+(\.\d*)?$/.test(value) || /^\.\d+$/.test(value)) {
            handleChange(e);
        }
    };

    return (
        <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend className="text-main-color font-semibold">9. Total Project Cost</legend>

            {/* Currency Selection */}
            <div className="mt-4">
                <label className="block text-main-color font-medium mb-2">
                    a. Total project cost
                </label>
                <div className="flex items-center space-x-4">
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-1/3 border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                    >
                        <option value="">Select Currency</option>
                        <option value="USD">USD</option>
                        <option value="LKR">LKR</option>
                    </select>

                    <input
                        type="text"
                        name="currencyValue"
                        value={formData.currencyValue}
                        onChange={handleNumericChange}
                        className="w-2/3 border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                        placeholder="Enter amount"
                    />
                </div>
            </div>

            {/* Total Expenditure */}
            <div className="mt-4">
                <label className="block text-main-color font-medium mb-2">
                    b. Total Expenditure to Date
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
                    c. Expected TOTAL Budget for Gap Filling Research
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
                    d. Budget needed to achieve each milestone described in 8d
                </label>
                <textarea
                    name="milestone_budget"
                    value={formData.milestone_budget}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                    rows={4}
                    maxLength={400}
                    placeholder="Describe budget allocation for each milestone"
                />
            </div>
        </fieldset>
    );
};

export default BudgetSection;

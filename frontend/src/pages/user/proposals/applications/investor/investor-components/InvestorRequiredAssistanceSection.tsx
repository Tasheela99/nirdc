import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";

const InvestorRequiredAssistanceSection: React.FC<InvestorFormProps> = ({ formData, handleChange }) => {
  // Check if at least one main checkbox is selected
  const mainOptions = [
    formData.requiredAssistanceFromGovernment.regulatory,
    formData.requiredAssistanceFromGovernment.land,
    formData.requiredAssistanceFromGovernment.infrastructure,
    formData.requiredAssistanceFromGovernment.technicalAssistance,
    formData.requiredAssistanceFromGovernment.partnerships,
    formData.requiredAssistanceFromGovernment.ip
  ];
  const noneSelected = !mainOptions.some(Boolean);
  return (
    <div>
      <fieldset className="border border-gray-300 rounded-lg p-4 mt-4">
        <legend className="text-main-color font-semibold mb-2">
          7. Required assistance from the government: <span className="text-red-500">*</span>
        </legend>
        <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="requiredAssistanceFromGovernment.regulatory"
            checked={formData.requiredAssistanceFromGovernment.regulatory}
            onChange={handleChange}
            className="mr-2"
          />
          Regulatory Approvals
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="requiredAssistanceFromGovernment.land"
            checked={formData.requiredAssistanceFromGovernment.land}
            onChange={handleChange}
            className="mr-2"
          />
          Land
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="requiredAssistanceFromGovernment.infrastructure"
            checked={formData.requiredAssistanceFromGovernment.infrastructure}
            onChange={handleChange}
            className="mr-2"
          />
          Access to Infrastructure/Equipment
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="requiredAssistanceFromGovernment.technicalAssistance"
            checked={formData.requiredAssistanceFromGovernment.technicalAssistance}
            onChange={handleChange}
            className="mr-2"
          />
          Technical Assistance
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="requiredAssistanceFromGovernment.partnerships"
            checked={formData.requiredAssistanceFromGovernment.partnerships}
            onChange={handleChange}
            className="mr-2"
          />
          Industry Partnerships
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="requiredAssistanceFromGovernment.ip"
            checked={formData.requiredAssistanceFromGovernment.ip}
            onChange={handleChange}
            className="mr-2"
          />
          IP/Patent Applications
        </label>
        <label className="flex flex-col mt-2">
          <span>Other (please specify)</span>
          <input
            type="text"
            name="requiredAssistanceFromGovernment.other"
            value={formData.requiredAssistanceFromGovernment.other}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 mt-1"
            placeholder="Other assistance (optional)"
          />
        </label>
        {noneSelected && !formData.requiredAssistanceFromGovernment.other.trim() && (
          <div className="text-red-500 text-sm mt-2">Please select at least one required assistance option or specify 'Other'.</div>
        )}
      </div>
      
    </fieldset>
    {/* 8. Risk and assumptions */}
            <div className="mt-4">
                <label className="block text-main-color font-medium mb-2">
                    8. Risk and assumptions, and contingency plan, if applicable
                    <p>(not exceeding 1250 characters)</p>
                </label>
                <textarea
                    name="riskAssumptions"
                    value={formData.riskAssumptions}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2 "
                    rows={4}
                    maxLength={1250}
                    placeholder="Describe risks, assumptions, and contingency plans"
                />
            </div>
    </div>
  );
};

export default InvestorRequiredAssistanceSection;

import React from "react";
import { InvestmentFormSectionProps } from "../investment-types/InvestmentFormTypes";

const InvestmentRequiredAssistanceSection: React.FC<InvestmentFormSectionProps> = ({ formData, handleChange }) => {
  const mainOptions = [
    formData.requiredAssistanceFromGovernment.funds,
    formData.requiredAssistanceFromGovernment.regulatory,
    formData.requiredAssistanceFromGovernment.land,
    formData.requiredAssistanceFromGovernment.infrastructure,
    formData.requiredAssistanceFromGovernment.technicalAssistance,
    formData.requiredAssistanceFromGovernment.partnerships,
    formData.requiredAssistanceFromGovernment.ip
  ];
  const noneSelected = !mainOptions.some(Boolean);
  return (
    <fieldset className="border border-gray-300 rounded-lg p-4 mt-4">
      <legend className="text-main-color font-semibold mb-2">
        7. Required assistance from the government: <span className="text-red-500">*</span>
      </legend>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="requiredAssistanceFromGovernment.funds"
            checked={formData.requiredAssistanceFromGovernment.funds}
            onChange={handleChange}
            className="mr-2"
          />
          Funds
        </label>
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
  );
};

export default InvestmentRequiredAssistanceSection;

import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";

const InvestorResourcesSection: React.FC<InvestorFormProps> = ({ formData, handleChange }) => {
    return (
        <div>
            <legend className="text-main-color font-semibold">
                6. Existing resources & collaborations, if any
                <p>(local/international)</p>
            </legend>
            <div className="space-y-2 border border-gray-300 rounded-lg p-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="existingResources.local"
                        checked={formData.existingResources.local}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label className="text-gray-700">Local</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="existingResources.international"
                        checked={formData.existingResources.international}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label className="text-gray-700">International</label>
                </div>
            </div>
        </div>
    );
};

export default InvestorResourcesSection;

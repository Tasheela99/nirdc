import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';

const InvestmentSignificanceSection: React.FC<InvestmentFormSectionProps> = ({ formData, handleChange }) => {
    return (
        <div>
            <fieldset className="border border-gray-300 rounded-lg p-4">
                <legend className="text-main-color font-semibold">
                    6. Significance for the country and expected impact
                    <p>(please describe in all areas that applicable, not exceeding 800 characters in each
                        of the a-c categories)</p>
                </legend>
                
                {/* Economic Impact */}
                <div className="sub-section">
                    <label className="block text-main-color font-medium mb-2">a. Economic Impact:</label>

                    {/* Economic Impact Radio Group */}
                    <div className="radio-group flex flex-col gap-2 mb-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                id="export"
                                name="significance.economicImpact"
                                value="exportPotential"
                                checked={formData.significance?.economicImpact === "exportPotential"}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Export Potential
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                id="import"
                                name="significance.economicImpact"
                                value="importSubstitution"
                                checked={formData.significance.economicImpact === "importSubstitution"}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Import Substitution
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                id="other_economic"
                                name="significance.economicImpact"
                                value="other"
                                checked={formData.significance.economicImpact === "other"}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Other
                        </label>
                    </div>
                    <textarea
                        id="other_economic_details"
                        name="significance.other"
                        value={formData.significance.other}
                        onChange={handleChange}
                        className={`w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  ${
                            formData.significance.economicImpact === "other" ? "" : "opacity-50"
                        }`}
                        maxLength={3000}
                        placeholder="Specify other economic impact"
                        disabled={formData.significance.economicImpact !== "other"}
                    />
                </div>

                {/* Social Impact */}
                <div className="mt-4">
                    <label className="block text-main-color font-medium mb-2">b. Social Impact</label>
                    <textarea
                        name="significance.socialImpact"
                        value={formData.significance.socialImpact}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                        rows={2}
                        maxLength={3000}
                        placeholder="Describe social impact"
                    />
                </div>

                {/* Environmental Impact */}
                <div className="mt-4">
                    <label className="block text-main-color font-medium mb-2">c. Environmental Impact</label>
                    <textarea
                        name="significance.environmentalImpact"
                        value={formData.significance.environmentalImpact}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                        rows={2}
                        maxLength={3000}
                        placeholder="Describe environmental impact"
                    />
                </div>
            </fieldset>
        </div>
    );
};

export default InvestmentSignificanceSection;

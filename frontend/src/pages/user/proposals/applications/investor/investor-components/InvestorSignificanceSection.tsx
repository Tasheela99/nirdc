import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";

const InvestorSignificanceSection: React.FC<InvestorFormProps> = ({ formData, handleChange }) => {
    return (
        <div>
            <fieldset className="border border-gray-300 rounded-lg p-4">
                <legend className="text-main-color font-semibold">
                    3. Significance for the country and expected impact
                    <p>(please describe in all areas that applicable, not exceeding 800 characters in each
                        of the a-c categories)</p>
                </legend>
                
                {/* Economic Impact */}
                <div className="sub-section">
                    <label className="block text-main-color font-medium mb-2">a. Economic Impact:</label>

                    {/* Export Potential */}
                    <div className="radio-group flex items-center mb-2">
                        <input
                            type="radio"
                            id="export"
                            name="significance.economicImpactType"
                            value="exportPotential"
                            checked={formData.significance?.economicImpactType === "exportPotential"}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label htmlFor="export" className="checkbox-label">
                            Export Potential
                        </label>
                    </div>

                    {/* Import Substitution */}
                    <div className="radio-group flex items-center mb-2">
                        <input
                            type="radio"
                            id="import"
                            name="significance.economicImpactType"
                            value="importSubstitution"
                            checked={formData.significance.economicImpactType === "importSubstitution"}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label htmlFor="import" className="checkbox-label">
                            Import Substitution
                        </label>
                    </div>

                    {/* Other Economic Impact */}
                    <div className="radio-group">
                        <div className="flex items-center mb-2">
                            <input
                                type="radio"
                                id="other_economic"
                                name="significance.economicImpactType"
                                value="other"
                                checked={formData.significance.economicImpactType === "other"}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label htmlFor="other_economic" className="checkbox-label">
                                Other
                            </label>
                        </div>
                        <textarea
                            id="other_economic_details"
                            name="significance.other"
                            value={formData.significance.other}
                            onChange={handleChange}
                            className={`w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  ${
                                formData.significance.economicImpactType === "other" ? "" : "opacity-50"
                            }`}
                            maxLength={200}
                            placeholder="Specify other economic impact"
                            disabled={formData.significance.economicImpactType !== "other"}
                        />
                    </div>
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
                        maxLength={800}
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
                        maxLength={800}
                        placeholder="Describe environmental impact"
                    />
                </div>
            </fieldset>
        </div>
    );
};

export default InvestorSignificanceSection;

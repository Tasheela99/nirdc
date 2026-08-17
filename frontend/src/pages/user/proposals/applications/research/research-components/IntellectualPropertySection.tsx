import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';

const IntellectualPropertySection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <div>
            <fieldset className="border border-gray-300 rounded-lg p-4">
                <legend className="text-main-color font-semibold">
                    7. Current outputs
                    <p>(patents/technologies/prototypes/publications)</p>
                </legend>

                {/* IP Status */}
                <div className="mt-4">
                    <label className="block text-main-color font-medium mb-2">
                        a. Intellectual property status
                    </label>
                    <div className="flex flex-col space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="intellectualProperty.status"
                                value="Applied"
                                checked={formData.intellectualProperty.status === "Applied"}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Patent Applied
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="intellectualProperty.status"
                                value="Granted"
                                checked={formData.intellectualProperty.status === "Granted"}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Patent Granted
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="intellectualProperty.status"
                                value="None"
                                checked={formData.intellectualProperty.status === "None"}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            None
                        </label>
                    </div>
                </div>

                {/* Conditionally render fields */}
                {formData.intellectualProperty.status !== "None" && (
                    <>
                        {/* Patent Details */}
                        <div className="mt-4">
                            <label className="block text-main-color font-medium mb-2">b. Patent Number</label>
                            <input
                                type="text"
                                name="intellectualProperty.patentNumber"
                                value={formData.intellectualProperty.patentNumber}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                                placeholder="Enter patent number"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-main-color font-medium mb-2">c. Received Date</label>
                            <input
                                type="date"
                                name="intellectualProperty.receivedDate"
                                value={formData.intellectualProperty.receivedDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-main-color font-medium mb-2">
                                d. Local or International
                            </label>
                            <select
                                name="intellectualProperty.localOrInternational"
                                value={formData.intellectualProperty.localOrInternational}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                            >
                                <option value="">Select type</option>
                                <option value="Local">Local</option>
                                <option value="International">International</option>
                            </select>
                        </div>
                    </>
                )}

                {/* Technology Readiness Level */}
                <div className="mt-4">
                    <label className="block text-main-color font-medium mb-2">
                        e. Technology Readiness Level – TRL1-9
                        <p>(please refer to application guidelines)</p>
                    </label>
                    <select
                        name="technologyReadinessLevel"
                        value={formData.technologyReadinessLevel.replace("TRL ", "")}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                    >
                        <option value="">Select TRL</option>
                        {Array.from({length: 9}, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                TRL {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Publications */}
                <div className="mt-4">
                    <label className="block text-main-color font-medium mb-2">f. Publications</label>
                    <textarea
                        name="publications"
                        value={formData.publications}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                        rows={4}
                        maxLength={1250}
                        placeholder="List publications (SCI journal/other international or local publications/conference papers etc., not exceeding 1250 characters)"
                    />
                </div>
            </fieldset>
        </div>
    );
};

export default IntellectualPropertySection;

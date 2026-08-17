import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';

const LocationAndResourcesSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <>
            <div className="mt-4">
                <label className="block text-main-color font-medium mb-2" htmlFor="research_place">
                    10. Place(s) where the research is to be conducted
                </label>
                <input
                    type="text"
                    id="research_place"
                    name="research_place"
                    value={formData.research_place}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                    maxLength={100}
                    placeholder="e.g: University, research institute, private company"
                    required
                />
            </div>

            <div className="mt-4">
                <label className="block text-main-color font-medium mb-2" htmlFor="resources">
                    11. Existing resources & collaborations (local/international)
                </label>
                <textarea
                    id="resources"
                    name="resources"
                    value={formData.resources}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900  focus:outline-none focus:ring-2"
                    rows={4}
                    maxLength={1250}
                    placeholder="Describe existing resources and collaborations"
                />
            </div>
        </>
    );
};

export default LocationAndResourcesSection;

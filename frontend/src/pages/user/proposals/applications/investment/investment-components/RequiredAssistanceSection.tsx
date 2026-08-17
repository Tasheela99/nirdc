import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';

const assistanceOptions = [
    { name: "funds", label: "a. Funds" },
    { name: "regulatory", label: "b. Regulatory Approvals" },
    { name: "land", label: "c. Land" },
    { name: "infrastructure", label: "d. Access to Infrastructure/Equipment" },
    { name: "technicalAssistance", label: "e. Technical Assistance" },
    { name: "partnerships", label: "f. Industry Partnerships" },
    { name: "ip", label: "g. IP/Patent Applications" },
];

const RequiredAssistanceSection: React.FC<InvestmentFormSectionProps> = ({ formData, setFormData }) => {
    return (
        <div>
            <label className="block text-main-color font-medium mb-2">
                4. Required Assistance from the Government:
            </label>
            <div className="space-y-2">
                {assistanceOptions.map((option) => (
                    <div key={option.name} className="flex items-center">
                        <input
                            type="checkbox"
                            name={`requiredAssistanceFromGovernment.${option.name}`}
                            checked={!!formData.requiredAssistanceFromGovernment[option.name as keyof typeof formData.requiredAssistanceFromGovernment]}
                            onChange={e =>
                                setFormData((prev: any) => ({
                                    ...prev,
                                    requiredAssistanceFromGovernment: {
                                        ...prev.requiredAssistanceFromGovernment,
                                        [option.name]: e.target.checked,
                                    },
                                }))
                            }
                            className="mr-2"
                        />
                        <label>{option.label}</label>
                    </div>
                ))}
                <div className="mt-2">
                    <label className="block text-main-color font-medium mb-1">Other (please specify):</label>
                    <input
                        type="text"
                        name="requiredAssistanceFromGovernment.other"
                        value={formData.requiredAssistanceFromGovernment.other}
                        onChange={e =>
                            setFormData((prev: any) => ({
                                ...prev,
                                requiredAssistanceFromGovernment: {
                                    ...prev.requiredAssistanceFromGovernment,
                                    other: e.target.value,
                                },
                            }))
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-900 "
                        placeholder="Other assistance"
                    />
                </div>
            </div>
        </div>
    );
};

export default RequiredAssistanceSection;

import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';

const InvestmentFileUploadSection: React.FC<InvestmentFormSectionProps> = ({ formData, setFormData }) => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'certificationsDocuments' | 'extraCertificationsDocuments') => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const dt = new DataTransfer();
            
            // Add existing files if any
            if (formData[fieldName]) {
                Array.from(formData[fieldName]!).forEach(file => {
                    dt.items.add(file);
                });
            }
            
            // Add new files
            Array.from(files).forEach(file => {
                dt.items.add(file);
            });
            
            // Update form data with combined files
            setFormData(prev => ({
                ...prev,
                [fieldName]: dt.files
            }));
            
            // Reset the input to allow selecting the same file again
            e.target.value = '';
        }
    };

    const renderFileUploadComponent = (
        fieldName: 'certificationsDocuments' | 'extraCertificationsDocuments',
        label: string,
        questionNumber: string
    ) => (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-900  shadow-sm mb-6">
            <label className="block text-main-color font-semibold mb-4">
                {questionNumber}. {label} (50MB max)
            </label>
            <div className="flex flex-col items-center space-y-4">
                {/* File Input */}
                <div className="w-full">
                    <input
                        type="file"
                        name={fieldName}
                        multiple={true}
                        onChange={(e) => handleFileUpload(e, fieldName)}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id={`${fieldName}Upload`}
                    />
                    <label
                        htmlFor={`${fieldName}Upload`}
                        className="cursor-pointer inline-block bg-main-color text-white py-2 px-4 rounded-lg font-semibold hover:bg-main-color-light transition-colors"
                    >
                        Choose Files
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                        Accepted formats: PDF, DOC, DOCX (Max 5 files, 50MB each)
                    </p>
                </div>

                {/* File Preview */}
                {formData[fieldName] && formData[fieldName]!.length > 0 && (
                    <ul className="w-full bg-white border border-gray-200 rounded-lg p-4 text-gray-700 space-y-2">
                        {Array.from(formData[fieldName]!).map((file: File, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span className="truncate">{file.name}</span>
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-3">
                                        {file.size > 1024 * 1024 
                                            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
                                            : `${(file.size / 1024).toFixed(1)} KB`}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const dt = new DataTransfer();
                                            Array.from(formData[fieldName] || [])
                                                .filter((_, i) => i !== index)
                                                .forEach(f => dt.items.add(f));
                                            setFormData(prev => ({
                                                ...prev,
                                                [fieldName]: dt.files.length > 0 ? dt.files : null
                                            }));
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Clear Button */}
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, [fieldName]: null }))}
                    className="text-main-color font-semibold py-2 px-4 border border-main-color rounded-lg hover:bg-second-color hover:text-white transition-colors"
                >
                    Clear Files
                </button>
            </div>
        </div>
    );

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof FileList) {
            Array.from(value).forEach(file => formDataToSend.append(key, file));
        } else {
            formDataToSend.append(key, value);
        }
    });
    // Use formDataToSend in your fetch/axios POST request

    return (
        <div>
            {renderFileUploadComponent('certificationsDocuments', 'Attach supporting letters and recommendations', '12')}
            {renderFileUploadComponent('extraCertificationsDocuments', 'Attach your certifications and any other relevant documents', '13')}
        </div>
    );
};

export default InvestmentFileUploadSection;

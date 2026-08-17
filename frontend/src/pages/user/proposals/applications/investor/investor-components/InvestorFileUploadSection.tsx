import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";

const InvestorFileUploadSection: React.FC<InvestorFormProps> = ({ formData, setFormData }) => {
    return (
        
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-900  shadow-sm">
            

            <label className="block text-main-color font-semibold mb-4">
                9. Attach your certifications and any other relevant documents (50MB max)
            </label>
            <div className="flex flex-col items-center space-y-4">
                {/* File Input */}
                <div className="w-full">
                    <input
                        type="file"
                        name="documents"
                        multiple={true}
                        onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                                // Create a DataTransfer to combine existing and new files
                                const dt = new DataTransfer();
                                
                                // Add existing files if any
                                if (formData.documents) {
                                    Array.from(formData.documents).forEach(file => {
                                        dt.items.add(file);
                                    });
                                }
                                
                                // Add new files
                                Array.from(files).forEach(file => {
                                    dt.items.add(file);
                                });
                                
                                // Update form data with combined files
                                setFormData(prev => ({...prev, documents: dt.files}));
                                
                                // Reset the input to allow selecting the same file again
                                e.target.value = '';
                            }
                        }}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="fileUpload"
                    />
                    <label
                        htmlFor="fileUpload"
                        className="cursor-pointer inline-block bg-main-color text-white py-2 px-4 rounded-lg font-semibold hover:bg-main-color-light transition-colors"
                    >
                        Choose Files
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                        Accepted formats: PDF, DOC, DOCX (Max 5 files, 50MB each)
                    </p>
                </div>

                {/* File Preview */}
                {formData.documents && formData.documents.length > 0 && (
                    <ul className="w-full bg-white border border-gray-200 rounded-lg p-4 text-gray-700 space-y-2">
                        {Array.from(formData.documents).map((file, index) => (
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
                                            // Remove this specific file
                                            const dt = new DataTransfer();
                                            Array.from(formData.documents || [])
                                                .filter((_, i) => i !== index)
                                                .forEach(f => dt.items.add(f));
                                            setFormData(prev => ({...prev, documents: dt.files.length > 0 ? dt.files : null}));
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Clear Button */}
                <button
                    type="button"
                    onClick={() =>
                        setFormData((prev) => ({...prev, documents: null}))
                    }
                    className="text-main-color font-semibold py-2 px-4 border border-main-color rounded-lg hover:bg-second-color hover:text-white transition-colors"
                >
                    Clear Files
                </button>
            </div>
        </div>
    );
};

export default InvestorFileUploadSection;

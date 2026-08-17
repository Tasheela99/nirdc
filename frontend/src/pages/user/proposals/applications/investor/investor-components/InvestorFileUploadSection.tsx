import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";
import DragDropFileUpload from "../../../../../../components/common/DragDropFileUpload.tsx";

const InvestorFileUploadSection: React.FC<InvestorFormProps> = ({ formData, setFormData }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Document Upload</h2>
            <div className="mt-6">
                <label className="block text-main-color font-semibold mb-3">
                    9. Attach your certifications and any other relevant documents
                </label>
                <DragDropFileUpload 
                    fileList={formData.documents || null}
                    onChange={(files) => setFormData(prev => ({ ...prev, documents: files }))}
                    label="Click or drag to upload files"
                    accept=".pdf,.doc,.docx"
                    maxSizeMB={50}
                    maxFiles={5}
                />
            </div>
        </div>
    );
};

export default InvestorFileUploadSection;

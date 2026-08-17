import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';
import DragDropFileUpload from '../../../../../../components/common/DragDropFileUpload.tsx';

const InvestmentFileUploadSection: React.FC<InvestmentFormSectionProps> = ({ formData, setFormData }) => {

    const renderFileUploadComponent = (
        fieldName: 'certificationsDocuments' | 'extraCertificationsDocuments',
        label: string,
        questionNumber: string
    ) => (
        <div className="mt-6">
            <label className="block text-main-color font-semibold mb-3">
                {questionNumber}. {label}
            </label>
            <DragDropFileUpload 
                fileList={formData[fieldName]}
                onChange={(files) => setFormData(prev => ({ ...prev, [fieldName]: files }))}
                label="Click or drag to upload files"
                accept=".pdf,.doc,.docx"
                maxSizeMB={50}
                maxFiles={5}
            />
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Document Upload</h2>
            {renderFileUploadComponent('certificationsDocuments', 'Attach supporting letters and recommendations', '12')}
            <div className="my-8 h-px bg-gray-100 w-full"></div>
            {renderFileUploadComponent('extraCertificationsDocuments', 'Attach your certifications and any other relevant documents', '13')}
        </div>
    );
};

export default InvestmentFileUploadSection;

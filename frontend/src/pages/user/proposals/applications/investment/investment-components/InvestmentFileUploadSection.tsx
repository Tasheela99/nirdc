import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';
import DragDropFileUpload from '../../../../../../components/common/DragDropFileUpload.tsx';
import { Box, Typography } from '@mui/material';

const InvestmentFileUploadSection: React.FC<InvestmentFormSectionProps> = ({ formData, setFormData }) => {

    const renderFileUploadComponent = (
        fieldName: 'certificationsDocuments' | 'extraCertificationsDocuments',
        label: string,
        questionNumber: string
    ) => (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2, color: 'text.secondary' }}>
                {questionNumber}. {label}
            </Typography>
            <DragDropFileUpload 
                fileList={formData[fieldName]}
                onChange={(files) => setFormData(prev => ({ ...prev, [fieldName]: files }))}
                label="Click or drag to upload files"
                accept=".pdf,.doc,.docx"
                maxSizeMB={50}
                maxFiles={5}
            />
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            {renderFileUploadComponent('certificationsDocuments', 'Attach supporting letters and recommendations', '12')}
            {renderFileUploadComponent('extraCertificationsDocuments', 'Attach your certifications and any other relevant documents', '13')}
        </Box>
    );
};

export default InvestmentFileUploadSection;

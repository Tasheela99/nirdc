import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';
import DragDropFileUpload from '../../../../../../components/common/DragDropFileUpload.tsx';
import { Box, Typography } from '@mui/material';

const FileUploadSection: React.FC<FormSectionProps> = ({ formData, setFormData }) => {

    const renderFileUploadComponent = (
        fieldName: 'supportingDocuments' | 'certifications',
        label: string,
        questionNumber: string
    ) => (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
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
            {renderFileUploadComponent('supportingDocuments', 'Please attach supporting letters and recommendations', '12')}
            {renderFileUploadComponent('certifications', 'Please attach your certifications and any other relevant documents', '13')}
        </Box>
    );
};

export default FileUploadSection;


import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";
import DragDropFileUpload from "../../../../../../components/common/DragDropFileUpload.tsx";
import { Box, Typography } from '@mui/material';

const InvestorFileUploadSection: React.FC<InvestorFormProps> = ({ formData, setFormData }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2, color: 'text.secondary' }}>
                9. Attach your certifications and any other relevant documents
            </Typography>
            <DragDropFileUpload 
                fileList={formData.documents || null}
                onChange={(files) => setFormData(prev => ({ ...prev, documents: files }))}
                label="Click or drag to upload files"
                accept=".pdf,.doc,.docx"
                maxSizeMB={50}
                maxFiles={5}
            />
        </Box>
    );
};

export default InvestorFileUploadSection;

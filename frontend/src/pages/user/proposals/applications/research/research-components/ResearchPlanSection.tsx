import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';
import { Grid, TextField, Typography, Box } from '@mui/material';

const ResearchPlanSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                            8. Research Plan for Gap Filling
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#4b5563', mb: 1 }}>
                            (Your writeup should consider the following, max 3500 characters)
                        </Typography>
                        <ul className="list-disc pl-5 space-y-0.5 text-sm text-gray-700">
                            <li>a. Background and introduction</li>
                            <li>b. Specific aims/actions</li>
                            <li>c. Methodologies</li>
                            <li>d. Timeline and milestones</li>
                            <li>e. Expected challenges and proposed alternative approaches</li>
                        </ul>
                    </Box>
                    <TextField
                        fullWidth
                        name="researchPlan"
                        value={formData.researchPlan}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={8}
                        inputProps={{ maxLength: 3500 }}
                        helperText={`${formData.researchPlan?.length || 0}/3500 characters`}
                        placeholder="Research Plan"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ResearchPlanSection;


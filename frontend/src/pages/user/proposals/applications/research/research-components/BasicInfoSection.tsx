import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';
import { Grid, TextField, Box } from '@mui/material';

const BasicInfoSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="1. Title of the Research Project"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="Enter project title"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="2. Research gap(s) identified for your project (1-3 gaps, max 400 characters)"
                        name="researchGaps"
                        value={formData.researchGaps}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 400 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.researchGaps?.length || 0}/400 characters`}
                        placeholder="Describe the research gaps"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="3. Objectives - proposed solutions/interventions to address those identified gaps (max 1250 characters)"
                        name="objectives"
                        value={formData.objectives}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 1250 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.objectives?.length || 0}/1250 characters`}
                        placeholder="Describe the objectives"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default BasicInfoSection;


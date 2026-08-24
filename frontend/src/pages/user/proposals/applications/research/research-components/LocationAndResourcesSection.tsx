import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';
import { Grid, TextField, Box } from '@mui/material';

const LocationAndResourcesSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="10. Place(s) where the research is to be conducted"
                        name="research_place"
                        value={formData.research_place}
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="e.g: University, research institute, private company"
                        inputProps={{ maxLength: 100 }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="11. Existing resources & collaborations (local/international, max 1250 chars)"
                        name="resources"
                        value={formData.resources}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 1250 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.resources?.length || 0}/1250 characters`}
                        placeholder="Describe existing resources and collaborations"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default LocationAndResourcesSection;


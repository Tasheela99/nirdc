import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';
import { Grid, TextField, Box } from '@mui/material';

const MarketAndInnovationSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="5. Market Demand"
                        name="marketDemand"
                        value={formData.marketDemand}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 400 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.marketDemand?.length || 0}/400 characters`}
                        placeholder="Describe market demand"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="6. Innovation/Novelty (max 400 characters)"
                        name="innovation"
                        value={formData.innovation}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 400 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.innovation?.length || 0}/400 characters`}
                        placeholder="Describe innovation"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default MarketAndInnovationSection;


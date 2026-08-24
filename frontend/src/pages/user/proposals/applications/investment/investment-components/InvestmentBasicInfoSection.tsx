import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';
import { Grid, TextField, Box } from '@mui/material';

const InvestmentBasicInfoSection: React.FC<InvestmentFormSectionProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                {/* Title of the Project */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="1. Title of the Project"
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="Enter project title"
                        required
                    />
                </Grid>

                {/* Investment Objectives */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="2. Investment Objectives (1-5 objectives, not exceeding 800 characters)"
                        name="investmentObjectives"
                        value={formData.investmentObjectives}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 800 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.investmentObjectives?.length || 0}/800 characters`}
                        placeholder="Describe the investment objectives"
                    />
                </Grid>

                {/* Market Demand */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="3. Market Demand (not exceeding 800 characters)"
                        name="marketDemand"
                        value={formData.marketDemand}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 800 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.marketDemand?.length || 0}/800 characters`}
                        placeholder="Describe the market demand"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default InvestmentBasicInfoSection;

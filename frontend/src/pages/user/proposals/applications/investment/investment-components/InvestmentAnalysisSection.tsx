import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';
import { Grid, TextField, Box } from '@mui/material';

const InvestmentAnalysisSection: React.FC<InvestmentFormSectionProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                {/* Total Project Investment */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="8. Total project investment (indicate source of funding and currency USD/LKR)"
                        name="totalInvestment"
                        value={formData.totalInvestment}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 3000 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.totalInvestment?.length || 0}/3000 characters`}
                        placeholder="Enter total investment"
                    />
                </Grid>

                {/* Expected ROI */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="9. Expected return on investment (forecast should be provided - IRR, NPV, Payback Period, etc.)"
                        name="roi"
                        value={formData.roi}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 3000 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.roi?.length || 0}/3000 characters`}
                        placeholder="Describe expected ROI"
                    />
                </Grid>

                {/* Resources & Collaborations */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="10. Resources & collaborations, if any (local/international)"
                        name="resourcesCollaborations"
                        value={formData.resourcesCollaborations}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 3000 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.resourcesCollaborations?.length || 0}/3000 characters`}
                        placeholder="List resources & collaborations"
                    />
                </Grid>

                {/* Risk and Assumptions */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="11. Risk and assumptions, and contingency plan"
                        name="riskAssumptions"
                        value={formData.riskAssumptions}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 3000 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.riskAssumptions?.length || 0}/3000 characters`}
                        placeholder="Describe risks and contingency plan"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default InvestmentAnalysisSection;

import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";
import { Grid, TextField, Box } from '@mui/material';

const InvestorBasicInfoSection: React.FC<InvestorFormProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="1. Investment objectives (1-5 objectives not exceeding 1250 characters)"
                        name="investmentObjectives"
                        value={formData.investmentObjectives}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 1250 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.investmentObjectives?.length || 0}/1250 characters`}
                        placeholder="Describe your investment objectives"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="2. Market demand (not exceeding 1250 characters)"
                        name="marketDemand"
                        value={formData.marketDemand}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 1250 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.marketDemand?.length || 0}/1250 characters`}
                        placeholder="Describe the market demand"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default InvestorBasicInfoSection;

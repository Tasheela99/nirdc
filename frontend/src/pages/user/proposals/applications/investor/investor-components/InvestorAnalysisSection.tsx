import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";
import { Grid, TextField, Box } from '@mui/material';

const InvestorAnalysisSection: React.FC<InvestorFormProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                {/* 4. Total Project Investment */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="4. Total project investment (indicate source of funding and currency USD/LKR)"
                        name="totalInvestment"
                        value={formData.totalInvestment}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 800 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.totalInvestment?.length || 0}/800 characters`}
                        placeholder="Describe total project investment including source of funding and currency"
                    />
                </Grid>

                {/* 5. Expected return on investment */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="5. Expected return on investment (forecast should be provided - IRR, NPV, Payback Period, etc.)"
                        name="expectedROI"
                        value={formData.expectedROI}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 800 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.expectedROI?.length || 0}/800 characters`}
                        placeholder="Provide detailed forecast including IRR, NPV, Payback Period, Cost-Benefit Ratio, etc."
                    />
                </Grid>

                {/* 8. Risk and assumptions
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="8. Risk and assumptions, and contingency plan, if applicable (not exceeding 1250 characters)"
                        name="riskAssumptions"
                        value={formData.riskAssumptions}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 1250 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.riskAssumptions?.length || 0}/1250 characters`}
                        placeholder="Describe risks, assumptions, and contingency plans"
                    />
                </Grid>
                */}
            </Grid>
        </Box>
    );
};

export default InvestorAnalysisSection;

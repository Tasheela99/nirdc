import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

const BudgetSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d+(\.\d*)?$/.test(value) || /^\.\d+$/.test(value)) {
            handleChange(e);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }}>
                9. Total Project Cost
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel shrink>a. Currency</InputLabel>
                        <Select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange as any}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="LKR">LKR</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Total Project Cost"
                        name="currencyValue"
                        value={formData.currencyValue}
                        onChange={handleNumericChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="0.00"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="b. Total Expenditure to Date"
                        name="expenditure"
                        value={formData.expenditure}
                        onChange={handleNumericChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="0.00"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="c. Expected Budget (Gap Filling)"
                        name="budget"
                        value={formData.budget}
                        onChange={handleNumericChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="0.00"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="d. Budget needed to achieve each milestone described in 8d (max 400 chars)"
                        name="milestone_budget"
                        value={formData.milestone_budget}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 400 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.milestone_budget?.length || 0}/400 characters`}
                        placeholder="Describe budget allocation for each milestone"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default BudgetSection;


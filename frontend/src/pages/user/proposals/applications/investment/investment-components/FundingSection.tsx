import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';
import { Grid, TextField, Box, FormControl, FormLabel, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const FundingSection: React.FC<InvestmentFormSectionProps> = ({ formData, handleChange }) => {
    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d+(\.\d*)?$/.test(value) || /^\.\d+$/.test(value)) {
            handleChange(e as any);
        }
    };

    if (!formData.requiredAssistanceFromGovernment.funds) {
        return null;
    }

    return (
        <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}>
                5. If gap-filling funding is needed (If you selected (4.a) "Funds" above)
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="a. Research gap(s) identified for your project (1-3 gaps, not exceeding 800 characters in total)"
                        name="researchGaps"
                        value={formData.researchGaps}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 800 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.researchGaps?.length || 0}/800 characters`}
                        placeholder="Research gap(s)"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="b. Research objectives - proposed solutions/interventions to address those identified gaps (1-5 objectives)"
                        name="researchObjectives"
                        value={formData.researchObjectives}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 3500 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.researchObjectives?.length || 0}/3500 characters`}
                        placeholder="Proposed solutions"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                        <FormLabel sx={{ color: 'text.primary', mb: 1, display: 'block' }}>
                            c. Research plan for gap filling (Describe your plan based on following topics)
                        </FormLabel>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#4b5563', fontSize: '0.875rem', marginBottom: '8px' }}>
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
                        inputProps={{ maxLength: 3000 }}
                        helperText={`${formData.researchPlan?.length || 0}/3000 characters`}
                        placeholder="Research plan"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2, mt: 2 }}>
                        d. Total Project Cost
                    </Typography>
                </Grid>

                {/* Currency Selection and Total project cost */}
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel shrink>Currency</InputLabel>
                        <Select
                            name="currencyValue"
                            value={formData.currencyValue}
                            onChange={handleChange as any}
                            label="Currency"
                            displayEmpty
                            notched
                        >
                            <MenuItem value=""><em>Select Currency</em></MenuItem>
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="LKR">LKR</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        label="1. Total project cost"
                        name="projectCost"
                        value={formData.projectCost}
                        onChange={handleNumericChange as any}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="Enter amount"
                    />
                </Grid>

                {/* Total Expenditure */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="2. Total Expenditure to Date"
                        name="expenditure"
                        value={formData.expenditure}
                        onChange={handleNumericChange as any}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="Enter total expenditure"
                    />
                </Grid>

                {/* Budget for Gap Filling */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="3. Expected TOTAL Budget for Gap Filling Research"
                        name="budget"
                        value={formData.budget}
                        onChange={handleNumericChange as any}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        placeholder="Enter total"
                    />
                </Grid>

                {/* Milestone Budget */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="4. Budget needed to achieve each milestone described in 5.d"
                        name="milestone_budget"
                        value={formData.milestone_budget}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 3000 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.milestone_budget?.length || 0}/3000 characters`}
                        placeholder="Describe budget allocation for each milestone"
                    />
                </Grid>

                {/* Place(s) where the research is to be conducted */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="e. Place(s) where the research is to be conducted"
                        name="researchPlace"
                        value={formData.researchPlace}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={2}
                        inputProps={{ maxLength: 3000 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.researchPlace?.length || 0}/3000 characters`}
                        placeholder="e.g: University, research institute, private company, etc."
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default FundingSection;

import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';
import { Grid, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box } from '@mui/material';

const SignificanceSection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
                            4. Significance for the country and expected impact (max 400 characters each)
                        </FormLabel>

                        <Box sx={{ mt: 2, ml: 2 }}>
                            <FormLabel component="legend" sx={{ color: '#374151', mb: 1 }}>a. Economic Impact:</FormLabel>
                            <RadioGroup
                                name="significance.economicImpact"
                                value={formData.significance.economicImpact}
                                onChange={handleChange}
                                row
                            >
                                <FormControlLabel value="exportPotential" control={<Radio color="primary" />} label="Export Potential" />
                                <FormControlLabel value="importSubstitution" control={<Radio color="primary" />} label="Import Substitution" />
                                <FormControlLabel value="other" control={<Radio color="primary" />} label="Other" />
                            </RadioGroup>

                            {formData.significance.economicImpact === "other" && (
                                <TextField
                                    fullWidth
                                    name="significance.other"
                                    value={formData.significance.other}
                                    onChange={handleChange}
                                    variant="outlined"
                                    placeholder="Specify other economic impact"
                                    inputProps={{ maxLength: 200 }}
                                    sx={{ mt: 1, ml: 2, width: 'calc(100% - 16px)' }}
                                />
                            )}
                        </Box>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="b. Social Impact"
                        name="significance.socialImpact"
                        value={formData.significance.socialImpact}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 400 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.significance.socialImpact?.length || 0}/400 characters`}
                        placeholder="Describe social impact"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="c. Environmental Impact"
                        name="significance.environmentalImpact"
                        value={formData.significance.environmentalImpact}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 400 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.significance.environmentalImpact?.length || 0}/400 characters`}
                        placeholder="Describe environmental impact"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default SignificanceSection;


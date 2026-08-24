import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";
import { Grid, TextField, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const InvestorSignificanceSection: React.FC<InvestorFormProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                            3. Significance for the country and expected impact (not exceeding 800 characters in each of the a-c categories)
                        </FormLabel>

                        <Box sx={{ ml: 2, mt: 2 }}>
                            <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                                a. Economic Impact:
                            </FormLabel>
                            <RadioGroup
                                name="significance.economicImpactType"
                                value={formData.significance?.economicImpactType || ''}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="exportPotential" control={<Radio />} label="Export Potential" />
                                <FormControlLabel value="importSubstitution" control={<Radio />} label="Import Substitution" />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                            </RadioGroup>

                            <TextField
                                fullWidth
                                label="Other Economic Impact Details"
                                name="significance.other"
                                value={formData.significance?.other || ''}
                                onChange={handleChange}
                                variant="outlined"
                                disabled={formData.significance?.economicImpactType !== "other"}
                                inputProps={{ maxLength: 200 }}
                                InputLabelProps={{ shrink: true }}
                                helperText={`${formData.significance?.other?.length || 0}/200 characters`}
                                placeholder="Specify other economic impact"
                                sx={{ mt: 2, display: formData.significance?.economicImpactType === "other" ? 'flex' : 'none' }}
                            />
                        </Box>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="b. Social Impact"
                        name="significance.socialImpact"
                        value={formData.significance?.socialImpact || ''}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 800 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.significance?.socialImpact?.length || 0}/800 characters`}
                        placeholder="Describe social impact"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="c. Environmental Impact"
                        name="significance.environmentalImpact"
                        value={formData.significance?.environmentalImpact || ''}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 800 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.significance?.environmentalImpact?.length || 0}/800 characters`}
                        placeholder="Describe environmental impact"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default InvestorSignificanceSection;

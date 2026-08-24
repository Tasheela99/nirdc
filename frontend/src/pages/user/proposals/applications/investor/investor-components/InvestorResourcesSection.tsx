import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";
import { Grid, Box, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const InvestorResourcesSection: React.FC<InvestorFormProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                            6. Existing resources & collaborations, if any (local/international)
                        </FormLabel>
                        <FormGroup sx={{ ml: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.existingResources.local}
                                        onChange={handleChange}
                                        name="existingResources.local"
                                    />
                                }
                                label="Local"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.existingResources.international}
                                        onChange={handleChange}
                                        name="existingResources.international"
                                    />
                                }
                                label="International"
                            />
                        </FormGroup>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InvestorResourcesSection;

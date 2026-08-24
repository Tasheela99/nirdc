import React from "react";
import { InvestorFormProps } from "../investor-types/InvestorFormTypes.ts";
import { Grid, TextField, Box, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';

const InvestorRequiredAssistanceSection: React.FC<InvestorFormProps> = ({ formData, handleChange }) => {
    // Check if at least one main checkbox is selected
    const mainOptions = [
        formData.requiredAssistanceFromGovernment.regulatory,
        formData.requiredAssistanceFromGovernment.land,
        formData.requiredAssistanceFromGovernment.infrastructure,
        formData.requiredAssistanceFromGovernment.technicalAssistance,
        formData.requiredAssistanceFromGovernment.partnerships,
        formData.requiredAssistanceFromGovernment.ip
    ];
    const noneSelected = !mainOptions.some(Boolean);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl component="fieldset" error={noneSelected && !formData.requiredAssistanceFromGovernment.other.trim()} fullWidth>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                            7. Required assistance from the government: *
                        </FormLabel>
                        <FormGroup sx={{ ml: 2 }}>
                            <FormControlLabel
                                control={<Checkbox checked={formData.requiredAssistanceFromGovernment.regulatory} onChange={handleChange} name="requiredAssistanceFromGovernment.regulatory" />}
                                label="Regulatory Approvals"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={formData.requiredAssistanceFromGovernment.land} onChange={handleChange} name="requiredAssistanceFromGovernment.land" />}
                                label="Land"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={formData.requiredAssistanceFromGovernment.infrastructure} onChange={handleChange} name="requiredAssistanceFromGovernment.infrastructure" />}
                                label="Access to Infrastructure/Equipment"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={formData.requiredAssistanceFromGovernment.technicalAssistance} onChange={handleChange} name="requiredAssistanceFromGovernment.technicalAssistance" />}
                                label="Technical Assistance"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={formData.requiredAssistanceFromGovernment.partnerships} onChange={handleChange} name="requiredAssistanceFromGovernment.partnerships" />}
                                label="Industry Partnerships"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={formData.requiredAssistanceFromGovernment.ip} onChange={handleChange} name="requiredAssistanceFromGovernment.ip" />}
                                label="IP/Patent Applications"
                            />
                        </FormGroup>
                        <TextField
                            fullWidth
                            label="Other (please specify)"
                            name="requiredAssistanceFromGovernment.other"
                            value={formData.requiredAssistanceFromGovernment.other}
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ mt: 2, ml: 2, width: 'calc(100% - 16px)' }}
                            placeholder="Other assistance (optional)"
                        />
                        {noneSelected && !formData.requiredAssistanceFromGovernment.other.trim() && (
                            <FormHelperText sx={{ ml: 2 }}>Please select at least one required assistance option or specify 'Other'.</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                {/* 8. Risk and assumptions */}
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
            </Grid>
        </Box>
    );
};

export default InvestorRequiredAssistanceSection;

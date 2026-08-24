import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';
import { Grid, TextField, Box, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const assistanceOptions = [
    { name: "funds", label: "a. Funds" },
    { name: "regulatory", label: "b. Regulatory Approvals" },
    { name: "land", label: "c. Land" },
    { name: "infrastructure", label: "d. Access to Infrastructure/Equipment" },
    { name: "technicalAssistance", label: "e. Technical Assistance" },
    { name: "partnerships", label: "f. Industry Partnerships" },
    { name: "ip", label: "g. IP/Patent Applications" },
];

const RequiredAssistanceSection: React.FC<InvestmentFormSectionProps> = ({ formData, setFormData }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                            4. Required Assistance from the Government:
                        </FormLabel>
                        <FormGroup sx={{ ml: 2 }}>
                            {assistanceOptions.map((option) => (
                                <FormControlLabel
                                    key={option.name}
                                    control={
                                        <Checkbox
                                            checked={!!formData.requiredAssistanceFromGovernment[option.name as keyof typeof formData.requiredAssistanceFromGovernment]}
                                            onChange={e =>
                                                setFormData((prev: any) => ({
                                                    ...prev,
                                                    requiredAssistanceFromGovernment: {
                                                        ...prev.requiredAssistanceFromGovernment,
                                                        [option.name]: e.target.checked,
                                                    },
                                                }))
                                            }
                                            name={`requiredAssistanceFromGovernment.${option.name}`}
                                        />
                                    }
                                    label={option.label}
                                />
                            ))}
                        </FormGroup>
                        <TextField
                            fullWidth
                            label="Other (please specify)"
                            name="requiredAssistanceFromGovernment.other"
                            value={formData.requiredAssistanceFromGovernment.other}
                            onChange={e =>
                                setFormData((prev: any) => ({
                                    ...prev,
                                    requiredAssistanceFromGovernment: {
                                        ...prev.requiredAssistanceFromGovernment,
                                        other: e.target.value,
                                    },
                                }))
                            }
                            variant="outlined"
                            sx={{ mt: 2, ml: 2, width: 'calc(100% - 16px)' }}
                            placeholder="Other assistance"
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RequiredAssistanceSection;

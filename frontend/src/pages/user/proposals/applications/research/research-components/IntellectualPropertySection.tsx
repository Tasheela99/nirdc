import React from 'react';
import { FormSectionProps } from '../research-types/FormTypes.ts';
import { Grid, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, InputLabel, Box } from '@mui/material';

const IntellectualPropertySection: React.FC<FormSectionProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
                            7. Current outputs (patents/technologies/prototypes/publications)
                        </FormLabel>

                        <Box sx={{ mt: 1, ml: 2 }}>
                            <FormLabel component="legend" sx={{ color: '#374151' }}>a. Intellectual property status</FormLabel>
                            <RadioGroup
                                name="intellectualProperty.status"
                                value={formData.intellectualProperty.status}
                                onChange={handleChange}
                                row
                            >
                                <FormControlLabel value="Applied" control={<Radio color="primary" size="small" />} label="Patent Applied" />
                                <FormControlLabel value="Granted" control={<Radio color="primary" size="small" />} label="Patent Granted" />
                                <FormControlLabel value="None" control={<Radio color="primary" size="small" />} label="None" />
                            </RadioGroup>
                        </Box>
                    </FormControl>
                </Grid>

                {formData.intellectualProperty.status !== "None" && (
                    <>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="b. Patent Number"
                                name="intellectualProperty.patentNumber"
                                value={formData.intellectualProperty.patentNumber}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                placeholder="Enter patent number"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="c. Received Date"
                                type="date"
                                name="intellectualProperty.receivedDate"
                                value={formData.intellectualProperty.receivedDate}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel shrink>d. Local or International</InputLabel>
                                <Select
                                    name="intellectualProperty.localOrInternational"
                                    value={formData.intellectualProperty.localOrInternational}
                                    onChange={handleChange as any}
                                >
                                    <MenuItem value=""><em>Select type</em></MenuItem>
                                    <MenuItem value="Local">Local</MenuItem>
                                    <MenuItem value="International">International</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                )}

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel shrink>e. Technology Readiness Level – TRL1-9</InputLabel>
                        <Select
                            name="technologyReadinessLevel"
                            value={formData.technologyReadinessLevel.replace("TRL ", "")}
                            onChange={handleChange as any}
                        >
                            <MenuItem value=""><em>Select TRL</em></MenuItem>
                            {Array.from({ length: 9 }, (_, i) => (
                                <MenuItem key={i + 1} value={String(i + 1)}>
                                    TRL {i + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="f. Publications (max 1250 characters)"
                        name="publications"
                        value={formData.publications}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 1250 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.publications?.length || 0}/1250 characters`}
                        placeholder="List publications (SCI journal/other international or local publications/conference papers etc.)"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default IntellectualPropertySection;


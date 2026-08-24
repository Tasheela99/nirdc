import React from 'react';
import { InvestmentFormSectionProps } from '../investment-types/InvestmentFormTypes.ts';
import { Grid, TextField, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputLabel, Select, MenuItem } from '@mui/material';

const InvestmentIntellectualPropertySection: React.FC<InvestmentFormSectionProps> = ({ formData, handleChange }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                            7. Current outputs (patents/technologies/prototypes/publications)
                        </FormLabel>

                        {/* IP Status */}
                        <Box sx={{ ml: 2, mt: 2 }}>
                            <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                                a. Intellectual property status
                            </FormLabel>
                            <RadioGroup
                                name="intellectualProperty.status"
                                value={formData.intellectualProperty.status || ''}
                                onChange={handleChange as any}
                            >
                                <FormControlLabel value="Applied" control={<Radio />} label="Patent Applied" />
                                <FormControlLabel value="Granted" control={<Radio />} label="Patent Granted" />
                                <FormControlLabel value="None" control={<Radio />} label="None" />
                            </RadioGroup>
                        </Box>
                    </FormControl>
                </Grid>

                {/* Conditionally render fields */}
                {formData.intellectualProperty.status !== "None" && (
                    <>
                        {/* Patent Details */}
                        <Grid item xs={12} md={4}>
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

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="c. Received Date"
                                name="intellectualProperty.receivedDate"
                                value={formData.intellectualProperty.receivedDate}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel shrink>d. Local or International</InputLabel>
                                <Select
                                    name="intellectualProperty.localOrInternational"
                                    value={formData.intellectualProperty.localOrInternational}
                                    onChange={handleChange as any}
                                    label="d. Local or International"
                                    displayEmpty
                                    notched
                                >
                                    <MenuItem value=""><em>Select type</em></MenuItem>
                                    <MenuItem value="Local">Local</MenuItem>
                                    <MenuItem value="International">International</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                )}

                {/* Technology Readiness Level */}
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel shrink>e. Technology Readiness Level – TRL1-9 (refer to guidelines)</InputLabel>
                        <Select
                            name="trl"
                            value={formData.trl}
                            onChange={handleChange as any}
                            label="e. Technology Readiness Level – TRL1-9 (refer to guidelines)"
                            displayEmpty
                            notched
                        >
                            <MenuItem value=""><em>Select TRL</em></MenuItem>
                            {Array.from({ length: 9 }, (_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    TRL {i + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Publications */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="f. Publications"
                        name="publications"
                        value={formData.publications}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 3000 }}
                        InputLabelProps={{ shrink: true }}
                        helperText={`${formData.publications?.length || 0}/3000 characters`}
                        placeholder="List publications (e.g., SCI journal, other international or local publications)"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default InvestmentIntellectualPropertySection;

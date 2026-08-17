// import React from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, IconButton, Box, Grid
} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';

interface DialogProps {
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    shareDialogOpen: boolean;
    setShareDialogOpen: (open: boolean) => void;
    editFormData: any;
    setEditFormData: (data: any) => void;
    validationErrors: Record<string, string>;
    handleFormSubmit: () => void;
    handleDeleteConfirm: () => void;
    copyToClipboard: (text: string) => Promise<void>;
}

export const renderDialogs = ({
    editDialogOpen, setEditDialogOpen, deleteDialogOpen, setDeleteDialogOpen, shareDialogOpen, setShareDialogOpen,
    editFormData, setEditFormData, validationErrors, handleFormSubmit, handleDeleteConfirm, copyToClipboard
}: DialogProps): JSX.Element => {
    return (
        <>
            <Dialog 
                open={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Proposal</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Project Title"
                                    value={editFormData.projectTitle || ''}
                                    onChange={(e) => setEditFormData({...editFormData, projectTitle: e.target.value})}
                                    error={!!validationErrors.projectTitle}
                                    helperText={validationErrors.projectTitle}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Department"
                                    value={editFormData.department || ''}
                                    onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                                    error={!!validationErrors.department}
                                    helperText={validationErrors.department}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Budget"
                                    value={editFormData.budget || ''}
                                    onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})}
                                    error={!!validationErrors.budget}
                                    helperText={validationErrors.budget}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={editFormData.status || ''}
                                        label="Status"
                                        onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                                    >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="approved">Approved</MenuItem>
                                        <MenuItem value="rejected">Rejected</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleFormSubmit} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={deleteDialogOpen} 
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this proposal? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={shareDialogOpen} 
                onClose={() => setShareDialogOpen(false)}
            >
                <DialogTitle>Share Proposal</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Share this proposal using the link below:
                    </Typography>
                    <TextField
                        fullWidth
                        value={window.location.href}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <IconButton onClick={() => copyToClipboard(window.location.href)}>
                                    <ShareIcon />
                                </IconButton>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
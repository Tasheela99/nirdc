import React, { useState, useEffect, useContext } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel
} from '@mui/material';
import adminApi from '../../../api/AdminApi';
import { useAlert } from '../../../components/common/AlertContextScreen';
import UserContext from '../../../store/UserContext';
import RoleChangePasswordDialog from '../../../components/admin/RoleChangePasswordDialog';

interface EditUserModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: any;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, onSuccess, user }) => {
    const { showAlert } = useAlert();
    const { userInfo } = useContext(UserContext);
    
    const [formData, setFormData] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        designation: '',
        institution: '',
        role: '',
        activeState: true
    });
    const [isLoading, setIsLoading] = useState(false);
    
    // Role change verification state
    const [passwordDialogProps, setPasswordDialogProps] = useState({
        open: false,
        targetRole: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                mobile: user.mobile || '',
                designation: user.designation || '',
                institution: user.institution || '',
                role: user.role || '',
                activeState: user.activeState !== false
            });
        }
    }, [user]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev: any) => ({ ...prev, activeState: e.target.checked }));
    };

    const handleSave = async () => {
        if (!user) return;
        
        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            showAlert('First Name, Last Name, and Email are required.', 'error');
            return;
        }

        const updates: any = {};
        if (formData.firstName !== user.firstName) updates.firstName = formData.firstName;
        if (formData.lastName !== user.lastName) updates.lastName = formData.lastName;
        if (formData.email !== user.email) updates.email = formData.email;
        if (formData.mobile !== user.mobile) updates.mobile = formData.mobile;
        if (formData.designation !== user.designation) updates.designation = formData.designation;
        if (formData.institution !== user.institution) updates.institution = formData.institution;
        if (formData.activeState !== user.activeState) updates.activeState = formData.activeState;

        const roleChanged = formData.role !== user.role;
        
        if (roleChanged && userInfo?.role !== 'SUPER_ADMIN') {
            showAlert('Only Super Admin can change user roles.', 'error');
            return;
        }

        if (roleChanged) {
            // Need password verification
            setPasswordDialogProps({ open: true, targetRole: formData.role });
            return;
        }

        // Proceed without role change
        await executeUpdate(updates);
    };

    const executeUpdate = async (updates: any, adminPassword?: string) => {
        setIsLoading(true);
        try {
            let roleUpdated = false;
            let detailsUpdated = false;

            // Update role if changed
            if (adminPassword) {
                const roleResponse = await adminApi.updateUserRole(user._id, { 
                    role: formData.role, 
                    adminPassword 
                }) as any;
                
                if (!roleResponse.status) {
                    showAlert(roleResponse.message || 'Failed to update role', 'error');
                    setIsLoading(false);
                    return;
                }
                roleUpdated = true;
            }

            // Update other details
            if (Object.keys(updates).length > 0) {
                const detailsResponse = await adminApi.updateUser(user._id, updates) as any;
                if (!detailsResponse.status) {
                    showAlert(detailsResponse.message || 'Failed to update user details', 'error');
                    setIsLoading(false);
                    return;
                }
                detailsUpdated = true;
            }

            if (roleUpdated || detailsUpdated) {
                showAlert('User updated successfully', 'success');
                onSuccess();
            } else {
                showAlert('No changes made', 'info');
                onClose();
            }
        } catch (error) {
            console.error(error);
            showAlert('An error occurred while updating the user', 'error');
        } finally {
            setIsLoading(false);
            setPasswordDialogProps({ open: false, targetRole: '' });
        }
    };

    const handlePasswordConfirm = (password: string) => {
        const updates: any = {};
        if (formData.firstName !== user.firstName) updates.firstName = formData.firstName;
        if (formData.lastName !== user.lastName) updates.lastName = formData.lastName;
        if (formData.email !== user.email) updates.email = formData.email;
        if (formData.mobile !== user.mobile) updates.mobile = formData.mobile;
        if (formData.designation !== user.designation) updates.designation = formData.designation;
        if (formData.institution !== user.institution) updates.institution = formData.institution;
        if (formData.activeState !== user.activeState) updates.activeState = formData.activeState;

        executeUpdate(updates, password);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit User Details</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </div>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Mobile (e.g. +94...)"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            fullWidth
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Institution"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                fullWidth
                            />
                        </div>
                        
                        <FormControl fullWidth disabled={userInfo?.role !== 'SUPER_ADMIN'}>
                            <InputLabel>User Role</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label="User Role"
                            >
                                <MenuItem value="USER">General User</MenuItem>
                                <MenuItem value="REVIEWER">Reviewer</MenuItem>
                                <MenuItem value="DIRECTOR">Director</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                            </Select>
                            {userInfo?.role !== 'SUPER_ADMIN' && (
                                <p className="text-xs text-gray-500 mt-1">Only Super Admin can change user roles.</p>
                            )}
                        </FormControl>

                        <FormControlLabel
                            control={<Switch checked={formData.activeState} onChange={handleSwitchChange} color="primary" />}
                            label={`Account Status: ${formData.activeState ? 'Active' : 'Deactivated'}`}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            <RoleChangePasswordDialog
                open={passwordDialogProps.open}
                onClose={() => setPasswordDialogProps({ open: false, targetRole: '' })}
                onConfirm={handlePasswordConfirm}
                isLoading={isLoading}
                targetRole={passwordDialogProps.targetRole}
            />
        </>
    );
};

export default EditUserModal;

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';

interface RoleChangePasswordDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (password: string) => void;
    isLoading: boolean;
    targetRole: string;
}

const RoleChangePasswordDialog: React.FC<RoleChangePasswordDialogProps> = ({ open, onClose, onConfirm, isLoading, targetRole }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleConfirm = () => {
        if (!password.trim()) return;
        onConfirm(password);
    };

    const handleClose = () => {
        setPassword('');
        setShowPassword(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>Security Verification Required</DialogTitle>
            <DialogContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    You are about to change this user's role to <strong>{targetRole}</strong>. This is a highly sensitive action.
                    Please enter your Super Admin password to verify your identity.
                </Typography>
                <div className="relative mt-4">
                    <TextField
                        label="Admin Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleConfirm();
                            }
                        }}
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} disabled={isLoading} sx={{ color: 'gray' }}>Cancel</Button>
                <Button 
                    onClick={handleConfirm} 
                    disabled={!password || isLoading}
                    variant="contained"
                    color="error"
                >
                    {isLoading ? 'Verifying...' : 'Verify & Change Role'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoleChangePasswordDialog;

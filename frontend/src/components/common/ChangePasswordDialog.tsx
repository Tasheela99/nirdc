import React, { useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  CircularProgress,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Divider
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  Security,
  Close as CloseIcon,
  VpnKey,
  CheckCircle
} from "@mui/icons-material";
import { useAlert } from "./AlertContextScreen";
import axios from "../../config/AxiosInstance";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showAlert } = useAlert();

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      showAlert("All fields are required.", "error");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showAlert("New passwords do not match.", "error");
      return;
    }
    setLoading(true);
    
    // Debug: Check if token exists
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
    console.log('Token exists:', !!token);
    console.log('UserInfo exists:', !!userInfo);
    
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        console.log('User role:', parsedUserInfo.role);
        console.log('User data:', parsedUserInfo);
      } catch (e) {
        console.error('Error parsing userInfo:', e);
      }
    }
    
    try {
      const response = await axios.post("/users/user/change-password", {
        oldPassword,
        newPassword,
        confirmNewPassword,
      });
      if (response.data.status) {
        showAlert("Password changed successfully.", "success");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        onClose();
      } else {
        showAlert(response.data.message || "Failed to change password.", "error");
      }
    } catch (error: any) {
      console.error('Change password error:', error);
      
      let errorMessage = "Failed to change password.";
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
        // Optionally redirect to login
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          window.location.href = "/sign-in";
        }, 2000);
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to change password.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showAlert(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#ffffff',
          color: '#111827',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 56, 147, 0.15)',
          border: '1px solid rgba(0, 56, 147, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #003893 0%, #1B4F72 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        position: 'relative',
        pb: 2
      }}>
        <Security sx={{ fontSize: 28 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Change Password
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Update your account password securely
          </Typography>
        </Box>
        <IconButton 
          onClick={handleClose} 
          sx={{ 
            color: 'white',
            position: 'absolute',
            right: 8,
            top: 8
          }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              For your security, please confirm your current password and enter a new one.
            </Typography>
          </Box>

          <TextField
            label="Current Password"
            type={showOldPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            required
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#003893',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#003893',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#003893',
              }
            }}
          />
          
          <Divider sx={{ my: 2, borderColor: 'rgba(0, 56, 147, 0.12)' }} />
          
          <TextField
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            helperText="Password must be at least 8 characters long"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#003893',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#003893',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#003893',
              },
              '& .MuiFormHelperText-root': {
                color: '#003893',
              }
            }}
          />
          
          <TextField
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={confirmNewPassword !== "" && newPassword !== confirmNewPassword}
            helperText={
              confirmNewPassword !== "" && newPassword !== confirmNewPassword 
                ? "Passwords do not match" 
                : "Re-enter your new password"
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CheckCircle color={
                    confirmNewPassword !== "" && newPassword === confirmNewPassword 
                      ? "success" 
                      : "action"
                  } />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#003893',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#003893',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#003893',
              },
              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d32f2f',
              },
              '& .MuiFormHelperText-root.Mui-error': {
                color: '#d32f2f',
              }
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
              borderColor: '#003893',
              color: '#003893',
              '&:hover': {
                borderColor: '#1B4F72',
                backgroundColor: 'rgba(0, 56, 147, 0.04)',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || newPassword !== confirmNewPassword || !oldPassword || !newPassword || !confirmNewPassword}
            sx={{ 
              background: 'linear-gradient(135deg, #003893 0%, #1B4F72 100%)',
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 140,
              '&:hover': {
                background: 'linear-gradient(135deg, #1B4F72 0%, #003893 100%)',
              },
              '&:disabled': {
                background: 'rgba(0,0,0,0.12)',
              }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Changing...
              </>
            ) : (
              <>
                <Security sx={{ mr: 1, fontSize: 20 }} />
                Change Password
              </>
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordDialog;
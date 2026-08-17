import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {TextField, CircularProgress, InputAdornment, IconButton} from "@mui/material";
import {useAlert} from "../../components/common/AlertContextScreen.tsx";
import authApi from "../../api/AuthApi";
import {ApiResponse} from "../../utils/ApiResponse.ts";
import AuthLayout from "../../components/layout/AuthLayout.tsx";
import {Eye, EyeOff, KeyRound} from "lucide-react";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {token} = useParams<{ token: string }>();
    const navigate = useNavigate();
    const {showAlert} = useAlert();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!token) {
            showAlert(t('messages.invalidToken'), "error");
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert(t('messages.passwordsDoNotMatch'), "error");
            setIsLoading(false);
            return;
        }

        try {
            const response = (await authApi.resetPassword({token, newPassword})) as ApiResponse;
            if (response.status) {
                showAlert(t('messages.passwordResetSuccess'), "success");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                showAlert(response.message || t('messages.genericError'), "error");
            }
        } catch {
            showAlert(t('messages.genericError'), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Choose a strong new password for your account"
            brandingHeading="New Password"
            brandingText="Create a secure password with at least 8 characters, including uppercase, lowercase, numbers, and special characters."
        >
            <form onSubmit={handleResetPassword} className="space-y-5">
                <TextField
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowNewPassword(p => !p)} edge="end" size="small">
                                    {showNewPassword ? <Eye size={18} className="text-gray-500" /> : <EyeOff size={18} className="text-gray-400" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(p => !p)} edge="end" size="small">
                                    {showConfirmPassword ? <Eye size={18} className="text-gray-500" /> : <EyeOff size={18} className="text-gray-400" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : <><KeyRound size={18} /> Reset Password</>}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPasswordPage;

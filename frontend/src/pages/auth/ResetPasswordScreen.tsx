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

    const glassInputSx = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(8px)",
            borderRadius: "14px",
            color: "#ffffff",
            transition: "all 0.2s ease-in-out",
            "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.22)",
            },
            "&:hover fieldset": {
                borderColor: "rgba(235, 120, 180, 0.6)",
            },
            "&.Mui-focused": {
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                "& fieldset": {
                    borderColor: "#e279b5",
                    borderWidth: "1.5px",
                },
            },
        },
        "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.75)",
            "&.Mui-focused": {
                color: "#f8a5d3",
                fontWeight: 600,
            },
        },
        "& .MuiInputBase-input": {
            color: "#ffffff",
        },
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
                    sx={glassInputSx}
                    onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowNewPassword(p => !p)} edge="end" size="small" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                    {showNewPassword ? <Eye size={18} className="text-pink-300" /> : <EyeOff size={18} className="text-white/50" />}
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
                    sx={glassInputSx}
                    onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(p => !p)} edge="end" size="small" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                    {showConfirmPassword ? <Eye size={18} className="text-pink-300" /> : <EyeOff size={18} className="text-white/50" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8C2963] via-[#a03273] to-[#6B1D4A] hover:from-[#9C3872] hover:to-[#8C2963] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#8C2963]/30 hover:shadow-xl hover:shadow-[#8C2963]/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : <><KeyRound size={18} /> Reset Password</>}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPasswordPage;

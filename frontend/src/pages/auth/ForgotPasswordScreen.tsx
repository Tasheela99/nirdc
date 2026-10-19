import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {TextField, CircularProgress, InputAdornment} from "@mui/material";
import {useAlert} from "../../components/common/AlertContextScreen.tsx";
import authApi from "../../api/AuthApi";
import {ApiResponse} from "../../utils/ApiResponse.ts";
import AuthLayout from "../../components/layout/AuthLayout.tsx";
import {Mail, Send, ArrowLeft} from "lucide-react";
import { useTranslation } from "react-i18next";

const ForgottenPasswordPage = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {showAlert} = useAlert();

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = (await authApi.forgotPassword(email)) as ApiResponse;
            if (response.status) {
                showAlert(t('messages.resetEmailSent'), "success");
            } else {
                showAlert(response.message || t('messages.genericError'), "error");
            }
        } catch {
            showAlert(t('messages.networkError'), "error");
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
            title="Forgot Password"
            subtitle="Enter your email address to receive a password reset link"
            brandingHeading="Password Recovery"
            brandingText="We'll send a secure link to your email to reset your password."
        >
            <form onSubmit={handleForgotPassword} className="space-y-5">
                <TextField
                    label={t('auth.email')}
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={glassInputSx}
                    onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Mail size={18} className="text-white/60" />
                            </InputAdornment>
                        ),
                    }}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8C2963] via-[#a03273] to-[#6B1D4A] hover:from-[#9C3872] hover:to-[#8C2963] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#8C2963]/30 hover:shadow-xl hover:shadow-[#8C2963]/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : <><Send size={18} /> Send Reset Link</>}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-pink-400/50 text-white font-medium py-3 rounded-xl transition-all duration-200 text-sm backdrop-blur-sm"
                >
                    <ArrowLeft size={16} /> {t('auth.backToLogin')}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ForgottenPasswordPage;

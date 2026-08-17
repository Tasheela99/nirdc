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
                    onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Mail size={18} className="text-gray-400" />
                            </InputAdornment>
                        ),
                    }}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : <><Send size={18} /> Send Reset Link</>}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary font-medium py-2.5 rounded-xl transition-all duration-200 text-sm"
                >
                    <ArrowLeft size={16} /> {t('auth.backToLogin')}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ForgottenPasswordPage;

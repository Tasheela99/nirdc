import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {TextField, CircularProgress, InputAdornment} from "@mui/material";
import {useAlert} from "../../components/common/AlertContextScreen.tsx";
import authApi from "../../api/AuthApi";
import {ApiResponse} from "../../utils/ApiResponse.ts";
import AuthLayout from "../../components/layout/AuthLayout.tsx";
import {Mail, Send, ArrowLeft} from "lucide-react";
import { useTranslation } from "react-i18next";

const ResendOtpPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const {showAlert} = useAlert();

    const handleResendOtp = async () => {
        if (!email) {
            showAlert(t('messages.enterEmail'), "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = (await authApi.resendOtp({email})) as ApiResponse;
            if (response?.status) {
                showAlert(t('messages.otpSent'), "success");
                setTimeout(() => navigate(`/security/verify-account/${email}`), 3000);
            } else {
                showAlert(response?.message || t('messages.resendFailed'), "error");
            }
        } catch {
            showAlert(t('messages.resendError'), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title={t('auth.resend.title')}
            subtitle={t('auth.resend.subtitle')}
            brandingHeading={t('auth.resend.needNewCode')}
            brandingText={t('auth.resend.needNewText')}
        >
            <div className="space-y-5">
                <TextField
                    label={t('auth.email')}
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : <><Send size={18} /> {t('auth.resend.resendButton')}</>}
                </button>

                <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary font-medium py-2.5 rounded-xl transition-all duration-200 text-sm"
                >
                    <ArrowLeft size={16} /> {t('auth.backToLogin')}
                </button>
            </div>
        </AuthLayout>
    );
};

export default ResendOtpPage;

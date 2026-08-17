import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {TextField, CircularProgress, InputAdornment} from "@mui/material";
import {useAlert} from "../../components/common/AlertContextScreen.tsx";
import authApi from "../../api/AuthApi";
import {ApiResponse} from "../../utils/ApiResponse.ts";
import AuthLayout from "../../components/layout/AuthLayout.tsx";
import AccountVerificationDialog from "../../components/common/AccountVerificationDialog.tsx";
import {Mail, KeyRound, ShieldCheck, ArrowLeft, RefreshCw} from "lucide-react";
import { useTranslation } from "react-i18next";

const VerifyAccountScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {email: emailFromUrl} = useParams<{ email: string }>();
    const [email, setEmail] = useState<string>(emailFromUrl || "");
    const [emailOtp, setEmailOtp] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const {showAlert} = useAlert();
    const [openDialog, setOpenDialog] = useState(true);

    useEffect(() => {
        if (emailFromUrl) setEmail(emailFromUrl);
    }, [emailFromUrl]);

    const handleVerifyAccount = async () => {
        if (!email || !emailOtp) {
            showAlert(t('messages.emailOtpRequired'), "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = (await authApi.verifyEmailOtp({email, emailOtp})) as ApiResponse;

            if (response?.status === true) {
                showAlert(t('messages.accountVerified'), "success");
                setTimeout(() => navigate("/login", {replace: true}), 2000);
            } else {
                showAlert(response?.message || t('messages.otpVerificationFailed'), "error");
            }
        } catch {
            showAlert(t('messages.verificationFailed'), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AccountVerificationDialog
                openDialog={openDialog}
                handleCloseDialog={() => setOpenDialog(false)}
            />

            <AuthLayout
                title={t('auth.verify.title')}
                subtitle={t('auth.verify.subtitle')}
                brandingHeading={t('auth.verify.almostThere')}
                brandingText={t('auth.verify.almostText')}
            >
                <div className="space-y-4">
                    {!emailFromUrl && (
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
                    )}

                    <TextField
                        label={t('auth.verify.emailOtp')}
                        type="text"
                        fullWidth
                        value={emailOtp}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailOtp(e.target.value)}
                        required
                        inputProps={{maxLength: 8}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <KeyRound size={18} className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/resend-otp")}
                            className="text-sm text-primary dark:text-primary-light hover:underline font-medium flex items-center gap-1"
                        >
                            <RefreshCw size={14} /> {t('auth.verify.didntReceive')}
                        </button>
                    </div>

                    <button
                        onClick={handleVerifyAccount}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <CircularProgress size={22} color="inherit" /> : <><ShieldCheck size={18} /> {t('auth.verify.verifyButton')}</>}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary font-medium py-2.5 rounded-xl transition-all duration-200 text-sm"
                    >
                        <ArrowLeft size={16} /> {t('auth.backToLogin')}
                    </button>
                </div>
            </AuthLayout>
        </>
    );
};

export default VerifyAccountScreen;
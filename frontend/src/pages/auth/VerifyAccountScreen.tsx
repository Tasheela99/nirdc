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
                    )}

                    <TextField
                        label={t('auth.verify.emailOtp')}
                        type="text"
                        fullWidth
                        value={emailOtp}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailOtp(e.target.value)}
                        required
                        inputProps={{maxLength: 8}}
                        sx={glassInputSx}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <KeyRound size={18} className="text-white/60" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/resend-otp")}
                            className="text-sm text-pink-300 hover:text-pink-200 hover:underline font-medium flex items-center gap-1 transition-colors"
                        >
                            <RefreshCw size={14} /> {t('auth.verify.didntReceive')}
                        </button>
                    </div>

                    <button
                        onClick={handleVerifyAccount}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8C2963] via-[#a03273] to-[#6B1D4A] hover:from-[#9C3872] hover:to-[#8C2963] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#8C2963]/30 hover:shadow-xl hover:shadow-[#8C2963]/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <CircularProgress size={22} color="inherit" /> : <><ShieldCheck size={18} /> {t('auth.verify.verifyButton')}</>}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-pink-400/50 text-white font-medium py-3 rounded-xl transition-all duration-200 text-sm backdrop-blur-sm"
                    >
                        <ArrowLeft size={16} /> {t('auth.backToLogin')}
                    </button>
                </div>
            </AuthLayout>
        </>
    );
};

export default VerifyAccountScreen;
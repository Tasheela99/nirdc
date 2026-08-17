import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {TextField, CircularProgress, InputAdornment} from "@mui/material";
import {useAlert} from "../../components/common/AlertContextScreen.tsx";
import authApi from "../../api/AuthApi";
import {ApiResponse} from "../../utils/ApiResponse.ts";
import AuthLayout from "../../components/layout/AuthLayout.tsx";
import {Mail, Smartphone, ArrowLeft, RefreshCw} from "lucide-react";
import { useTranslation } from "react-i18next";

const VerifyMobilePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {email: urlEmail} = useParams();
    const [email, setEmail] = useState<string>(urlEmail || "");
    const [otp, setOtp] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const {showAlert} = useAlert();

    useEffect(() => {
        if (urlEmail) setEmail(urlEmail);
    }, [urlEmail]);

    const handleVerifyOtp = async () => {
        if (!email || !otp) {
            showAlert(t('messages.bothEmailOtpRequired'), "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = (await authApi.verifyPhoneOtp({email, mobileOtp: otp})) as ApiResponse;
            if (response?.status === true) {
                showAlert(t('messages.mobileVerified'), "success");
                setTimeout(() => navigate("/login", {replace: true}), 2000);
            } else {
                showAlert(response?.message || t('messages.mobileOtpFailed'), "error");
            }
        } catch {
            showAlert(t('messages.incorrectOtp'), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Verify Mobile"
            subtitle={urlEmail ? "Enter the OTP sent to your mobile" : "Enter your email and the OTP sent to your mobile"}
            brandingHeading="Mobile Verification"
            brandingText="Enter the verification code sent to your registered mobile number to complete the process."
        >
            <div className="space-y-4">
                {!urlEmail && (
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
                    label="Mobile OTP"
                    type="text"
                    fullWidth
                    value={otp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                    required
                    inputProps={{maxLength: 6}}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Smartphone size={18} className="text-gray-400" />
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
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : <><Smartphone size={18} /> Verify Mobile</>}
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
    );
};

export default VerifyMobilePage;

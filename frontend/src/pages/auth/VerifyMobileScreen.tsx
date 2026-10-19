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
                    label="Mobile OTP"
                    type="text"
                    fullWidth
                    value={otp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                    required
                    inputProps={{maxLength: 6}}
                    sx={glassInputSx}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Smartphone size={18} className="text-white/60" />
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
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8C2963] via-[#a03273] to-[#6B1D4A] hover:from-[#9C3872] hover:to-[#8C2963] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#8C2963]/30 hover:shadow-xl hover:shadow-[#8C2963]/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : <><Smartphone size={18} /> Verify Mobile</>}
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
    );
};

export default VerifyMobilePage;

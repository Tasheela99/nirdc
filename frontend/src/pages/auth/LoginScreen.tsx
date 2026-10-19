import { useState, FormEvent, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    TextField,
    CircularProgress,
    InputAdornment,
    IconButton
} from "@mui/material";
import { useAlert } from "../../components/common/AlertContextScreen.tsx";
import authApi from "../../api/AuthApi";
import UserContext from "../../store/UserContext.tsx";
import logo from "../../assets/NIRDC-logo-SVG.svg";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import { Mail, Eye, EyeOff, LogIn, UserPlus, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import VantaNetBackground from "../../components/common/VantaNetBackground.tsx";

const ENCRYPTION_KEY = import.meta.env.VITE_APP_ENCRYPTION_KEY;

interface ErrorMessages {
    [key: string]: string;
}

const LoginScreen = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { showAlert } = useAlert();
    const { updateUserInfo } = useContext(UserContext);

    const encryptData = (data: any): string => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const errorMessages: ErrorMessages = {
            "USER_NOT_FOUND": "User not found. Please register first.",
            "INCORRECT_PASSWORD": "Incorrect password. Please try again.",
            "NOT_VERIFIED": "Please verify your email address before signing in.",
            "USER_DEACTIVATED": "Your account has been deactivated. Please contact support.",
            "AUTH_RATE_LIMITED": "Too many login attempts. Please try again after 15 minutes.",
            "Network Error": "Network error occurred. Please check your connection.",
            "default": "An unexpected error occurred. Please try again."
        };

        try {
            const response = await authApi.signIn({ email, password }) as any;

            if (response?.status && response.token) {
                const token = response.token;
                const encryptedToken = encryptData(token);
                const decodedToken: any = jwtDecode(token);

                const userData = {
                    email: decodedToken.email,
                    role: decodedToken.role,
                    id: decodedToken.id,
                    userName: decodedToken.userName,
                };

                const encryptedUserData = encryptData(userData);
                localStorage.setItem("token", encryptedToken);
                localStorage.setItem("userInfo", encryptedUserData);

                updateUserInfo(userData, token);

                // Check if user must change password (first login for directors)
                if (response.mustChangePassword) {
                    navigate("/force-change-password", { replace: true });
                    showAlert(t('messages.changeTempPassword'), "warning");
                    return;
                }

                if (userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") {
                    navigate(location.state?.redirectTo || "/dashboard", { replace: true });
                } else if (userData.role === "REVIEWER") {
                    navigate(location.state?.redirectTo || "/reviewer/proposals", { replace: true });
                } else if (userData.role === "DIRECTOR") {
                    navigate(location.state?.redirectTo || "/dashboard", { replace: true });
                } else {
                    navigate(location.state?.redirectTo || "/", { replace: true });
                }
                showAlert(t('messages.loginSuccess'), "success");
            } else {
                const errorMessage = errorMessages[response?.label || "default"];
                showAlert(errorMessage, "error");
            }
        } catch (error: any) {
            let errorMessage = errorMessages["default"];

            if (error.response) {
                const status = error.response.status;
                const errorData = error.response.data;

                if (status === 429) {
                    errorMessage = errorData?.message || "Too many login attempts. Please try again later.";
                } else if (errorData) {
                    errorMessage = errorMessages[errorData.label] ||
                        errorData.message ||
                        errorMessages["default"];
                }
            } else if (error.request) {
                errorMessage = errorMessages["Network Error"];
            } else {
                errorMessage = error.message || errorMessages["default"];
            }

            showAlert(errorMessage, "error");
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
        <div className="relative min-h-[calc(100vh-80px)] sm:min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 bg-gradient-to-b from-[#0b0c14] via-[#06070a] to-[#020204]">
            {/* Background Glows for depth */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-white/[0.08] rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-white/[0.04] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-10 right-10 w-72 h-72 bg-white/[0.04] rounded-full blur-[100px] pointer-events-none" />

            {/* 3D Vanta Net Animated Background */}
            <VantaNetBackground
                color={0xFF0B132B}
                backgroundColor={0x0b0208}
                points={18.0}
                maxDistance={42.0}
                spacing={28.0}
                showDots={true}
            />

            {/* Glassmorphic Login Container */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden border border-white/25 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)]"
                style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.05) 100%)",
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left — Branding Panel (Frosted White Glass) */}
                    <div className="hidden md:flex flex-col items-center justify-center p-10 text-center relative overflow-hidden border-r border-white/15 bg-gradient-to-br from-white/[0.12] via-white/[0.05] to-black/30 backdrop-blur-xl">
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                        <img
                            src={logo}
                            alt="NIRDC Logo"
                            className="w-48 h-auto mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                        />
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight drop-shadow-sm">{t('auth.welcomeBack')}</h2>
                        <p className="text-white/80 text-sm max-w-xs leading-relaxed font-light">
                            {t('auth.welcomeSubtext')}
                        </p>
                    </div>

                    {/* Right — Login Form (Glassmorphism) */}
                    <div className="p-8 sm:p-10 relative">
                        <div className="text-center mb-8">
                            {/* Mobile logo */}
                            <img
                                src={logo}
                                alt="NIRDC Logo"
                                className="w-32 h-auto mx-auto mb-4 md:hidden drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
                            />
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                                {t('auth.signIn')}
                            </h1>
                            <p className="text-sm text-white/70 mt-1.5 font-light">
                                {t('auth.enterCredentials')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <TextField
                                label={t('auth.email')}
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={glassInputSx}
                                onKeyDown={(e) => {
                                    if (e.key === " ") e.preventDefault();
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Mail size={18} className="text-white/60" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                label={t('auth.password')}
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                type={showPassword ? "text" : "password"}
                                sx={glassInputSx}
                                onKeyDown={(e) => {
                                    if (e.key === " ") e.preventDefault();
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                                size="small"
                                                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                            >
                                                {showPassword
                                                    ? <Eye size={18} className="text-pink-300" />
                                                    : <EyeOff size={18} className="text-white/50" />
                                                }
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                autoComplete="current-password"
                            />

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate("/forgotten-password")}
                                    className="text-sm text-pink-300 hover:text-pink-200 hover:underline font-medium transition-colors"
                                >
                                    {t('auth.forgotPassword')}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8C2963] via-[#a03273] to-[#6B1D4A] hover:from-[#9C3872] hover:to-[#8C2963] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#8C2963]/30 hover:shadow-xl hover:shadow-[#8C2963]/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                {isLoading ? (
                                    <CircularProgress size={22} color="inherit" />
                                ) : (
                                    <>
                                        <LogIn size={18} />
                                        {t('auth.signInButton')}
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-2">
                                <div className="flex-1 h-px bg-white/15" />
                                <span className="text-xs text-white/60 uppercase tracking-wider">{t('auth.or')}</span>
                                <div className="flex-1 h-px bg-white/15" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-white/15 border border-white/20 hover:border-pink-400/50 text-white font-semibold px-2.5 sm:px-3 py-2.5 rounded-xl transition-all duration-200 text-xs sm:text-xs md:text-sm min-h-[44px] overflow-hidden backdrop-blur-sm"
                                >
                                    <UserPlus size={16} className="shrink-0 text-pink-300" />
                                    <span className="truncate">{t('auth.createAccount')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/security/verify-account")}
                                    className="flex items-center justify-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-white/15 border border-white/20 hover:border-pink-400/50 text-white font-semibold px-2.5 sm:px-3 py-2.5 rounded-xl transition-all duration-200 text-xs sm:text-xs md:text-sm min-h-[44px] overflow-hidden backdrop-blur-sm"
                                >
                                    <ShieldCheck size={16} className="shrink-0 text-pink-300" />
                                    <span className="truncate">{t('auth.verifyAccount')}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginScreen;
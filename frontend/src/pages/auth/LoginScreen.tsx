import {useState, FormEvent, useContext} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {
    TextField,
    CircularProgress,
    InputAdornment,
    IconButton
} from "@mui/material";
import {useAlert} from "../../components/common/AlertContextScreen.tsx";
import authApi from "../../api/AuthApi";
import UserContext from "../../store/UserContext.tsx";
import logo from "../../assets/NIRDC-logo-SVG.svg";
import CryptoJS from "crypto-js";
import {jwtDecode} from "jwt-decode";
import {Mail, Eye, EyeOff, LogIn, UserPlus, ShieldCheck} from "lucide-react";
import {motion} from "framer-motion";
import { useTranslation } from "react-i18next";

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
    const {showAlert} = useAlert();
    const {updateUserInfo} = useContext(UserContext);

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
            const response = await authApi.signIn({email, password}) as any;

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
                    navigate("/force-change-password", {replace: true});
                    showAlert(t('messages.changeTempPassword'), "warning");
                    return;
                }

                if (userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") {
                    navigate(location.state?.redirectTo || "/dashboard", {replace: true});
                } else if (userData.role === "REVIEWER") {
                    navigate(location.state?.redirectTo || "/reviewer/proposals", {replace: true});
                } else if (userData.role === "DIRECTOR") {
                    navigate(location.state?.redirectTo || "/dashboard", {replace: true});
                } else {
                    navigate(location.state?.redirectTo || "/", {replace: true});
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

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-surface dark:bg-dark-bg px-4 py-10">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="w-full max-w-4xl bg-white dark:bg-dark-surface rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-border"
            >
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left — Branding Panel */}
                    <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-10 text-center">
                        <img
                            src={logo}
                            alt="NIRDC Logo"
                            className="w-48 h-auto mb-6 brightness-0 invert"
                        />
                        <h2 className="text-xl font-bold text-white mb-2">{t('auth.welcomeBack')}</h2>
                        <p className="text-white/70 text-sm max-w-xs leading-relaxed">
                            {t('auth.welcomeSubtext')}
                        </p>
                    </div>

                    {/* Right — Login Form */}
                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-8">
                            {/* Mobile logo */}
                            <img
                                src={logo}
                                alt="NIRDC Logo"
                                className="w-24 h-auto mx-auto mb-4 md:hidden"
                            />
                            <h1 className="text-2xl font-bold text-text-primary dark:text-white">
                                {t('auth.signIn')}
                            </h1>
                            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
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
                                onKeyDown={(e) => {
                                    if (e.key === " ") e.preventDefault();
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Mail size={18} className="text-gray-400" />
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
                                            >
                                                {showPassword
                                                    ? <Eye size={18} className="text-gray-500" />
                                                    : <EyeOff size={18} className="text-gray-400" />
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
                                    className="text-sm text-primary dark:text-gold hover:underline font-medium transition-colors"
                                >
                                    {t('auth.forgotPassword')}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8C2963] to-[#6B1D4A] hover:from-[#9C3872] hover:to-[#8C2963] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-[#6B1D4A]/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
                                <div className="flex-1 h-px bg-gray-200 dark:bg-[#331A2A]" />
                                <span className="text-xs text-text-secondary dark:text-[#B592A6] uppercase tracking-wider">{t('auth.or')}</span>
                                <div className="flex-1 h-px bg-gray-200 dark:bg-[#331A2A]" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="flex items-center justify-center gap-1.5 sm:gap-2 border border-[#8C2963]/50 dark:border-[#8C2963]/60 text-primary dark:text-[#E2A6C7] hover:bg-[#6B1D4A]/10 dark:hover:bg-[#8C2963]/20 font-semibold px-2.5 sm:px-3 py-2.5 rounded-xl transition-all duration-200 text-xs sm:text-xs md:text-sm min-h-[44px] overflow-hidden"
                                >
                                    <UserPlus size={16} className="shrink-0" />
                                    <span className="truncate">{t('auth.createAccount')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/security/verify-account")}
                                    className="flex items-center justify-center gap-1.5 sm:gap-2 border border-gray-300 dark:border-[#381C2E] text-gray-700 dark:text-gray-300 hover:border-[#6B1D4A] hover:text-primary dark:hover:border-[#9C3872] dark:hover:text-[#E2A6C7] font-semibold px-2.5 sm:px-3 py-2.5 rounded-xl transition-all duration-200 text-xs sm:text-xs md:text-sm min-h-[44px] overflow-hidden"
                                >
                                    <ShieldCheck size={16} className="shrink-0" />
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
import { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAlert } from "../../components/common/AlertContextScreen.tsx";
import UserContext from "../../store/UserContext.tsx";
import authApi from "../../api/AuthApi.ts";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import VantaNetBackground from "../../components/common/VantaNetBackground.tsx";

const ForceChangePasswordScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { userInfo } = useContext(UserContext);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            showAlert(t('messages.newPasswordMinLength'), "error");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            showAlert(t('messages.newPasswordsDoNotMatch'), "error");
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.changePassword({
                oldPassword,
                newPassword,
                confirmNewPassword,
            }) as any;

            if (response?.status) {
                showAlert(t('messages.passwordChangeSuccess'), "success");
                // Redirect based on role
                if (userInfo?.role === "ADMIN" || userInfo?.role === "SUPER_ADMIN") {
                    navigate("/admin", { replace: true });
                } else if (userInfo?.role === "DIRECTOR") {
                    navigate("/director", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            } else {
                showAlert(response?.message || t('messages.passwordChangeFailed'), "error");
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || t('messages.passwordChangeFailed');
            showAlert(msg, "error");
        } finally {
            setIsLoading(false);
        }
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

            <div className="relative z-10 w-full max-w-md">
                {/* Glassmorphic Card */}
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="rounded-3xl overflow-hidden border border-white/25 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)]"
                    style={{
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.05) 100%)",
                    }}
                >
                    {/* Header */}
                    <div className="p-8 text-center border-b border-white/15 bg-gradient-to-br from-white/[0.12] via-white/[0.05] to-black/30 backdrop-blur-xl">
                        <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-white/20 backdrop-blur-md">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">Change Your Password</h1>
                        <p className="text-white/70 text-sm mt-1.5 font-light">
                            You must change your temporary password before continuing
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        {/* Current/Temp Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                                Current (Temporary) Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                                <input
                                    type={showOld ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-10 py-3 bg-white/[0.08] border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#e279b5] focus:ring-1 focus:ring-[#e279b5] transition-all backdrop-blur-[8px]"
                                    placeholder="Enter your temporary password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOld(!showOld)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                                >
                                    {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-10 py-3 bg-white/[0.08] border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#e279b5] focus:ring-1 focus:ring-[#e279b5] transition-all backdrop-blur-[8px]"
                                    placeholder="Create a new password (min 8 chars)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                                >
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-10 py-3 bg-white/[0.08] border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#e279b5] focus:ring-1 focus:ring-[#e279b5] transition-all backdrop-blur-[8px]"
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#8C2963]/30 hover:shadow-xl hover:shadow-[#8C2963]/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 bg-gradient-to-r from-[#8C2963] via-[#a03273] to-[#6B1D4A] hover:from-[#9C3872] hover:to-[#8C2963]"
                        >
                            {isLoading ? (
                                <CircularProgress size={20} sx={{ color: 'white' }} />
                            ) : (
                                <>
                                    <ShieldCheck size={18} />
                                    Change Password & Continue
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ForceChangePasswordScreen;

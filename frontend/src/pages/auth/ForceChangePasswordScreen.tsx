import { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAlert } from "../../components/common/AlertContextScreen.tsx";
import UserContext from "../../store/UserContext.tsx";
import authApi from "../../api/AuthApi.ts";
import { useTranslation } from "react-i18next";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div
                        className="p-6 text-center"
                        style={{ background: 'linear-gradient(135deg, #001d4a 0%, #003893 100%)' }}
                    >
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Change Your Password</h1>
                        <p className="text-white/70 text-sm mt-1">
                            You must change your temporary password before continuing
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Current/Temp Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Current (Temporary) Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showOld ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all"
                                    placeholder="Enter your temporary password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOld(!showOld)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all"
                                    placeholder="Create a new password (min 8 chars)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all"
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #003893, #2E86C1)' }}
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
                </div>
            </div>
        </div>
    );
};

export default ForceChangePasswordScreen;

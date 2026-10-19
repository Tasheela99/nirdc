import { FC, ReactNode } from "react";
import logo from "../../assets/NIRDC-logo-SVG.svg";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import VantaNetBackground from "../common/VantaNetBackground.tsx";

interface AuthLayoutProps {
    title: string;
    subtitle?: string;
    brandingHeading?: string;
    brandingText?: string;
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({
    title,
    subtitle,
    brandingHeading,
    brandingText,
    children,
}) => {
    const { t } = useTranslation();
    const heading = brandingHeading || t('auth.brandName');
    const text = brandingText || t('auth.brandText');

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

            {/* Glassmorphic Auth Card */}
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
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight drop-shadow-sm">{heading}</h2>
                        <p className="text-white/80 text-sm max-w-xs leading-relaxed font-light">
                            {text}
                        </p>
                    </div>

                    {/* Right — Form Container */}
                    <div className="p-8 sm:p-10 relative">
                        <div className="text-center mb-6">
                            <img
                                src={logo}
                                alt="NIRDC Logo"
                                className="w-32 h-auto mx-auto mb-4 md:hidden drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
                            />
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-sm text-white/70 mt-1.5 font-light">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {children}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthLayout;

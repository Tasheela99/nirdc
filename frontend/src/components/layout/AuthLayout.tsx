import {FC, ReactNode} from "react";
import logo from "../../assets/NIRDC-logo-SVG.svg";
import {motion} from "framer-motion";
import { useTranslation } from "react-i18next";

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
        <div className="min-h-[80vh] flex items-center justify-center bg-surface dark:bg-dark-bg px-4 py-10">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="w-full max-w-4xl bg-white dark:bg-dark-surface rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-border"
            >
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left — Branding */}
                    <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-[#5D1840] via-[#4C1333] to-[#360C23] p-10 text-center">
                        <img
                            src={logo}
                            alt="NIRDC Logo"
                            className="w-48 h-auto mb-6 brightness-0 invert"
                        />
                        <h2 className="text-xl font-bold text-white mb-2">{heading}</h2>
                        <p className="text-white/70 text-sm max-w-xs leading-relaxed">
                            {text}
                        </p>
                    </div>

                    {/* Right — Form */}
                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-6">
                            <img
                                src={logo}
                                alt="NIRDC Logo"
                                className="w-24 h-auto mx-auto mb-4 md:hidden"
                            />
                            <h1 className="text-2xl font-bold text-text-primary dark:text-white">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
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

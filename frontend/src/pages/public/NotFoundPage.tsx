import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import logo from "@/assets/NIRDC-logo-SVG.svg";
import { useTranslation } from "react-i18next";

const NotFoundScreen = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-surface dark:bg-dark-bg px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-lg text-center"
            >
                {/* Logo */}
                <motion.img
                    src={logo}
                    alt="NIRDC Logo"
                    className="w-20 h-auto mx-auto mb-8 opacity-30 dark:opacity-20"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                />

                {/* 404 Number */}
                <motion.h1
                    className="text-[8rem] sm:text-[10rem] font-extrabold leading-none bg-gradient-to-br from-primary to-primary-dark bg-clip-text text-transparent select-none"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 120 }}
                >
                    404
                </motion.h1>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <h2 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white mb-2">
                        {t('notFound.title')}
                    </h2>
                    <p className="text-text-secondary dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                        {t('notFound.description')}
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                >
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto"
                    >
                        <Home size={18} />
                        {t('notFound.backToHome')}
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:border-primary-light dark:hover:text-primary-light font-medium px-6 py-2.5 rounded-xl transition-all duration-200 w-full sm:w-auto"
                    >
                        <ArrowLeft size={16} />
                        {t('notFound.goBack')}
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFoundScreen;

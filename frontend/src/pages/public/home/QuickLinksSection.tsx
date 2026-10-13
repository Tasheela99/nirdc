import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type QuickLink = {
    key: string;
    url: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    background: string;
    glow: string;
};

const QuickLinksSection: React.FC = () => {
    const { t } = useTranslation();

    const links: QuickLink[] = [
        {
            key: "presidents-office",
            url: "https://www.presidentsoffice.gov.lk/",
            icon: (
                <img
                    src="/presidentsoffice_logo.png"
                    alt="President's Office"
                    className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow"
                />
            ),
            title: t("quickLinks.presidentsOffice.title", "President's Office"),
            description: t(
                "quickLinks.presidentsOffice.description",
                "Official website of the Presidential Secretariat of Sri Lanka."
            ),
            background:
                "linear-gradient(145deg, rgba(140, 41, 99, 0.45) 0%, rgba(100, 20, 65, 0.25) 100%)",
            glow: "rgba(140, 41, 99, 0.25)",
        },
        {
            key: "clean-sri-lanka",
            url: "https://cleansrilanka.gov.lk/",
            icon: (
                <img
                    src="/cleansrilanka_logo.png"
                    alt="Clean Sri Lanka"
                    className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow"
                />
            ),
            title: t("quickLinks.cleanSriLanka.title", "Clean Sri Lanka"),
            description: t(
                "quickLinks.cleanSriLanka.description",
                "Official website of the Clean Sri Lanka National Programme."
            ),
            background:
                "linear-gradient(145deg, rgba(40, 160, 110, 0.28) 0%, rgba(16, 90, 70, 0.15) 100%)",
            glow: "rgba(40, 160, 110, 0.20)",
        },
        {
            key: "prajashakthi",
            url: "https://www.prajashakthi.gov.lk/",
            icon: (
                <img
                    src="/praajashakthi_logo.webp"
                    alt="Prajashakthi"
                    className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow"
                />
            ),
            title: t("quickLinks.prajashakthi.title", "Prajashakthi"),
            description: t(
                "quickLinks.prajashakthi.description",
                "Official website of the Prajashakthi National Programme."
            ),
            background:
                "linear-gradient(145deg, rgba(175, 105, 65, 0.30) 0%, rgba(105, 55, 30, 0.16) 100%)",
            glow: "rgba(175, 105, 65, 0.20)",
        },
    ];

    return (
        <div
            id="quick-links-section"
            className="w-full pt-8 sm:pt-12 lg:pt-16 pb-8"
            aria-label="Quick Links"
        >
            {/* Quick link cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full">
                {links.map((link, i) => (
                    <motion.a
                        key={link.key}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.title}
                        className="group relative flex flex-col rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 overflow-hidden outline-none border-0 focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer"
                        style={{
                            background: link.background,
                            border: "none",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                            boxShadow: `0 8px 32px ${link.glow}`,
                        }}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                        whileHover={{ y: -6 }}
                    >
                        {/* Inner gloss sheen matching main banner */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    "linear-gradient(160deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)",
                            }}
                        />

                        {/* Hover glow */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{
                                background: "rgba(255, 255, 255, 0.06)",
                            }}
                        />

                        <div
                            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white mb-6 p-2"
                            style={{
                                background: "rgba(255, 255, 255, 0.14)",
                                border: "none",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                            }}
                        >
                            {link.icon}
                        </div>

                        <h3 className="relative text-2xl sm:text-[28px] leading-tight font-extrabold text-white mb-2 tracking-tight drop-shadow-sm group-hover:text-pink-100 transition-colors duration-200">
                            {link.title}
                        </h3>
                        <p className="relative text-base text-white/90 leading-relaxed">{link.description}</p>
                    </motion.a>
                ))}
            </div>
        </div>
    );
};

export default QuickLinksSection;
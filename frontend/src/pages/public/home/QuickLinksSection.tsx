import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import homePageContentApi, { PartnerCardData } from "@/api/HomePageContentApi";

const THEMES = [
    {
        background: "linear-gradient(145deg, rgba(140, 41, 99, 0.45) 0%, rgba(100, 20, 65, 0.25) 100%)",
        glow: "rgba(140, 41, 99, 0.25)",
        hoverColor: "group-hover:text-pink-100",
    },
    {
        background: "linear-gradient(145deg, rgba(40, 160, 110, 0.28) 0%, rgba(16, 90, 70, 0.15) 100%)",
        glow: "rgba(40, 160, 110, 0.20)",
        hoverColor: "group-hover:text-emerald-100",
    },
    {
        background: "linear-gradient(145deg, rgba(175, 105, 65, 0.30) 0%, rgba(105, 55, 30, 0.16) 100%)",
        glow: "rgba(175, 105, 65, 0.20)",
        hoverColor: "group-hover:text-amber-100",
    },
    {
        background: "linear-gradient(145deg, rgba(59, 130, 246, 0.35) 0%, rgba(30, 58, 138, 0.20) 100%)",
        glow: "rgba(59, 130, 246, 0.22)",
        hoverColor: "group-hover:text-blue-100",
    },
    {
        background: "linear-gradient(145deg, rgba(168, 85, 247, 0.35) 0%, rgba(88, 28, 135, 0.20) 100%)",
        glow: "rgba(168, 85, 247, 0.22)",
        hoverColor: "group-hover:text-purple-100",
    },
    {
        background: "linear-gradient(145deg, rgba(234, 88, 12, 0.32) 0%, rgba(124, 45, 18, 0.20) 100%)",
        glow: "rgba(234, 88, 12, 0.20)",
        hoverColor: "group-hover:text-orange-100",
    },
];

const QuickLinksSection: React.FC = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || "en";
    const langKey: "en" | "si" | "ta" = currentLang.startsWith("si")
        ? "si"
        : currentLang.startsWith("ta")
        ? "ta"
        : "en";

    const [partnerCards, setPartnerCards] = useState<PartnerCardData[]>([]);

    useEffect(() => {
        let isMounted = true;
        homePageContentApi
            .getPartnerCards()
            .then((res) => {
                if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
                    setPartnerCards(res.data);
                }
            })
            .catch((err) => {
                console.error("Failed to load partner cards:", err);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Fallback default cards in case database returns empty or during network load
    const fallbackCards: PartnerCardData[] = [
        {
            _id: "presidents-office",
            title: {
                en: t("quickLinks.presidentsOffice.title", "President's Office"),
                si: "ජනාධිපති කාර්යාලය",
                ta: "ஜனாதிபதி செயலகம்",
            },
            description: {
                en: t(
                    "quickLinks.presidentsOffice.description",
                    "Official website of the Presidential Secretariat of Sri Lanka."
                ),
                si: "ශ්‍රී ලංකා ජනාධිපති කාර්යාලයේ නිල වෙබ් අඩවිය.",
                ta: "இலங்கை ஜனாதிபதி செயலகத்தின் உத்தியோகபூர்வ இணையதளம்.",
            },
            logoUrl: "/presidentsoffice_logo.png",
            linkUrl: "https://www.presidentsoffice.gov.lk/",
            order: 1,
            isActive: true,
        },
        {
            _id: "clean-sri-lanka",
            title: {
                en: t("quickLinks.cleanSriLanka.title", "Clean Sri Lanka"),
                si: "ක්ලීන් ශ්‍රී ලංකා",
                ta: "Clean Sri Lanka",
            },
            description: {
                en: t(
                    "quickLinks.cleanSriLanka.description",
                    "Official website of the Clean Sri Lanka National Programme."
                ),
                si: "ක්ලීන් ශ්‍රී ලංකා ජාතික වැඩසටහනේ නිල වෙබ් අඩවිය.",
                ta: "Clean Sri Lanka தேசிய திட்டத்தின் உத்தியோகபூர்வ இணையதளம்.",
            },
            logoUrl: "/cleansrilanka_logo.png",
            linkUrl: "https://cleansrilanka.gov.lk/",
            order: 2,
            isActive: true,
        },
        {
            _id: "prajashakthi",
            title: {
                en: t("quickLinks.prajashakthi.title", "Prajashakthi"),
                si: "ප්‍රජාශක්ති",
                ta: "பிரஜாசக்தி",
            },
            description: {
                en: t(
                    "quickLinks.prajashakthi.description",
                    "Official website of the Prajashakthi National Programme."
                ),
                si: "ප්‍රජාශක්ති වැඩසටහනේ නිල වෙබ් අඩවිය.",
                ta: "பிரஜாசக்தி தேசிய திட்டத்தின் உத்தியோகபூர்வ இணையதளம்.",
            },
            logoUrl: "/praajashakthi_logo.webp",
            linkUrl: "https://www.prajashakthi.gov.lk/",
            order: 3,
            isActive: true,
        },
    ];

    const displayCards = partnerCards.length > 0 ? partnerCards : fallbackCards;

    return (
        <div
            id="quick-links-section"
            className="w-full pt-8 sm:pt-12 lg:pt-16 pb-8"
            aria-label="Quick Links"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full">
                {displayCards.map((card, i) => {
                    const theme = THEMES[i % THEMES.length];
                    const title =
                        (typeof card.title === "string" ? card.title : card.title?.[langKey]) ||
                        (typeof card.title === "object" ? card.title?.en || card.title?.si || card.title?.ta : "") ||
                        "";
                    const description =
                        (typeof card.description === "string" ? card.description : card.description?.[langKey]) ||
                        (typeof card.description === "object" ? card.description?.en || card.description?.si || card.description?.ta : "") ||
                        "";
                    const key = card._id || `partner-card-${i}`;

                    return (
                        <motion.a
                            key={key}
                            href={card.linkUrl || "#"}
                            target={card.linkUrl && card.linkUrl !== "#" ? "_blank" : undefined}
                            rel={card.linkUrl && card.linkUrl !== "#" ? "noopener noreferrer" : undefined}
                            aria-label={title}
                            className="group relative flex flex-col rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 overflow-hidden outline-none border-0 focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer"
                            style={{
                                background: theme.background,
                                border: "none",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                boxShadow: `0 8px 32px ${theme.glow}`,
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
                                {card.logoUrl ? (
                                    <img
                                        src={card.logoUrl}
                                        alt={title}
                                        className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLElement).style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <ExternalLink className="w-8 h-8 text-white/80" />
                                )}
                            </div>

                            <h3 className={`relative text-2xl sm:text-[28px] leading-tight font-extrabold text-white mb-2 tracking-tight drop-shadow-sm ${theme.hoverColor} transition-colors duration-200`}>
                                {title}
                            </h3>
                            <p className="relative text-base text-white/90 leading-relaxed">{description}</p>
                        </motion.a>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickLinksSection;
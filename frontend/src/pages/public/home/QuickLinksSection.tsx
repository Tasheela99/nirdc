import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import homePageContentApi, { PartnerCardData } from "@/api/HomePageContentApi";

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
            description: { en: "", si: "", ta: "" },
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
            description: { en: "", si: "", ta: "" },
            logoUrl: "/cleansrilanka_logo.webp",
            linkUrl: "https://www.cleansrilanka.gov.lk/",
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
            description: { en: "", si: "", ta: "" },
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
            className="w-full pt-4 sm:pt-6 pb-4"
            aria-label="Quick Links"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 w-full">
                {displayCards.map((card, i) => {
                    const title =
                        (typeof card.title === "string" ? card.title : card.title?.[langKey]) ||
                        (typeof card.title === "object" ? card.title?.en || card.title?.si || card.title?.ta : "") ||
                        "";
                    const key = card._id || `partner-card-${i}`;

                    const isCleanSriLanka =
                        Boolean(card.linkUrl && card.linkUrl.toLowerCase().includes("clean")) ||
                        Boolean(card.logoUrl && card.logoUrl.toLowerCase().includes("clean")) ||
                        Boolean(card._id && String(card._id).toLowerCase().includes("clean")) ||
                        title.toLowerCase().includes("clean") ||
                        title.includes("ක්ලීන්") ||
                        title.includes("க்ளீன்");

                    return (
                        <motion.a
                            key={key}
                            href={card.linkUrl || "#"}
                            target={card.linkUrl && card.linkUrl !== "#" ? "_blank" : undefined}
                            rel={card.linkUrl && card.linkUrl !== "#" ? "noopener noreferrer" : undefined}
                            aria-label={title}
                            className="group relative flex flex-row items-center gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 overflow-hidden outline-none cursor-pointer bg-white transition-all duration-200 border border-slate-200/90 hover:border-black/30 shadow-xs hover:shadow-md"
                            style={{
                                background: "#ffffff",
                                boxShadow: "0 4px 18px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                            whileHover={{ y: -3, scale: 1.01 }}
                        >
                            {/* Logo Container - Clean Sri Lanka has white text so needs a forest green badge to be clearly visible */}
                            <div
                                className={`relative w-20 sm:w-24 h-14 sm:h-16 rounded-xl flex items-center justify-center shrink-0 p-2 shadow-xs transition-colors ${isCleanSriLanka
                                    ? "bg-[#1b4332] border border-[#2d6a4f]"
                                    : "bg-white border border-slate-200/80"
                                    }`}
                            >
                                {card.logoUrl ? (
                                    <img
                                        src={isCleanSriLanka ? "/cleansrilanka_logo.png" : card.logoUrl}
                                        alt={title}
                                        className="w-full h-full max-h-12 object-contain"
                                        onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement;
                                            if (target.src.includes(".webp")) {
                                                target.src = target.src.replace(".webp", ".png");
                                            } else if (target.src.includes(".png")) {
                                                target.src = target.src.replace(".png", ".webp");
                                            }
                                        }}
                                    />
                                ) : (
                                    <ExternalLink className="w-6 h-6 text-slate-400" />
                                )}
                            </div>

                            {/* Title (Right of the Icon) */}
                            <h3 className="relative text-base sm:text-lg font-bold text-slate-800 tracking-tight transition-colors duration-200 leading-snug group-hover:text-primary">
                                {title}
                            </h3>
                        </motion.a>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickLinksSection;

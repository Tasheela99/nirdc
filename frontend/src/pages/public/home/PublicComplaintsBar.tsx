import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Megaphone, ArrowRight } from "lucide-react";

interface PublicComplaintsBarProps {
  className?: string;
}

const PublicComplaintsBar: React.FC<PublicComplaintsBarProps> = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || "en").toLowerCase();
  const langKey: "en" | "si" | "ta" = currentLang.startsWith("si")
    ? "si"
    : currentLang.startsWith("ta")
      ? "ta"
      : "en";

  const content = {
    si: {
      title: "මහජන පැමිණිලි",
      description:
        "ඔබගේ ගැටළු හෝ පැමිණිලි සෘජුවම NIRDC නිලධාරී මණ්ඩලය වෙත යොමු කරන්න.",
      buttonText: "පැමිණිලි ඉදිරිපත් කරන්න",
    },
    ta: {
      title: "பொது மக்கள் முறைப்பாடுகள்",
      description:
        "உங்கள் முறைப்பாடுகள் அல்லது குறைகளை நேரடியாக NIRDC அதிகாரிகளிடம் சமர்ப்பிக்கவும்.",
      buttonText: "முறைப்பாட்டை சமர்ப்பிக்கவும்",
    },
    en: {
      title: "Public Complaints",
      description:
        "Submit your grievances or complaints directly to the NIRDC directorate.",
      buttonText: "Submit Complaint",
    },
  };

  const currentContent = content[langKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className={`relative rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 border-0 overflow-hidden ${className}`}
      style={{
        background: "#ffffff",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
        {/* Left: Icon & Text */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-center shrink-0 shadow-xs">
            <Megaphone size={28} className="text-slate-900 drop-shadow-sm" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentContent.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {currentContent.description}
            </p>
          </div>
        </div>

        {/* Right: CTA Button */}
        <div className="shrink-0 self-start sm:self-auto pt-2 lg:pt-0">
          <Link
            to="/contact-us"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-xl font-bold text-black border border-black bg-white hover:bg-black hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-95 group text-sm sm:text-base cursor-pointer"
          >
            <span>{currentContent.buttonText}</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicComplaintsBar;

import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import { Download, Search, FileText, Calendar, Tag, HardDrive } from "lucide-react";
import { useTranslation } from "react-i18next";
import DownloadApi, { DownloadData } from "@/api/DownloadApi";

interface CategoryTab {
  key: string;
  en: string;
  si: string;
  ta: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { key: "ALL", en: "All Downloads", si: "සියලු බාගත කිරීම්", ta: "அனைத்து பதிவிறக்கங்கள்" },
  { key: "CIRCULAR", en: "Circular Templates (PDF)", si: "චක්‍රලේඛ ආකෘති (PDF)", ta: "சுற்றறிக்கை படிவங்கள் (PDF)" },
  { key: "REPORT", en: "Report Templates", si: "වාර්තා ආකෘති", ta: "அறிக்கை படிவங்கள்" },
  { key: "ETHICS", en: "Code of Ethics Templates", si: "ආචාරධර්ම සංග්‍රහ ආකෘති", ta: "நெறிமுறை விதிகள் படிவங்கள்" },
  { key: "DOCUMENT", en: "Document Templates", si: "ලේඛන ආකෘති", ta: "ஆவணப் படிවங்கள்" },
  { key: "APPLICATION", en: "Job Application Forms", si: "තනතුරු සඳහා අයදුම්පත් ආකෘති", ta: "வேலை விண்ணப்பப் படிவங்கள்" },
  { key: "OTHER", en: "General Downloads", si: "සාමාන්‍ය බාගත කිරීම්", ta: "பொது பதிவிறக்கங்கள்" },
];

const fallbackDownloads: DownloadData[] = [
  {
    title: {
      en: "NIRDC Institutional Governance Circular 01/2026 (PDF)",
      si: "NIRDC ආයතනික පාලන චක්‍රලේඛය 01/2026 (PDF)",
      ta: "NIRDC நிறுவன ஆளுகை சுற்றறிக்கை 01/2026 (PDF)"
    },
    categoryKey: "CIRCULAR",
    category: { en: "Circular Templates", si: "චක්‍රලේඛ ආකෘති", ta: "சுற்றறிக்கை படிவங்கள்" },
    fileSize: "1.8 MB",
    fileType: "PDF",
    documentNumber: "CIR/2026/01",
    publishDate: "2026-01-15",
    fileUrl: "#",
    description: {
      en: "Official administrative circular outlining compliance benchmarks, expenditure authorizations, and statutory mandates.",
      si: "අනුකූලතා මිණුම් සලකුණු සහ වියදම් බලයලත් විස්තර සඳහන් නිල චක්‍රලේඛය.",
      ta: "அதிகாரப்பூர்வ சுற்றறிக்கை."
    }
  },
  {
    title: {
      en: "Quarterly R&D Commercialisation Progress Report Template",
      si: "කාර්තුමය පර්යේෂණ වාණිජකරණ ප්‍රගති වාර්තා ආකෘතිය",
      ta: "காலாண்டு ஆராய்ச்சி வர்த்தகமயமாக்கல் முன்னேற்ற அறிக்கை படிவம்"
    },
    categoryKey: "REPORT",
    category: { en: "Report Templates", si: "වාර්තා ආකෘති", ta: "அறிக்கை படிவங்கள்" },
    fileSize: "1.2 MB",
    fileType: "PDF",
    documentNumber: "REP/TMP/2026",
    publishDate: "2026-02-10",
    fileUrl: "#",
    description: {
      en: "Mandatory reporting document for university research teams and grant recipients tracking milestones and financial drawdown.",
      si: "පර්යේෂණ කණ්ඩායම් සහ ප්‍රතිලාභීන් සඳහා වන අනිවාර්ය ප්‍රගති වාර්තා ආකෘතිය.",
      ta: "முன்னேற்ற அறிக்கை படிவம்."
    }
  },
  {
    title: {
      en: "Institutional Code of Ethics & Professional Conduct Manual",
      si: "ආයතනික ආචාරධර්ම සංග්‍රහය සහ වෘත්තීය චර්යා අත්පොත",
      ta: "நிறுவன நெறிமுறைக் கோட்பாடு மற்றும் நடத்தை கையேடு"
    },
    categoryKey: "ETHICS",
    category: { en: "Code of Ethics Templates", si: "ආචාරධර්ම සංග්‍රහ ආකෘති", ta: "நெறிமுறை விதிகள் படிவங்கள்" },
    fileSize: "2.4 MB",
    fileType: "PDF",
    documentNumber: "ETH/MAN/2025",
    publishDate: "2025-11-20",
    fileUrl: "#",
    description: {
      en: "Ethical compliance principles, conflict-of-interest declarations, and scientific integrity standards for all affiliates.",
      si: "සියලු නිලධාරීන් සහ පර්යේෂකයින් අනුගමනය කළ යුතු ආචාරධර්මීය ප්‍රතිපත්ති සහ මූලධර්ම.",
      ta: "நெறிமுறை கோட்பாடுகள்."
    }
  },
  {
    title: {
      en: "Intellectual Property Disclosure & Assignment Template",
      si: "බුද්ධිමය දේපළ හෙළිදරව් කිරීමේ සහ පැවරීමේ ලේඛන ආකෘතිය",
      ta: "அறிவுசார் சொத்து வெளிப்படுத்தல் மற்றும் ஒப்படைப்பு படிவம்"
    },
    categoryKey: "DOCUMENT",
    category: { en: "Document Templates", si: "ලේඛන ආකෘති", ta: "ஆவணப் படிவங்கள்" },
    fileSize: "850 KB",
    fileType: "PDF",
    documentNumber: "DOC/IP/04",
    publishDate: "2026-01-08",
    fileUrl: "#",
    description: {
      en: "Standard statutory document for inventors and researchers registering proprietary technologies before commercialisation.",
      si: "තාක්ෂණය වාණිජකරණයට පෙර බුද්ධිමය දේපළ ලියාපදිංචි කිරීමේ සම්මත ආකෘතිය.",
      ta: "அறிவுசார் சொத்து படிவம்."
    }
  },
  {
    title: {
      en: "NIRDC Senior Research & Technical Staff Application Form",
      si: "ජ්‍යෙෂ්ඨ පර්යේෂණ සහ තාක්ෂණික තනතුරු සඳහා අයදුම්පත් ආකෘතිය",
      ta: "மூத்த ஆராய்ச்சி மற்றும் தொழில்நுட்ப பதவிகளுக்கான விண்ணப்பப் படிவம்"
    },
    categoryKey: "APPLICATION",
    category: { en: "Job Application Forms", si: "තනතුරු සඳහා අයදුම්පත් ආකෘති", ta: "வேலை விண்ணப்பப் படிவங்கள்" },
    fileSize: "920 KB",
    fileType: "PDF",
    documentNumber: "APP/HR/2026/02",
    publishDate: "2026-03-01",
    fileUrl: "#",
    description: {
      en: "Standard employment application template for professionals applying for executive, research, and technical positions.",
      si: "විධායක, පර්යේෂණ සහ තාක්ෂණික තනතුරු සඳහා වන නිල අයදුම්පත් ආකෘතිය.",
      ta: "வேலை விண்ணப்பப் படிவம்."
    }
  }
];

const DownloadsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const langKey: "en" | "si" | "ta" = currentLang.startsWith("si")
    ? "si"
    : currentLang.startsWith("ta")
    ? "ta"
    : "en";

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [downloads, setDownloads] = useState<DownloadData[]>(fallbackDownloads);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    DownloadApi.getAllDownloads()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setDownloads(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = (item: DownloadData) => {
    if (item._id) {
      DownloadApi.trackDownload(item._id).catch(() => {});
    }
    if (item.fileUrl && item.fileUrl !== "#") {
      window.open(item.fileUrl, "_blank", "noopener,noreferrer");
    } else {
      alert(`Downloading ${item.title?.[langKey] || item.title?.en || "Document"}...`);
    }
  };

  const filteredFiles = downloads.filter((file) => {
    const matchesCategory =
      selectedCategory === "ALL" || file.categoryKey === selectedCategory;

    const titleText = (file.title?.[langKey] || file.title?.en || "").toLowerCase();
    const descText = (file.description?.[langKey] || file.description?.en || "").toLowerCase();
    const docNum = (file.documentNumber || "").toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !q || titleText.includes(q) || descText.includes(q) || docNum.includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge={langKey === "si" ? "සම්පත් සහ ලේඛන" : langKey === "ta" ? "ஆவணங்கள்" : "Resources"}
        title={langKey === "si" ? "බාගත කිරීම් (Downloads)" : langKey === "ta" ? "பதிவிறக்கங்கள்" : "Downloads"}
        subtitle={
          langKey === "si"
            ? "ආයතනයට අදාළ චක්‍රලේඛ ආකෘති (PDF), වාර්තා ආකෘති, ආචාරධර්ම සංග්‍රහ ආකෘති, ලේඛන ආකෘති සහ තනතුරු සඳහා අයදුම්පත් ආකෘති මෙතැනින් ලබාගන්න."
            : langKey === "ta"
            ? "சுற்றறிக்கை படிவங்கள், அறிக்கை படிவங்கள், நெறிமுறை விதிகள் மற்றும் வேலை விண்ணப்பப் படிவங்களை பதிவிறக்கவும்."
            : "Access official circulars, report templates, code of ethics manuals, document templates, and job application forms."
        }
        breadcrumbs={[
          { label: langKey === "si" ? "සම්පත්" : "Resources", href: "/resources/downloads" },
          { label: langKey === "si" ? "බාගත කිරීම්" : "Downloads" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        {/* Search and Category Filters */}
        <div className="flex flex-col gap-5 bg-white dark:bg-white/5 p-5 sm:p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={
                langKey === "si"
                  ? "ලේඛනය හෝ චක්‍රලේඛ අංකය සොයන්න..."
                  : "Search by title, description, or reference number..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.key;
              const label = tab[langKey] || tab.en;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                      : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15"
                  }`}
                >
                  <Tag size={12} className={isSelected ? "text-white" : "text-gray-400"} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Files Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-gray-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 p-8">
            <FileText size={42} className="mx-auto text-gray-400 mb-3" />
            <h3 className="font-bold text-lg mb-1">
              {langKey === "si" ? "බාගත කිරීම් හමු නොවීය" : "No downloads found"}
            </h3>
            <p className="text-xs text-gray-500">
              {langKey === "si"
                ? "තෝරාගත් කාණ්ඩයට අදාළ ලේඛන නොමැත. කරුණාකර වෙනත් කාණ්ඩයක් තෝරන්න."
                : "No matching documents found for this filter. Please try a different category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file, index) => {
              const title = file.title?.[langKey] || file.title?.en || "Download Document";
              const desc = file.description?.[langKey] || file.description?.en || "";
              const catLabel = file.category?.[langKey] || file.category?.en || file.categoryKey;
              const dateStr = file.publishDate ? new Date(file.publishDate).toLocaleDateString() : "";

              return (
                <div
                  key={file._id || index}
                  className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-primary/40 dark:hover:border-primary/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary dark:text-pink-400">
                        {file.fileType || "PDF"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                        <HardDrive size={12} />
                        {file.fileSize || "1.0 MB"}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="text-[11px] font-semibold text-primary dark:text-pink-400/90 block mb-1">
                        {catLabel}
                      </span>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                    </div>

                    {file.documentNumber && (
                      <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 mb-3">
                        {file.documentNumber}
                      </span>
                    )}

                    {desc && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3">
                        {desc}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-3">
                    {dateStr && (
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {dateStr}
                        </span>
                        {file.downloadCount !== undefined && file.downloadCount > 0 && (
                          <span>{file.downloadCount} downloads</span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => handleDownload(file)}
                      className="w-full py-2.5 px-4 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white dark:bg-primary/20 dark:hover:bg-primary dark:text-pink-300 dark:hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Download size={14} />
                      <span>{langKey === "si" ? "ලේඛනය බාගත කරන්න" : langKey === "ta" ? "பதிவிறக்கவும்" : "Download Document"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadsPage;

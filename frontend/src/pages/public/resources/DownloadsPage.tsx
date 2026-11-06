import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import { Download, Search, FileText, Calendar, HardDrive } from "lucide-react";
import { useTranslation } from "react-i18next";
import DownloadApi, { DownloadData } from "@/api/DownloadApi";

interface CategoryFilter {
  key: string;
  label: {
    en: string;
    si: string;
    ta: string;
  };
}

const CATEGORIES: CategoryFilter[] = [
  {
    key: "ALL",
    label: {
      en: "All Downloads",
      si: "සියල්ල",
      ta: "அனைத்தும்",
    },
  },
  {
    key: "CIRCULAR",
    label: {
      en: "Institutional Circulars (PDF)",
      si: "ආයතනයට අදාළ චක්‍රලේඛ ආකෘති (PDF)",
      ta: "நிறுவன சுற்றறிக்கை படிவங்கள் (PDF)",
    },
  },
  {
    key: "REPORT",
    label: {
      en: "Report Templates",
      si: "වාර්තා ආකෘති",
      ta: "அறிக்கை படிவங்கள்",
    },
  },
  {
    key: "ETHICS",
    label: {
      en: "Code of Ethics Templates",
      si: "ආචාරධර්ම සංග්‍රහ ආකෘති",
      ta: "நெறிமுறை விதிகள் படிவங்கள்",
    },
  },
  {
    key: "DOCUMENT",
    label: {
      en: "Document Templates",
      si: "ලේඛන ආකෘති",
      ta: "ஆவணப் படிவங்கள்",
    },
  },
  {
    key: "APPLICATION",
    label: {
      en: "Job Application Forms",
      si: "තනතුරු සඳහා අයදුම්පත් ආකෘති",
      ta: "வேலை விண்ணப்பப் படிவங்கள்",
    },
  },
];

const fallbackDownloads: DownloadData[] = [
  // 1. CIRCULARS (ආයතනයට අදාළ චක්‍රලේඛ ආකෘති)
  {
    title: {
      en: "NIRDC Institutional Governance Circular 01/2026 (PDF)",
      si: "NIRDC ආයතනික පාලන චක්‍රලේඛය 01/2026 (PDF)",
      ta: "NIRDC நிறுவன ஆளுகை சுற்றறிக்கை 01/2026 (PDF)",
    },
    categoryKey: "CIRCULAR",
    category: {
      en: "Institutional Circulars (PDF)",
      si: "ආයතනයට අදාළ චක්‍රලේඛ ආකෘති (PDF)",
      ta: "நிறுவன சுற்றறிக்கை படிவங்கள் (PDF)",
    },
    fileSize: "1.8 MB",
    fileType: "PDF",
    documentNumber: "CIR/2026/01",
    publishDate: "2026-01-15",
    fileUrl: "#",
    description: {
      en: "Official administrative circular outlining compliance benchmarks, expenditure authorizations, and statutory mandates.",
      si: "අනුකූලතා මිණුම් සලකුණු සහ වියදම් බලයලත් විස්තර සඳහන් නිල චක්‍රලේඛය.",
      ta: "அதிகாரப்பூர்வ சுற்றறிக்கை.",
    },
  },
  {
    title: {
      en: "State Financial Grant Disbursement Circular 02/2026 (PDF)",
      si: "රාජ්‍ය මූල්‍ය ප්‍රතිපාදන බෙදාහැරීමේ චක්‍රලේඛය 02/2026 (PDF)",
      ta: "அரச நிதி மானிய சுற்றறிக்கை 02/2026 (PDF)",
    },
    categoryKey: "CIRCULAR",
    category: {
      en: "Institutional Circulars (PDF)",
      si: "ආයතනයට අදාළ චක්‍රලේඛ ආකෘති (PDF)",
      ta: "நிறுவன சுற்றறிக்கை படிவங்கள் (PDF)",
    },
    fileSize: "2.1 MB",
    fileType: "PDF",
    documentNumber: "CIR/2026/02",
    publishDate: "2026-02-01",
    fileUrl: "#",
    description: {
      en: "Operational directives on fiscal allocations up to LKR 500 Million for near-completed research commercialisation projects.",
      si: "ආසන්න වශයෙන් නිම කළ R&D ව්‍යාපෘති සඳහා රුපියල් මිලියන 500 දක්වා වන ප්‍රතිපාදන ලබාදීමේ නිල නියෝග.",
      ta: "மானிய வழிகாட்டுதல்கள் பற்றிய சுற்றறிக்கை.",
    },
  },

  // 2. REPORTS (වාර්තා ආකෘති)
  {
    title: {
      en: "Quarterly R&D Commercialisation Progress Report Template",
      si: "කාර්තුමය පර්යේෂණ වාණිජකරණ ප්‍රගති වාර්තා ආකෘතිය",
      ta: "காலாண்டு ஆராய்ச்சி வர்த்தகமயமாக்கல் முன்னேற்ற அறிக்கை படிவம்",
    },
    categoryKey: "REPORT",
    category: {
      en: "Report Templates",
      si: "වාර්තා ආකෘති",
      ta: "அறிக்கை படிவங்கள்",
    },
    fileSize: "1.2 MB",
    fileType: "PDF",
    documentNumber: "REP/TMP/2026",
    publishDate: "2026-02-10",
    fileUrl: "#",
    description: {
      en: "Mandatory reporting document for university research teams and grant recipients tracking milestones and financial drawdown.",
      si: "පර්යේෂණ කණ්ඩායම් සහ ප්‍රතිලාභීන් සඳහා වන අනිවාර්ය ප්‍රගති වාර්තා ආකෘතිය.",
      ta: "முன்னேற்ற அறிக்கை படிவம்.",
    },
  },
  {
    title: {
      en: "Annual Research Milestone Evaluation & Auditing Template",
      si: "වාර්ෂික පර්යේෂණ සන්ධිස්ථාන ඇගයීම් සහ විගණන වාර්තා ආකෘතිය",
      ta: "ஆண்டு ஆராய்ச்சி மைல்கல் மதிப்பீட்டு அறிக்கை படிவம்",
    },
    categoryKey: "REPORT",
    category: {
      en: "Report Templates",
      si: "වාර්තා ආකෘති",
      ta: "அறிக்கை படிவங்கள்",
    },
    fileSize: "1.5 MB",
    fileType: "PDF",
    documentNumber: "REP/AUD/2025",
    publishDate: "2025-12-18",
    fileUrl: "#",
    description: {
      en: "Comprehensive annual review template documenting technological readiness levels (TRL) and market commercial outcomes.",
      si: "තාක්ෂණික සූදානම (TRL) සහ වාණිජ ප්‍රතිඵල ඇගයීම සඳහා වන වාර්ෂික වාර්තා ආකෘතිය.",
      ta: "ஆண்டு மதிப்பீட்டு அறிக்கை படிவம்.",
    },
  },

  // 3. ETHICS (ආචාරධර්ම සංග්‍රහ ආකෘති)
  {
    title: {
      en: "Institutional Code of Ethics & Professional Conduct Manual",
      si: "ආයතනික ආචාරධර්ම සංග්‍රහය සහ වෘත්තීය චර්යා අත්පොත",
      ta: "நிறுவன நெறிமுறைக் கோட்பாடு மற்றும் நடத்தை கையேடு",
    },
    categoryKey: "ETHICS",
    category: {
      en: "Code of Ethics Templates",
      si: "ආචාරධර්ම සංග්‍රහ ආකෘති",
      ta: "நெறிமுறை விதிகள் படிவங்கள்",
    },
    fileSize: "2.4 MB",
    fileType: "PDF",
    documentNumber: "ETH/MAN/2025",
    publishDate: "2025-11-20",
    fileUrl: "#",
    description: {
      en: "Ethical compliance principles, conflict-of-interest declarations, and scientific integrity standards for all affiliates.",
      si: "සියලු නිලධාරීන් සහ පර්යේෂකයින් අනුගමනය කළ යුතු ආචාරධර්මීය ප්‍රතිපත්ති සහ මූලධර්ම.",
      ta: "நெறிமுறை கோட்பாடுகள்.",
    },
  },
  {
    title: {
      en: "Research Integrity & Conflict of Interest Declaration Form",
      si: "පර්යේෂණ අඛණ්ඩතාව සහ අවශ්‍යතා ගැටුම් ප්‍රකාශන ආකෘතිය",
      ta: "ஆராய்ச்சி நேர்மை மற்றும் நலன் முரண்பாடு அறிவிப்பு படிவம்",
    },
    categoryKey: "ETHICS",
    category: {
      en: "Code of Ethics Templates",
      si: "ආචාරධර්ම සංග්‍රහ ආකෘති",
      ta: "நெறிமுறை விதிகள் படிவங்கள்",
    },
    fileSize: "780 KB",
    fileType: "PDF",
    documentNumber: "ETH/DEC/2026",
    publishDate: "2026-01-22",
    fileUrl: "#",
    description: {
      en: "Statutory disclosure form required for peer reviewers, evaluation committees, and technical grant panel experts.",
      si: "ඇගයීම් කමිටු සමාජිකයින් සහ සමීක්ෂකයින් සම්පූර්ණ කළ යුතු අනිවාර්ය ප්‍රකාශන ආකෘතිය.",
      ta: "நலன் முரண்பாடு அறிவிப்பு படிவம்.",
    },
  },

  // 4. DOCUMENTS (ලේඛන ආකෘති)
  {
    title: {
      en: "Intellectual Property Disclosure & Assignment Template",
      si: "බුද්ධිමය දේපළ හෙළිදරව් කිරීමේ සහ පැවරීමේ ලේඛන ආකෘතිය",
      ta: "அறிவுசார் சொத்து வெளிப்படுத்தல் மற்றும் ஒப்படைப்பு படிவம்",
    },
    categoryKey: "DOCUMENT",
    category: {
      en: "Document Templates",
      si: "ලේඛන ආකෘති",
      ta: "ஆவணப் படிவங்கள்",
    },
    fileSize: "850 KB",
    fileType: "PDF",
    documentNumber: "DOC/IP/04",
    publishDate: "2026-01-08",
    fileUrl: "#",
    description: {
      en: "Standard statutory document for inventors and researchers registering proprietary technologies before commercialisation.",
      si: "තාක්ෂණය වාණිජකරණයට පෙර බුද්ධිමය දේපළ ලියාපදිංචි කිරීමේ සම්මත ආකෘතිය.",
      ta: "அறிவுசார் சொத்து படிவம்.",
    },
  },
  {
    title: {
      en: "Tripartite Research Commercialisation Agreement Model",
      si: "ත්‍රිපාර්ශ්වීය පර්යේෂණ වාණිජකරණ ගිවිසුම් ආකෘතිය",
      ta: "முத்தரப்பு வர்த்தகமயமாக்கல் ஒப்பந்த மாதிரி படிவம்",
    },
    categoryKey: "DOCUMENT",
    category: {
      en: "Document Templates",
      si: "ලේඛන ආකෘති",
      ta: "ஆவணப் படிவங்கள்",
    },
    fileSize: "1.1 MB",
    fileType: "PDF",
    documentNumber: "DOC/AGR/2026",
    publishDate: "2026-02-14",
    fileUrl: "#",
    description: {
      en: "Standardized legal contract template between academic institutes, commercial enterprises, and NIRDC.",
      si: "විශ්වවිද්‍යාල, ව්‍යවසායකයින් සහ NIRDC අතර නීත්‍යානුකූල ගිවිසුම් කෙටුම්පත් ආකෘතිය.",
      ta: "வர்த்தக ஒப்பந்த மாதிரி படிவம்.",
    },
  },

  // 5. APPLICATIONS (තනතුරු සඳහා අයදුම්පත් ආකෘති)
  {
    title: {
      en: "NIRDC Senior Research & Technical Staff Application Form",
      si: "ජ්‍යෙෂ්ඨ පර්යේෂණ සහ තාක්ෂණික තනතුරු සඳහා අයදුම්පත් ආකෘතිය",
      ta: "மூத்த ஆராய்ச்சி மற்றும் தொழில்நுட்ப பதவிகளுக்கான விண்ணப்பப் படிவம்",
    },
    categoryKey: "APPLICATION",
    category: {
      en: "Job Application Forms",
      si: "තනතුරු සඳහා අයදුම්පත් ආකෘති",
      ta: "வேலை விண்ணப்பப் படிவங்கள்",
    },
    fileSize: "920 KB",
    fileType: "PDF",
    documentNumber: "APP/HR/2026/02",
    publishDate: "2026-03-01",
    fileUrl: "#",
    description: {
      en: "Standard employment application template for professionals applying for executive, research, and technical positions.",
      si: "විධායක, පර්යේෂණ සහ තාක්ෂණික තනතුරු සඳහා වන නිල අයදුම්පත් ආකෘතිය.",
      ta: "வேலை விண்ணப்பப் படிவம்.",
    },
  },
  {
    title: {
      en: "Independent Expert Reviewer Panel Enrolment Form",
      si: "ස්වාධීන විශේෂඥ සමීක්ෂක මණ්ඩල බඳවා ගැනීමේ අයදුම්පත් ආකෘතිය",
      ta: "சுயாதீன நிபுணர் மதிப்பாய்வாளர் சேர்க்கை விண்ணப்பப் படிவம்",
    },
    categoryKey: "APPLICATION",
    category: {
      en: "Job Application Forms",
      si: "තනතුරු සඳහා අයදුම්පත් ආකෘති",
      ta: "வேலை விண்ணப்பப் படிவங்கள்",
    },
    fileSize: "650 KB",
    fileType: "PDF",
    documentNumber: "APP/REV/2026",
    publishDate: "2026-02-25",
    fileUrl: "#",
    description: {
      en: "Application form for senior academics, industry practitioners, and patent attorneys seeking accreditation on NIRDC's expert review roster.",
      si: "පර්යේෂණ ඇගයීම් සඳහා විශේෂඥ සමීක්ෂක මණ්ඩලයට එක්වීමට කැමති ප්‍රවීණයින් සඳහා වන අයදුම්පත් ආකෘතිය.",
      ta: "மதிப்பாய்வாளர் சேர்க்கை படிவம்.",
    },
  },
];

const DownloadsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const langKey: "en" | "si" | "ta" = currentLang.startsWith("si")
    ? "si"
    : currentLang.startsWith("ta")
    ? "ta"
    : "en";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
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
    // 1. Category Filter
    const matchesCategory =
      selectedCategory === "ALL" ||
      file.categoryKey?.toUpperCase() === selectedCategory.toUpperCase() ||
      file.category?.[langKey] ===
        CATEGORIES.find((c) => c.key === selectedCategory)?.label[langKey] ||
      file.category?.en ===
        CATEGORIES.find((c) => c.key === selectedCategory)?.label.en;

    // 2. Search Query Filter
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
        title={t("header.downloads", "Downloads")}
        subtitle={
          langKey === "si"
            ? "ආයතනයට අදාළ චක්‍රලේඛ ආකෘති (PDF), වාර්තා ආකෘති, ආචාරධර්ම සංග්‍රහ ආකෘති, ලේඛන ආකෘති සහ තනතුරු සඳහා අයදුම්පත් ආකෘති මෙතැනින් බාගත කරගන්න."
            : langKey === "ta"
            ? "நிறுவன சுற்றறிக்கை படிவங்கள் (PDF), அறிக்கை படிவங்கள், நெறிமுறை விதிகள் படிவங்கள், ஆவணப் படிவங்கள் மற்றும் வேலை விண்ணப்பப் படிவங்களை பதிவிறக்கவும்."
            : "Access official institutional circulars (PDF), report templates, code of ethics manuals, document templates, and job application forms."
        }
        breadcrumbs={[
          { label: t("header.home", "Home"), href: "/" },
          { label: t("header.downloads", "Downloads") },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={
              langKey === "si"
                ? "ලේඛනය, මාතෘකාව හෝ චක්‍රලේඛ අංකය සොයන්න..."
                : langKey === "ta"
                ? "ஆவணம் அல்லது குறிப்பு எண்ணை தேடவும்..."
                : "Search by title, description, or reference number..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pb-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            const count =
              cat.key === "ALL"
                ? downloads.length
                : downloads.filter(
                    (d) =>
                      d.categoryKey?.toUpperCase() === cat.key.toUpperCase() ||
                      d.category?.[langKey] === cat.label[langKey] ||
                      d.category?.en === cat.label.en
                  ).length;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                    : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-white/10 hover:bg-slate-100/80 dark:hover:bg-white/10"
                }`}
              >
                <span>{cat.label[langKey] || cat.label.en}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isSelected
                        ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                        : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Files Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-gray-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 p-8 space-y-3">
            <FileText size={42} className="mx-auto text-gray-400" />
            <h3 className="font-bold text-lg">
              {langKey === "si" ? "බාගත කිරීම් හමු නොවීය" : "No downloads found"}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {langKey === "si"
                ? "මෙම කාණ්ඩය යටතේ හෝ ඔබ සෙවූ වචන වලට අදාළ ලේඛන හමු නොවීය. කරුණාකර වෙනත් කාණ්ඩයක් හෝ සෙවුම් වචනයක් භාවිතා කරන්න."
                : "No matching documents found under this category. Please try selecting a different category or search term."}
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
                  className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-xl hover:border-primary/40 dark:hover:border-primary/40 transition-all flex flex-col justify-between group"
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
                      type="button"
                      onClick={() => handleDownload(file)}
                      className="w-full py-2.5 px-4 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white dark:bg-primary/20 dark:hover:bg-primary dark:text-pink-300 dark:hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                    >
                      <Download size={14} />
                      <span>
                        {langKey === "si"
                          ? "ලේඛනය බාගත කරන්න"
                          : langKey === "ta"
                          ? "பதிவிறக்கவும்"
                          : "Download Document"}
                      </span>
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

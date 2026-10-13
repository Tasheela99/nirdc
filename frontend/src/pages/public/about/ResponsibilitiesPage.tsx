import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Scale,
  Users,
  ChevronDown,
  Building,
  FileText,
  LucideIcon,
} from "lucide-react";
import aboutUsContentApi, { ResponsibilityData, getMultiLangText } from "@/api/AboutUsContentApi";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  Scale,
  ShieldCheck,
  Users,
  Building,
  FileText,
};

const defaultDuties = [
  {
    icon: "DollarSign",
    section: "Mandate 01",
    title: "Capital Allocation & Grant Governance",
    points: [
      "Disbursement of competitive research commercialisation grants with zero tolerance for bias.",
      "Auditing and ensuring financial stewardship across all co-invested initiatives.",
      "Structuring milestone-based funding tranches tied directly to proven deliverables.",
    ],
  },
  {
    icon: "Scale",
    section: "Mandate 02",
    title: "Intellectual Property Safeguarding",
    points: [
      "Providing institutional legal aid for national and PCT international patent applications.",
      "Protecting researcher equity and royalty allocations in licensing deals.",
      "Establishing sovereign IP protection protocols for indigenous biological and mineral resources.",
    ],
  },
  {
    icon: "ShieldCheck",
    section: "Mandate 03",
    title: "Regulatory & Ethical Compliance",
    points: [
      "Ensuring biological, medical, and technical research adheres to international safety standards.",
      "Enforcing strict environmental impact assessment before commercial pilots.",
      "Facilitating expedited approvals through streamlined national single-window clearing.",
    ],
  },
  {
    icon: "Users",
    section: "Mandate 04",
    title: "Capacity Building & Commercial Mentorship",
    points: [
      "Conducting intensive bootcamps on technology valuation, spin-off structuring, and pitch creation.",
      "Pairing scientists with seasoned industry C-suite executives and venture partners.",
      "Nurturing early-stage student innovators at universities across all nine provinces.",
    ],
  },
];

const ResponsibilitiesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [dbDuties, setDbDuties] = useState<ResponsibilityData[]>([]);

  useEffect(() => {
    let isMounted = true;
    aboutUsContentApi
      .getPublicResponsibilities()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setDbDuties(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const items =
    dbDuties.length > 0
      ? dbDuties.map((d) => ({
          icon: d.icon || "ShieldCheck",
          section: getMultiLangText(d.section, currentLang, "Mandate"),
          title: getMultiLangText(d.title, currentLang),
          points: d.points.map((pt) => getMultiLangText(pt, currentLang)),
        }))
      : defaultDuties;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge="What We Do"
        title="Our Responsibilities"
        subtitle="Upholding public trust through rigorous statutory oversight, ethical governance, and strategic facilitation."
        breadcrumbs={[
          { label: "About Us", href: "/about-us" },
          { label: "Our Responsibilities" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="space-y-4">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || ShieldCheck;
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-gray-50/80 dark:hover:bg-white/[0.03] transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary dark:text-pink-400 flex items-center justify-center shrink-0">
                      <IconComponent size={24} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-pink-400 block mb-0.5">
                        {item.section}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate sm:whitespace-normal">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 bg-primary text-white"
                        : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {/* Accordion Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gray-100 dark:border-white/5">
                        <ul className="space-y-3.5 mt-3">
                          {item.points.map((pt, pIdx) => (
                            <li
                              key={pIdx}
                              className="flex items-start gap-3 text-sm sm:text-base text-gray-600 dark:text-gray-300"
                            >
                              <CheckCircle2
                                size={18}
                                className="text-primary dark:text-pink-400 shrink-0 mt-0.5"
                              />
                              <span className="leading-relaxed">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResponsibilitiesPage;

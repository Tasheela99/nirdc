import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import {
  Calendar,
  CheckCircle2,
  Flag,
} from "lucide-react";
import aboutUsContentApi, {
  HistoryMilestoneData,
  getMultiLangText,
} from "@/api/AboutUsContentApi";
import { useTranslation } from "react-i18next";

const defaultMilestones = [
  {
    year: "2020",
    title: "Conception & Policy Foundation",
    description:
      "A national taskforce identified the critical disconnect between laboratory research and commercial industries, proposing a dedicated statutory commercialisation authority.",
  },
  {
    year: "2021",
    title: "Cabinet Approval & Charter",
    description:
      "Government endorsement ratified the NIRDC charter, aligning national R&D agendas with industrial revival and intellectual property protections.",
  },
  {
    year: "2022",
    title: "Inaugural Research-Investor Summit",
    description:
      "NIRDC hosted Sri Lanka's first tripartite innovation summit connecting 50+ leading researchers with top venture capitalists and corporate leaders.",
  },
  {
    year: "2023",
    title: "Digital Commercialisation Portal Launch",
    description:
      "Deployment of the integrated digital portal allowing researchers nationwide to submit proposals and access automated peer-review workflows.",
  },
  {
    year: "2024",
    title: "Global Venture Acceleration",
    description:
      "Establishment of international IP cross-licensing partnerships and cross-border innovation corridors to take Sri Lankan technologies global.",
  },
  {
    year: "2025 & Beyond",
    title: "Renaissance Era Expansion",
    description:
      "Scaling up state-of-the-art regional incubation centers and multi-million-dollar co-investment funds across emerging high-tech domains.",
  },
];

const HistoryPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [dbMilestones, setDbMilestones] = useState<HistoryMilestoneData[]>([]);

  useEffect(() => {
    let isMounted = true;
    aboutUsContentApi
      .getPublicMilestones()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setDbMilestones(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const items =
    dbMilestones.length > 0
      ? dbMilestones.map((m) => ({
          year: m.year,
          title: getMultiLangText(m.title, currentLang),
          description: getMultiLangText(m.description, currentLang),
        }))
      : defaultMilestones;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge={t("history.badge", "Institutional Background & Journey")}
        title={t("history.title", "Our History")}
        subtitle={t(
          "history.subtitle",
          "From vision to national impact: The journey of NIRDC in transforming Sri Lanka's research ecosystem into commercial realities."
        )}
        breadcrumbs={[
          { label: t("header.about", "About Us"), href: "/about-us" },
          { label: t("history.title", "Our History") },
        ]}
      />

      {/* 1. INSTITUTIONAL BACKGROUND SECTION (ආයතනික පසුබිම) */}
      <section className="py-12 sm:py-16 bg-[#edf2f7] dark:bg-[#151c28]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t("history.backgroundTitle", "Institutional Background & Genesis")}
            </h2>
          </div>

          <div className="text-slate-700 dark:text-slate-200 leading-relaxed text-base sm:text-lg text-justify sm:text-center">
            <p>
              {t(
                "history.backgroundContent",
                "We are a multidisciplinary team established through a state-sector initiative bringing together scientists, administrators, economists, industrialists, legal experts, and scholars across various disciplines to accelerate the commercialisation of completed or near-completed Research and Development (R&D) in Sri Lanka. Operating under the Presidential Secretariat, our national framework initiates a long-term national R&D mechanism. Headquartered at the Presidential Secretariat, the National Initiative for Research and Development Commercialisation operationalizes government financial funding for near-completed R&D projects, matches completed R&D projects with investors, and assists researchers facing commercialisation hurdles."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-slate-200/90 dark:border-white/10" />
      </div>

      {/* 2. TIMELINE & MILESTONES (ගමන් මග සහ ප්‍රධාන සන්ධිස්ථාන) */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0c050b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t("history.milestonesTitle", "Our Journey & Key Milestones")}
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Timeline */}
            <div className="relative border-l-2 border-primary/30 dark:border-pink-500/30 ml-4 md:ml-44 space-y-8 sm:space-y-12">
              {items.map((item, index) => (
                <div key={index} className="relative pl-6 sm:pl-8">
                  {/* Year Marker for desktop/laptop screens (md+) */}
                  <div className="hidden md:flex absolute -left-44 top-1 text-right w-36 justify-end items-center gap-1.5 text-primary dark:text-pink-400">
                    <Calendar size={16} className="shrink-0" />
                    <span className="text-base sm:text-lg font-black tracking-tight whitespace-nowrap">
                      {item.year}
                    </span>
                  </div>

                  {/* Dot icon */}
                  <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-[#1A0D15] border-2 border-primary dark:border-pink-500 flex items-center justify-center text-primary dark:text-pink-400 shadow-sm z-10">
                    <CheckCircle2 size={16} />
                  </div>

                  {/* Mobile / Tablet Year Badge (< md) */}
                  <div className="md:hidden mb-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-primary dark:text-pink-300 bg-primary/10 dark:bg-pink-950/40 border border-primary/20 dark:border-pink-500/20 shadow-xs">
                      <Calendar size={13} className="shrink-0" />
                      <span className="whitespace-nowrap">{item.year}</span>
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-md transition-all duration-200 space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Flag size={18} className="text-primary dark:text-pink-400 shrink-0" />
                      <span>{item.title}</span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;

import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import { Calendar, CheckCircle2, Flag } from "lucide-react";
import aboutUsContentApi, { HistoryMilestoneData, getMultiLangText } from "@/api/AboutUsContentApi";
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
  const { i18n } = useTranslation();
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge="Who We Are"
        title="Our History"
        subtitle="The journey of creating a world-class institutional bridge between Sri Lanka's intellectual capital and sustainable market success."
        breadcrumbs={[
          { label: "About Us", href: "/about-us" },
          { label: "Our History" },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
              <div className="p-5 sm:p-7 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-lg sm:text-xl font-bold mb-2.5 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Flag size={18} className="text-primary dark:text-pink-400 shrink-0" />
                  <span>{item.title}</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

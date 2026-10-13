import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import { History, Calendar, CheckCircle2, Flag } from "lucide-react";
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Intro Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-primary dark:text-pink-400 bg-primary/10 mb-4">
            <History size={16} />
            <span>The Journey So Far</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Building a Legacy of Impact</h2>
          <p className="text-gray-600 dark:text-gray-300">
            From humble beginnings to an authoritative national pillar, NIRDC has continuously evolved to meet the dynamic demands of a modern innovation economy.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-primary/30 dark:border-pink-500/30 ml-4 sm:ml-32 space-y-12">
          {items.map((item, index) => (
            <div key={index} className="relative pl-8 sm:pl-10">
              {/* Year Marker for larger screens */}
              <div className="hidden sm:block absolute -left-32 top-0 text-right w-24">
                <span className="text-lg font-black text-primary dark:text-pink-400 flex items-center justify-end gap-1">
                  <Calendar size={16} />
                  {item.year}
                </span>
              </div>

              {/* Dot icon */}
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-white dark:bg-[#1A0D15] border-2 border-primary dark:border-pink-500 flex items-center justify-center text-primary dark:text-pink-400 shadow">
                <CheckCircle2 size={16} />
              </div>

              {/* Mobile Year Badge */}
              <div className="sm:hidden mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold text-white bg-primary">
                  {item.year}
                </span>
              </div>

              {/* Content Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Flag size={18} className="text-primary dark:text-pink-400" />
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
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

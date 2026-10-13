import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import {
  Target,
  TrendingUp,
  Cpu,
  Briefcase,
  GraduationCap,
  Globe,
  Rocket,
  Shield,
  Zap,
  LucideIcon,
} from "lucide-react";
import aboutUsContentApi, { ObjectiveData, getMultiLangText } from "@/api/AboutUsContentApi";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, LucideIcon> = {
  Target,
  TrendingUp,
  Cpu,
  Briefcase,
  GraduationCap,
  Globe,
  Rocket,
  Shield,
  Zap,
};

const defaultObjectivesList = [
  {
    icon: "TrendingUp",
    badge: "Economic Growth",
    title: "Accelerate R&D Commercialisation",
    description:
      "Transition over 200 high-potential university and institute-backed technologies into viable commercial businesses over the next 5 years.",
  },
  {
    icon: "Briefcase",
    badge: "Capital Mobilisation",
    title: "Syndicate Private & Angel Capital",
    description:
      "Unlock LKR 5+ Billion in private enterprise co-investment and venture capital dedicated to Sri Lankan scientific research initiatives.",
  },
  {
    icon: "Cpu",
    badge: "Tech Sovereignty",
    title: "Deep Tech & IP Creation",
    description:
      "Double national patent filings and technology transfer agreements across robotics, renewable energy, pharmaceutical synthesis, and smart agriculture.",
  },
  {
    icon: "GraduationCap",
    badge: "Talent Retention",
    title: "Curb Brain Drain",
    description:
      "Provide lucrative commercialization avenues, grants, and spin-off equity opportunities to keep top scientific and engineering minds in Sri Lanka.",
  },
  {
    icon: "Globe",
    badge: "Global Markets",
    title: "Drive High-Tech Exports",
    description:
      "Enable Sri Lankan high-value manufactured goods and licensed intellectual properties to penetrate premium export destinations worldwide.",
  },
  {
    icon: "Target",
    badge: "Institutional Synergies",
    title: "Foster Quadruple-Helix Innovation",
    description:
      "Unify universities, research institutes, private industry, and state regulatory bodies into one cohesive, frictionless innovation network.",
  },
];

const ObjectivesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [dbObjectives, setDbObjectives] = useState<ObjectiveData[]>([]);

  useEffect(() => {
    let isMounted = true;
    aboutUsContentApi
      .getPublicObjectives()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setDbObjectives(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const items =
    dbObjectives.length > 0
      ? dbObjectives.map((o) => ({
          icon: o.icon || "Target",
          badge: getMultiLangText(o.badge, currentLang, "Strategic Pillar"),
          title: getMultiLangText(o.title, currentLang),
          description: getMultiLangText(o.description, currentLang),
        }))
      : defaultObjectivesList;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge="What We Do"
        title="Our Objectives"
        subtitle="Transforming national potential into tangible economic outcomes through defined, time-bound strategic targets."
        breadcrumbs={[
          { label: "About Us", href: "/about-us" },
          { label: "Our Objectives" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) => {
              const IconComponent = iconMap[item.icon] || Target;

              return (
                <div
                  key={index}
                  className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary dark:text-pink-400">
                      <IconComponent size={24} />
                    </div>
                    {item.badge && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectivesPage;

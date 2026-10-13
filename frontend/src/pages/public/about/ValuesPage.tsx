import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import {
  CheckCircle,
  HeartHandshake,
  Shield,
  Sparkles,
  Leaf,
  Users,
  Target,
  Award,
  Zap,
  LucideIcon,
} from "lucide-react";
import aboutUsContentApi, { CoreValueData, getMultiLangText } from "@/api/AboutUsContentApi";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Shield,
  HeartHandshake,
  CheckCircle,
  Leaf,
  Users,
  Target,
  Award,
  Zap,
};

const defaultCoreValues = [
  {
    icon: "Sparkles",
    title: "Excellence in Innovation",
    description:
      "We champion world-class standards in scientific research, product design, and commercial deployment, refusing mediocrity at every stage.",
  },
  {
    icon: "Shield",
    title: "Uncompromising Integrity",
    description:
      "We operate with total transparency, ethical stewardship, and strict meritocracy in all reviews, partnerships, and grant disbursements.",
  },
  {
    icon: "HeartHandshake",
    title: "Tripartite Collaboration",
    description:
      "We believe real breakthroughs happen when academia, private capital, and government institutions co-create with mutual respect and shared ownership.",
  },
  {
    icon: "CheckCircle",
    title: "Measurable Impact",
    description:
      "Our success is defined not by papers published, but by patents licensed, industries revitalized, and high-quality jobs generated.",
  },
  {
    icon: "Leaf",
    title: "Environmental Sustainability",
    description:
      "We prioritize circular economic solutions, clean technologies, and eco-conscious engineering that preserve Sri Lanka's unique natural heritage.",
  },
  {
    icon: "Users",
    title: "Inclusive Empowerment",
    description:
      "We bridge regional divides to ensure innovators across all provinces, universities, and backgrounds have equal access to capital and mentorship.",
  },
];

const ValuesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [dbValues, setDbValues] = useState<CoreValueData[]>([]);

  useEffect(() => {
    let isMounted = true;
    aboutUsContentApi
      .getPublicCoreValues()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setDbValues(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const items =
    dbValues.length > 0
      ? dbValues.map((v) => ({
          icon: v.icon || "Sparkles",
          title: getMultiLangText(v.title, currentLang),
          description: getMultiLangText(v.description, currentLang),
        }))
      : defaultCoreValues;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge="Who We Are"
        title="Our Values"
        subtitle="The enduring principles that define our culture, guide our decisions, and inspire our dedication to national service."
        breadcrumbs={[
          { label: "About Us", href: "/about-us" },
          { label: "Our Values" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((val, index) => {
            const IconComponent = iconMap[val.icon] || Sparkles;

            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-500/10 border border-primary/20 flex items-center justify-center text-primary dark:text-pink-400 mb-6">
                    <IconComponent size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {val.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 text-xs font-semibold text-primary/70 dark:text-pink-400/80">
                  Principle 0{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ValuesPage;

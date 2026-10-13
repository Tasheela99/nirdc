import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import { Link } from "react-router-dom";
import {
  Lightbulb,
  Building2,
  Briefcase,
  Rocket,
  ArrowRight,
  Check,
  Zap,
  Globe,
  LucideIcon,
} from "lucide-react";
import aboutUsContentApi, { FunctionServiceData, getMultiLangText } from "@/api/AboutUsContentApi";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Building2,
  Briefcase,
  Rocket,
  Zap,
  Globe,
};

const defaultServices = [
  {
    icon: "Lightbulb",
    category: "For Researchers & Inventors",
    description: "Empowering scientists to transition lab discoveries into scalable commercial enterprises.",
    offerings: [
      "Rigorous commercial viability assessment & feasibility review",
      "Non-dilutive seed and prototyping grants",
      "Hands-on IP drafting and patent filing assistance",
      "Pitch deck preparation and investor matchmaking",
    ],
    actionLink: "/proposal",
    actionText: "Submit Proposal",
  },
  {
    icon: "Briefcase",
    category: "For Investors & Industry Leaders",
    description: "Unlocking de-risked, proprietary deep-tech investment opportunities across Sri Lanka.",
    offerings: [
      "Curated pipelines of peer-reviewed high-impact R&D ventures",
      "Independent technical, legal, and financial due diligence reports",
      "Co-funding arrangements matching public funds with private capital",
      "Direct board representation and royalty structuring support",
    ],
    actionLink: "/reviewer-registration",
    actionText: "Register as Reviewer / Investor",
  },
  {
    icon: "Building2",
    category: "For Universities & Research Institutes",
    description: "Strengthening institutional capabilities to capture and monetize intellectual discoveries.",
    offerings: [
      "Technology Transfer Office (TTO) setup & staff capacity building",
      "Institutional IP policy design and fair royalty sharing models",
      "Multi-disciplinary consortium formation with industrial conglomerates",
      "Direct linkages to global academic patent licensing networks",
    ],
    actionLink: "/contact-us",
    actionText: "Partner With Us",
  },
  {
    icon: "Rocket",
    category: "For Spin-offs & Deep-Tech Startups",
    description: "Nurturing enterprise scale from initial pilot validation to international market penetration.",
    offerings: [
      "Access to certified pilot testing and prototyping facilities",
      "Executive mentorship from veteran industry founders and operators",
      "Corporate tax incentive guidance and regulatory fast-tracking",
      "International trade delegation participation and export linkage",
    ],
    actionLink: "/contact-us",
    actionText: "Learn More",
  },
];

const FunctionsServicesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [dbServices, setDbServices] = useState<FunctionServiceData[]>([]);

  useEffect(() => {
    let isMounted = true;
    aboutUsContentApi
      .getPublicFunctionServices()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0 && isMounted) {
          setDbServices(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const items =
    dbServices.length > 0
      ? dbServices.map((s) => ({
          icon: s.icon || "Lightbulb",
          category: getMultiLangText(s.category, currentLang),
          description: getMultiLangText(s.description, currentLang),
          offerings: s.offerings.map((off) => getMultiLangText(off, currentLang)),
          actionLink: s.actionLink || "/contact-us",
          actionText: getMultiLangText(s.actionText, currentLang, "Learn More"),
        }))
      : defaultServices;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge="What We Do"
        title="Functions and Services"
        subtitle="A comprehensive end-to-end service suite engineered to empower every stakeholder across the national innovation value chain."
        breadcrumbs={[
          { label: "About Us", href: "/about-us" },
          { label: "Functions and Services" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {items.map((srv, index) => {
            const IconComponent = iconMap[srv.icon] || Lightbulb;

            return (
              <div
                key={index}
                className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3.5 rounded-2xl bg-primary/10 text-primary dark:text-pink-400">
                      <IconComponent size={26} />
                    </div>
                    <h3 className="text-2xl font-bold">{srv.category}</h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                    {srv.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {srv.offerings.map((off, oIdx) => (
                      <div key={oIdx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary dark:text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="leading-snug">{off}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={srv.actionLink}
                  className="inline-flex items-center justify-between w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-white dark:hover:bg-primary text-sm font-bold text-gray-900 dark:text-white transition-all group"
                >
                  <span>{srv.actionText}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FunctionsServicesPage;

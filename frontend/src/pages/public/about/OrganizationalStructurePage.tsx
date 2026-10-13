import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import { Shield, Cpu, Briefcase, FileCheck, Building, LucideIcon } from "lucide-react";
import aboutUsContentApi, {
  OrganizationalStructureData,
  getMultiLangText,
} from "@/api/AboutUsContentApi";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, LucideIcon> = {
  FileCheck,
  Briefcase,
  Shield,
  Cpu,
  Building,
};

const defaultDivisions = [
  {
    title: "1. Research Evaluation & Scientific Advisory Directorate",
    icon: "FileCheck",
    focus: "Technical feasibility, peer review boards, scientific integrity, academic partner liaison.",
    subUnits: [
      "Peer-Review Expert Panels",
      "Sectoral Advisory Sub-Committees",
      "Laboratory Accreditation & Testing Validation",
    ],
  },
  {
    title: "2. Commercialisation & Venture Directorate",
    icon: "Briefcase",
    focus: "Deal structuring, private investor syndication, startup incubation, market validation.",
    subUnits: [
      "Angel & Venture Fund Alliance Unit",
      "Technology Incubation & Accelerator Hubs",
      "Export & Industrial Market Linkage",
    ],
  },
  {
    title: "3. Legal, IP & Policy Directorate",
    icon: "Shield",
    focus: "Patent protection, licensing frameworks, statutory compliance, national policy input.",
    subUnits: [
      "National & PCT Patent Registry Unit",
      "Contractual & Licensing Advisory",
      "Regulatory Single-Window Clearance",
    ],
  },
  {
    title: "4. Operations & Strategic Finance Directorate",
    icon: "Cpu",
    focus: "Grant disbursements, audit compliance, digital platforms, stakeholder engagement.",
    subUnits: [
      "Public Grant & Fund Disbursement",
      "Digital Platform & Portal Operations",
      "Public Relations & Communications",
    ],
  },
];

const OrganizationalStructurePage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [dbDivisions, setDbDivisions] = useState<OrganizationalStructureData[]>([]);

  useEffect(() => {
    let isMounted = true;
    aboutUsContentApi
      .getPublicDivisions()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0 && isMounted) {
          setDbDivisions(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const items =
    dbDivisions.length > 0
      ? dbDivisions.map((d) => ({
          title: getMultiLangText(d.title, currentLang),
          icon: d.icon || "Building",
          focus: getMultiLangText(d.focus, currentLang),
          subUnits: d.subUnits.map((u) => getMultiLangText(u, currentLang)),
        }))
      : defaultDivisions;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge="Leadership"
        title="Organizational Structure"
        subtitle="Transparent governance architecture designed for efficiency, accountability, and seamless execution."
        breadcrumbs={[
          { label: "About Us", href: "/about-us" },
          { label: "Organizational Structure" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-primary dark:text-pink-400">
            Governance Hierarchy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4">
            Structured for Agile Impact
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            NIRDC operates under a streamlined hierarchy ensuring robust checks and balances while expediting the flow of innovation from lab to market.
          </p>
        </div>

        {/* Apex Governance Tier */}
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary to-pink-600 text-white shadow-xl">
            <span className="text-xs uppercase tracking-widest font-semibold block mb-1 opacity-90">
              Supreme Oversight
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Presidential Secretariat & Board of Governors
            </h3>
            <p className="text-xs sm:text-sm opacity-90 mt-2">
              National policy direction, statutory approvals, and inter-ministerial coordination.
            </p>
          </div>

          <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-700 mx-auto" />

          <div className="p-6 rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 shadow-md">
            <span className="text-xs uppercase tracking-widest font-semibold text-primary dark:text-pink-400 block mb-1">
              Executive Leadership
            </span>
            <h3 className="text-xl font-bold">Office of the Director General</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Day-to-day strategic steering, stakeholder alignment, and operational execution.
            </p>
          </div>

          <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-700 mx-auto" />
        </div>

        {/* Operational Directorates Grid */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((divItem, index) => {
              const IconComponent = iconMap[divItem.icon] || Building;

              return (
                <div
                  key={index}
                  className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary dark:text-pink-400 flex items-center justify-center shrink-0">
                        <IconComponent size={26} />
                      </div>
                      <h4 className="text-xl font-bold leading-tight">{divItem.title}</h4>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {divItem.focus}
                    </p>

                    <div className="space-y-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Operational Sub-Units
                      </span>
                      {divItem.subUnits.map((unit, uIdx) => (
                        <div
                          key={uIdx}
                          className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalStructurePage;

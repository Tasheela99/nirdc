import React from "react";
import PageHero from "@/components/common/PageHero";
import { Download, Calendar } from "lucide-react";

const publications = [
  {
    title: "NIRDC Annual Performance & Innovation Audit Report 2024",
    year: "2024",
    type: "Annual Review",
    summary:
      "A comprehensive audit detailing 120+ funded R&D projects, LKR 3.2B private capital commitments, and multi-sectoral economic yield.",
    readTime: "84 Pages",
  },
  {
    title: "Sri Lanka Deep-Tech Ecosystem Assessment: From Lab to Market",
    year: "2024",
    type: "Policy Whitepaper",
    summary:
      "An analytical survey of university spin-off bottlenecks, intellectual property retention, and venture funding availability.",
    readTime: "48 Pages",
  },
  {
    title: "Renewable Energy & Battery Storage: National Commercialisation Roadmap",
    year: "2023",
    type: "Sectoral Report",
    summary:
      "Strategic roadmap examining domestic graphite value addition, green hydrogen pilots, and export opportunities.",
    readTime: "62 Pages",
  },
  {
    title: "Agricultural Biotechnology & Food Security Commercial Review",
    year: "2023",
    type: "Market Study",
    summary:
      "Evaluation of indigenous biopesticides, post-harvest preservation technologies, and export certifications.",
    readTime: "36 Pages",
  },
  {
    title: "Quadruple-Helix Innovation Governance Manual for Sri Lanka",
    year: "2022",
    type: "Institutional Guideline",
    summary:
      "Standard operating protocols aligning universities, state departments, industrial corporations, and citizen beneficiaries.",
    readTime: "52 Pages",
  },
  {
    title: "National Intellectual Property Commercialisation Index (NIPCI)",
    year: "2022",
    type: "Statistical Bulletin",
    summary:
      "Empirical metrics measuring patent filing efficiency, tech transfer royalties, and enterprise spin-offs across 17 state universities.",
    readTime: "40 Pages",
  },
];

const ReportsPublicationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge="Resources"
        title="Reports & Publications"
        subtitle="Authoritative market intelligence, statutory performance audits, and strategic policy research papers."
        breadcrumbs={[
          { label: "Resources", href: "/resources/reports-publications" },
          { label: "Reports & Publications" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        {/* Featured Report Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary to-[#4a1233] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
              Featured Release
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              NIRDC State of Innovation & Commercialisation Report 2025
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Explore our landmark biennial publication analyzing the structural transformation of Sri Lanka's high-tech knowledge economy.
            </p>
          </div>

          <button
            onClick={() => alert("Downloading State of Innovation Report 2025...")}
            className="shrink-0 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-sm shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            <span>Download Full Report (PDF)</span>
          </button>
        </div>

        {/* Publications Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold mb-3">Policy Papers & Bulletins</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Discover in-depth research papers authored by NIRDC economists, sector experts, and technical advisory committees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((item, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="font-bold text-primary dark:text-pink-400 uppercase tracking-wider">
                      {item.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {item.year}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    {item.readTime}
                  </span>
                  <button
                    onClick={() => alert(`Downloading ${item.title}...`)}
                    className="text-xs font-semibold text-primary dark:text-pink-400 hover:underline flex items-center gap-1"
                  >
                    <Download size={13} />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPublicationsPage;

import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import aboutImg from "@/assets/about-1.png";
import aboutUsContentApi, { IntroductionData, getMultiLangText } from "@/api/AboutUsContentApi";
import { useTranslation } from "react-i18next";

const IntroductionPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [data, setData] = useState<IntroductionData | null>(null);

  useEffect(() => {
    let isMounted = true;
    aboutUsContentApi
      .getIntroduction()
      .then((res) => {
        if (isMounted && res?.data) {
          setData(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const badge = getMultiLangText(data?.badge, currentLang, "Who We Are");
  const title = getMultiLangText(data?.title, currentLang, "Introduction");
  const subtitle = getMultiLangText(
    data?.subtitle,
    currentLang,
    "The National Initiative for Research and Development Commercialisation (NIRDC) acts as the catalyst connecting Sri Lankan innovation with global commercial reality."
  );
  const overviewTitle = getMultiLangText(data?.overviewTitle, currentLang, "Overview & Purpose");
  const overviewHeading = getMultiLangText(
    data?.overviewHeading,
    currentLang,
    "Pioneering Sri Lanka's R&D Commercial Ecosystem"
  );
  const displayImage = data?.image || aboutImg;

  // Default paragraphs if none returned
  const defaultParagraphs = [
    "The National Initiative for Research and Development Commercialisation (NIRDC) was established as a strategic apex entity to bridge the divide between academic, scientific discoveries and dynamic industry commercialisation. By aligning national research priorities with economic growth drivers, NIRDC empowers researchers, inventors, and industry leaders to build sustainable, high-value enterprises.",
    "For decades, Sri Lanka's universities and state research institutions have produced outstanding innovations. However, without dedicated commercialisation pathways, robust IP protections, and access to private risk capital, many breakthroughs remained within laboratory walls. NIRDC addresses this systemic gap by establishing transparent evaluation mechanisms, seed capital tranches, and direct industry syndications.",
    "From incubation support to venture capital matching, legal IP frameworks to international market access, our holistic approach ensures Sri Lankan innovation earns its rightful place on the global stage, transforming local intellectual capital into long-term national prosperity.",
  ];

  const paragraphs =
    data?.paragraphs && data.paragraphs.length > 0
      ? data.paragraphs.map((p) => getMultiLangText(p, currentLang))
      : defaultParagraphs;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge={badge}
        title={title}
        subtitle={subtitle}
        breadcrumbs={[
          { label: "About Us", href: "/about-us" },
          { label: title },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content / Description */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary dark:text-pink-400 block mb-2">
                {overviewTitle}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                {overviewHeading}
              </h2>
            </div>

            {paragraphs.map((text, idx) => (
              <p
                key={idx}
                className={`text-gray-700 dark:text-gray-300 leading-relaxed ${
                  idx === 0 ? "text-base sm:text-lg" : "text-base"
                }`}
              >
                {text}
              </p>
            ))}
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 group">
              <img
                src={displayImage}
                alt={title}
                className="w-full h-[420px] sm:h-[520px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Ambient background glow */}
            <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] -z-10 blur-xl pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;

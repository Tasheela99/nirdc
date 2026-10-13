import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import { Quote, Award, CheckCircle } from "lucide-react";
import aboutUsContentApi, { DirectorMessageData, getMultiLangText } from "@/api/AboutUsContentApi";
import { useTranslation } from "react-i18next";

const DirectorMessagePage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [data, setData] = useState<DirectorMessageData | null>(null);

  useEffect(() => {
    let isMounted = true;
    aboutUsContentApi
      .getDirectorMessage()
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

  const badge = getMultiLangText(data?.badge, currentLang, "Leadership");
  const title = "Director Message";
  const quote = getMultiLangText(
    data?.quote,
    currentLang,
    "Sri Lanka possesses world-class minds. Our mission is to provide the institutional bridge that turns those minds into economic powerhouses."
  );
  const directorName = getMultiLangText(data?.directorName, currentLang, "Director General");
  const directorRole = getMultiLangText(
    data?.directorRole,
    currentLang,
    "National Initiative for R&D Commercialisation"
  );
  const directorImage = data?.directorImage;

  const defaultCredentials = [
    "Statutory Apex Authority",
    "Presidential Secretariat Alignment",
  ];
  const credentials =
    data?.credentials && data.credentials.length > 0
      ? data.credentials.map((c) => getMultiLangText(c, currentLang))
      : defaultCredentials;

  const defaultParagraphs = [
    "As we navigate an era of rapid technological shifts and global economic restructuring, Sri Lanka faces a definitive choice: to remain passive consumers of imported technology, or to become proud originators of high-value, exportable innovations.",
    "For decades, our universities, research institutions, and independent inventors have developed exceptional scientific breakthroughs. Yet, too often, these brilliant ideas remained confined to journal publications or dusty laboratory shelves, due to an absence of risk capital, intellectual property expertise, and industry synergy.",
    "The National Initiative for Research and Development Commercialisation (NIRDC) was founded with a singular, resolute mandate: to dismantle these barriers. We are here to ensure that every viable piece of Sri Lankan innovation receives the rigorous validation, seed capital, and commercial guidance needed to build sustainable enterprises.",
    "I warmly invite our researchers, innovators, industrialists, and investors both here and in our global diaspora to join hands with NIRDC. Together, we will spark an innovation renaissance that secures our nation's technological sovereignty and economic prosperity.",
  ];

  const paragraphs =
    data?.paragraphs && data.paragraphs.length > 0
      ? data.paragraphs.map((p) => getMultiLangText(p, currentLang))
      : defaultParagraphs;

  const signoffName = getMultiLangText(data?.signoffName, currentLang, directorName);
  const signoffRole = getMultiLangText(
    data?.signoffRole,
    currentLang,
    "National Initiative for R&D Commercialisation (NIRDC)"
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge={badge}
        title={title}
        subtitle="A personal address from the Director General on our mission to unlock Sri Lanka's intellectual potential."
        breadcrumbs={[
          { label: "About Us", href: "/about-us" },
          { label: "Director Message" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        {/* Main Quote Callout Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-white dark:via-white/5 to-white dark:to-[#1A0D15] relative overflow-hidden">
          <Quote className="absolute top-6 right-8 text-primary/15 dark:text-pink-400/15 w-24 h-24 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-pink-400 flex items-center gap-2">
              Director General's Statement
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
              "{quote}"
            </h2>
          </div>
        </div>

        {/* Message Body with Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Profile Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm text-center space-y-4">
            <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-tr from-primary to-pink-500 p-1 shadow-lg">
              {directorImage ? (
                <img
                  src={directorImage}
                  alt={directorName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  <span className="text-4xl font-black text-primary dark:text-pink-300">NIRDC</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{directorName}</h3>
              <p className="text-xs font-semibold text-primary dark:text-pink-400 uppercase tracking-wider mt-1">
                {directorRole}
              </p>
            </div>
            {credentials.length > 0 && (
              <div className="pt-4 border-t border-gray-100 dark:border-white/10 text-xs text-gray-500 space-y-2 text-left">
                {credentials.map((cred, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx === 0 ? (
                      <Award size={14} className="text-primary dark:text-pink-400 shrink-0" />
                    ) : (
                      <CheckCircle size={14} className="text-primary dark:text-pink-400 shrink-0" />
                    )}
                    <span>{cred}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Letter Body */}
          <div className="lg:col-span-2 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
            <p className="font-semibold text-gray-900 dark:text-white">
              Ayubowan and warm greetings,
            </p>

            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            <div className="pt-6">
              <p className="font-bold text-gray-900 dark:text-white text-base">
                {signoffName}
              </p>
              <p className="text-sm text-gray-500">
                {signoffRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorMessagePage;

import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Rocket, Package, Briefcase, BookOpen, Heart, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const TypewriterText = ({ text, delay = 50 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [index, text, delay]);

  const isFinished = index >= text.length;

  return (
    <span>
      {displayedText}
      {!isFinished && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block ml-1 w-[2px] h-[1em] bg-white/70 align-middle -mt-1"
        />
      )}
    </span>
  );
};

const StrategicObjectivesScreen: FC = () => {
  const { t } = useTranslation();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const sections = [
    {
      title: t('strategic.vision.title'),
      icon: Lightbulb,
      gradient: "from-blue-500 to-blue-600",
      borderColor: "border-blue-200",
      summary: t('strategic.vision.summary'),
      content: (
        <p className="text-gray-600 leading-relaxed">
          {t('strategic.vision.content')}
        </p>
      ),
    },
    {
      title: t('strategic.mission.title'),
      icon: Rocket,
      gradient: "from-indigo-500 to-indigo-600",
      borderColor: "border-indigo-200",
      summary: t('strategic.mission.summary'),
      content: (
        <p className="text-gray-600 leading-relaxed">
          {t('strategic.mission.content')}
        </p>
      ),
    },
    {
      title: t('strategic.gapFilling.title'),
      icon: Package,
      gradient: "from-emerald-500 to-emerald-600",
      borderColor: "border-emerald-200",
      summary: t('strategic.gapFilling.summary'),
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">{t('strategic.gapFilling.portfolioDev')}</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {(t('strategic.gapFilling.portfolioItems', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">{t('strategic.gapFilling.riskProcess')}</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {(t('strategic.gapFilling.riskItems', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: t('strategic.investorMatching.title'),
      icon: Briefcase,
      gradient: "from-amber-500 to-amber-600",
      borderColor: "border-amber-200",
      summary: t('strategic.investorMatching.summary'),
      content: (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">{t('strategic.investorMatching.heading')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {(t('strategic.investorMatching.items', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: t('strategic.knowledge.title'),
      icon: BookOpen,
      gradient: "from-violet-500 to-violet-600",
      borderColor: "border-violet-200",
      summary: t('strategic.knowledge.summary'),
      content: (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">{t('strategic.knowledge.heading')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {(t('strategic.knowledge.items', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: t('strategic.values.title'),
      icon: Heart,
      gradient: "from-rose-500 to-rose-600",
      borderColor: "border-rose-200",
      summary: t('strategic.values.summary'),
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {(t('strategic.values.items', { returnObjects: true }) as { key: string; value: string }[]).map((item, idx) => (
            <div key={idx} className="text-center p-3 bg-gray-50 rounded-xl">
              <span className="block font-semibold text-gray-800 text-sm mb-1">{item.key}</span>
              <span className="text-xs text-gray-500">{item.value}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const handleCardClick = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  // Apply dark mode styling overrides to sections
  const redesignedSections = sections.map((sec) => {
    if (sec.title === t('strategic.values.title')) {
      return {
        ...sec,
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {(t('strategic.values.items', { returnObjects: true }) as { key: string; value: string }[]).map((item, valIdx) => (
              <div key={valIdx} className="flex items-start gap-3 group/item">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500/60 group-hover/item:bg-rose-500 mt-2 shrink-0 transition-colors"></div>
                <div>
                  <span className="block font-semibold text-gray-800 dark:text-gray-100 text-sm mb-0.5">{item.key}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        )
      };
    }
    if (sec.title === t('strategic.vision.title') || sec.title === t('strategic.mission.title')) {
      return {
        ...sec,
        content: (
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-body">
            {sec.title === t('strategic.vision.title')
              ? t('strategic.vision.content')
              : t('strategic.mission.content')}
          </p>
        )
      };
    }
    if (sec.title === t('strategic.gapFilling.title')) {
      return {
        ...sec,
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('strategic.gapFilling.portfolioDev')}</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {(t('strategic.gapFilling.portfolioItems', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('strategic.gapFilling.riskProcess')}</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {(t('strategic.gapFilling.riskItems', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      };
    }
    if (sec.title === t('strategic.investorMatching.title')) {
      return {
        ...sec,
        content: (
          <div className="font-body">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('strategic.investorMatching.heading')}</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              {(t('strategic.investorMatching.items', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )
      };
    }
    if (sec.title === t('strategic.knowledge.title')) {
      return {
        ...sec,
        content: (
          <div className="font-body">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('strategic.knowledge.heading')}</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              {(t('strategic.knowledge.items', { returnObjects: true }) as string[]).map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )
      };
    }
    return sec;
  });

  const renderCoreCard = (section: any) => {
    const Icon = section.icon;
    return (
      <div className="relative mt-8 group h-full">
        <div className="bg-[#fafafa] dark:bg-dark-surface border-[1.5px] border-gray-200 dark:border-gray-700 pt-14 pb-10 px-8 text-center h-full transition-all duration-300 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 rounded-sm">
          {/* Overlapping Icon */}
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-[72px] h-[72px] bg-primary dark:bg-primary-dark rounded-full flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110 shadow-md">
            <Icon size={32} className="text-white" strokeWidth={1.5} />
          </div>

          <h3 className="text-lg font-bold text-[#333] dark:text-gray-100 uppercase tracking-[0.15em] mb-4 font-sans mt-2">
            {section.title}
          </h3>
          
          <div className="w-8 h-[2px] bg-gray-400 dark:bg-gray-500 mx-auto mb-6 transition-all duration-300 group-hover:w-12 group-hover:bg-primary dark:group-hover:bg-primary-light" />

          <div className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-body">
            {section.title === t('strategic.vision.title') ? (
              t('strategic.vision.content')
            ) : section.title === t('strategic.mission.title') ? (
              t('strategic.mission.content')
            ) : section.title === t('strategic.values.title') ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-left">
                {(t('strategic.values.items', { returnObjects: true }) as { key: string; value: string }[]).map((item, valIdx) => (
                  <div key={valIdx} className="bg-white dark:bg-dark-bg p-3 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-0.5 transition-transform">
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider block mb-1">{item.key}</span>
                    <span className="text-sm text-gray-500 block leading-snug">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-left">
                {section.content}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCard = (section: any, originalIndex: number, spanClass: string) => {
    const Icon = section.icon;
    const isExpanded = expandedCard === originalIndex;

    return (
      <motion.div
        key={originalIndex}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: originalIndex * 0.05, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => handleCardClick(originalIndex)}
        className={`group relative bg-white dark:bg-dark-surface rounded-2xl border ${section.borderColor} dark:border-dark-border p-6 cursor-pointer transition-all duration-200 active:scale-[0.98] hover:shadow-lg hover:-translate-y-0.5 ${
          isExpanded ? "ring-2 ring-primary/30 shadow-md -translate-y-0.5" : "shadow-sm"
        } ${spanClass}`}
      >
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-5 shadow group-hover:scale-105 transition-transform duration-200`}>
          <Icon size={24} className="text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors font-sans">
          {section.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 font-body">
          {section.summary}
        </p>

        {/* Expand indicator */}
        <div className={`flex items-center gap-1 text-xs font-semibold transition-all ${isExpanded ? 'text-primary' : 'text-gray-400 group-hover:text-primary'} mt-4`}>
          {isExpanded ? t('strategic.clickToClose') : t('strategic.viewDetails')}
          <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>

        {/* Inline Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div 
                className="pt-5 mt-5 border-t border-gray-100 dark:border-dark-border cursor-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {section.content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top gradient line */}
        <div className={`absolute top-0 left-6 right-6 h-1 bg-gradient-to-r ${section.gradient} rounded-b-full transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
      </motion.div>
    );
  };

  return (
    <section id="strategic-objectives" className="bg-white dark:bg-dark-bg py-16 sm:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 font-sans tracking-tight">
            {t('strategic.sectionTitle')}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-body">
            {t('strategic.sectionSubtitle')}
          </p>
        </motion.div>

        {/* Set 1: Core Identity (Vision, Mission, Values) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-16 pt-4">
          <div>{renderCoreCard(redesignedSections[1])}</div> {/* Mission */}
          <div>{renderCoreCard(redesignedSections[0])}</div> {/* Vision */}
          <div className="md:col-span-2">{renderCoreCard(redesignedSections[5])}</div> {/* Values */}
        </div>

        {/* Quote Banner */}
        <motion.div
          className="mb-12 relative rounded-2xl overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary to-primary-dark py-12 px-6 text-center">
            <blockquote className="text-xl sm:text-2xl text-white/95 italic font-sans font-medium max-w-3xl mx-auto leading-relaxed min-h-[80px] flex items-center justify-center">
              <TypewriterText text={t('strategic.quote')} delay={40} />
            </blockquote>
          </div>
        </motion.div>

        {/* Set 2: Core Strategy (Investor Matching, Knowledge, Gap Filling) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-8 pt-4">
          <div>{renderCoreCard(redesignedSections[3])}</div>
          <div>{renderCoreCard(redesignedSections[4])}</div>
          <div className="md:col-span-2">{renderCoreCard(redesignedSections[2])}</div>
        </div>
      </div>
    </section>
  );
};

export default StrategicObjectivesScreen;

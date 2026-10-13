import { FC } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  History,
  Building2,
  Users2,
  TrendingUp,
  Sparkles,
  Award,
  ShieldCheck,
  Landmark,
  Quote,
} from 'lucide-react';

const milestoneIcons = [
  Landmark, // Genesis & Presidential Mandate
  Users2, // Multidisciplinary Coalition
  Sparkles, // Closing the Gap
  TrendingUp, // Synergy with Policy & Industry
];

type Milestone = { year: string; title: string; desc: string };

const ease = [0.23, 1, 0.32, 1] as const;

// Brand accents (same family as the purple / maroon sections)
const accentGradient = 'linear-gradient(135deg, #8c2963 0%, #6f4eb9 100%)';

const OurHistorySection: FC = () => {
  const { t } = useTranslation();

  const raw = t('history.milestones', { returnObjects: true });
  const milestones: Milestone[] = Array.isArray(raw) ? (raw as Milestone[]) : [];

  const mandateBadge = t('history.mandate.badge', 'ජනාධිපති ලේකම් කාර්යාලයේ විධායක මෙහෙවර');
  const mandateTitle = t(
    'history.mandate.title',
    'ජාතික නවෝත්පාදන ආර්ථික යථාර්ථයක් බවට පත් කිරීම'
  );
  const stat1Value = t('history.stats.projects.value', '50+');
  const stat1Label = t('history.stats.projects.label', 'තක්සේරු කළ ජාතික පර්යේෂණ ව්‍යාපෘති');
  const stat2Value = t('history.stats.ip.value', '100%');
  const stat2Label = t('history.stats.ip.label', 'ශ්‍රී ලාංකික බුද්ධිමය දේපළ කේන්ද්‍රීයයි');
  const quoteSource = t(
    'history.quoteSource',
    'ජාතික පර්යේෂණ හා සංවර්ධන වාණිජකරණ මුලපිරීම (NIRDC)'
  );

  return (
    <section
      id="our-history"
      className="relative w-full py-12 sm:py-16 overflow-hidden text-gray-900"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #faf7fd 50%, #ffffff 100%)',
      }}
      aria-labelledby="our-history-title"
    >
      {/* soft decorative glows */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(140, 41, 99, 0.08) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(111, 78, 185, 0.10) 0%, transparent 70%)' }}
      />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* ─── Header ─── */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[#8c2963] bg-[#8c2963]/10 border border-[#8c2963]/20 text-xs font-extrabold tracking-[0.18em] uppercase mb-3"
          >
            <History size={14} />
            <span>{t('history.badge')}</span>
          </motion.div>

          <motion.h2
            id="our-history-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="text-3xl sm:text-4xl leading-tight font-extrabold tracking-tight mb-3 bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #2a0f55 0%, #8c2963 100%)' }}
          >
            {t('history.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="text-gray-600 text-base sm:text-lg leading-relaxed font-body"
          >
            {t('history.subtitle')}
          </motion.p>
        </div>

        {/* ─── Presidential Mandate Spotlight (compact) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="relative mb-8 sm:mb-10 p-6 sm:p-8 rounded-3xl overflow-hidden text-white"
          style={{
            background: 'linear-gradient(135deg, #2a0f55 0%, #5b1a52 55%, #8c2963 100%)',
            boxShadow: '0 20px 40px -20px rgba(42, 15, 85, 0.55)',
          }}
        >
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
            <Building2 size={220} strokeWidth={1.2} />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-8 space-y-2.5">
              <div
                className="flex items-center gap-2 text-pink-100 text-xs font-extrabold uppercase"
                style={{ letterSpacing: '0.18em' }}
              >
                <ShieldCheck size={16} className="shrink-0 text-amber-300" />
                <span>{mandateBadge}</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold leading-tight tracking-tight">
                {mandateTitle}
              </h3>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed font-body">
                {t('history.intro')}
              </p>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-3 pt-5 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/20 lg:pl-8">
              {[
                { value: stat1Value, label: stat1Label, valueClass: 'text-amber-300' },
                { value: stat2Value, label: stat2Label, valueClass: 'text-white' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-3.5 sm:p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                  }}
                >
                  <div className={`text-2xl sm:text-3xl font-extrabold mb-0.5 ${s.valueClass}`}>{s.value}</div>
                  <div className="text-xs sm:text-[13px] text-white/85 font-medium leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Timeline (compact grid: 4 across on desktop, 2 on tablet, 1 on mobile) ─── */}
        <div className="relative">
          {/* connector line behind the pins (desktop only) */}
          <div
            className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-[22px] h-0.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, rgba(140,41,99,0.35), rgba(111,78,185,0.35))' }}
          />

          <ol className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {milestones.map((item, idx) => {
              const IconComponent = milestoneIcons[idx % milestoneIcons.length] || Award;

              return (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease }}
                  className="flex flex-col"
                >
                  {/* Pin (desktop) */}
                  <div className="hidden lg:flex justify-center mb-3 relative z-10">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
                      style={{
                        background: accentGradient,
                        boxShadow: '0 0 0 5px #ffffff, 0 8px 18px -6px rgba(140, 41, 99, 0.55)',
                      }}
                    >
                      <IconComponent size={20} strokeWidth={1.9} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="group relative flex-1 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-[#8c2963]/30 transition-all duration-300 overflow-hidden p-5">
                    <div className="absolute inset-x-0 top-0 h-1" style={{ background: accentGradient }} />

                    <div className="flex items-center gap-3 mb-3 mt-1">
                      {/* icon inside card on mobile / tablet */}
                      <div
                        className="lg:hidden w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white"
                        style={{ background: accentGradient }}
                      >
                        <IconComponent size={18} strokeWidth={1.9} />
                      </div>
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase text-[#8c2963] bg-[#8c2963]/10"
                        style={{ letterSpacing: '0.14em' }}
                      >
                        {item.year}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold leading-snug mb-2 text-gray-900 group-hover:text-[#8c2963] transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-gray-600 text-sm leading-relaxed font-body">{item.desc}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* ─── Closing Quote (compact) ─── */}
        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mt-8 sm:mt-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left p-5 sm:p-6 rounded-2xl border border-[#6f4eb9]/20 bg-[#6f4eb9]/[0.06]"
        >
          <div
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white"
            style={{ background: accentGradient }}
          >
            <Quote size={20} strokeWidth={1.9} />
          </div>
          <div>
            <blockquote className="text-base sm:text-lg leading-relaxed font-semibold italic text-[#2a0f55] mb-1.5">
              &ldquo;{t('history.quote')}&rdquo;
            </blockquote>
            <figcaption
              className="text-xs text-[#8c2963] font-extrabold uppercase"
              style={{ letterSpacing: '0.14em' }}
            >
              {quoteSource}
            </figcaption>
          </div>
        </motion.figure>
      </div>
    </section>
  );
};

export default OurHistorySection;
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import VantaNetBackground from "./VantaNetBackground";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  compact?: boolean;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  badge,
  breadcrumbs,
  children,
  compact = false,
}) => {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-b from-[#2e091f] via-[#190512] to-[#0c0309] text-white border-b border-white/10 ${compact ? "pt-24 sm:pt-28 pb-8 sm:pb-10" : "pt-28 sm:pt-32 pb-10 sm:pb-14"
        }`}
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-pink-600/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Vanta Net Background */}
      <VantaNetBackground
        color={0xFF0B132B}
        backgroundColor={0x12030f}
        points={20.0}
        maxDistance={45.0}
        spacing={32.0}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-white/70 mb-5"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home size={14} />
              <span>Home</span>
            </Link>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  <ChevronRight size={13} className="text-white/40" />
                  {item.href && !isLast ? (
                    <Link
                      to={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">{item.label}</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-pink-200 bg-white/10 border border-white/20 backdrop-blur-md mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            {badge}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${compact
            ? "text-2xl sm:text-4xl lg:text-5xl mb-3"
            : "text-3xl sm:text-5xl lg:text-6xl mb-4"
            } font-extrabold text-white tracking-tight leading-tight font-sans`}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${compact
              ? "text-sm sm:text-base max-w-2xl"
              : "text-base sm:text-lg lg:text-xl max-w-3xl"
              } text-white/80 leading-relaxed`}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Children (e.g., search bar or action buttons) */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className={compact ? "mt-4 sm:mt-5" : "mt-6 sm:mt-8"}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHero;

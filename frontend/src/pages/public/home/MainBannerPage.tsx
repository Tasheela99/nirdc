import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileUp, FileCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import bannerApi from "../../../api/BannerApi";
import hero1 from "../../../assets/hero_01.png";
import hero2 from "../../../assets/hero_02.png";
import hero3 from "../../../assets/hero_03.png";
import mobileHero1 from "../../../assets/mobile_hero_01.jpg";
import mobileHero2 from "../../../assets/mobile_hero_02.jpg";
import mobileHero3 from "../../../assets/mobile_hero_03.jpg";

const fallbackBanners = [hero1, hero2, hero3];
const fallbackMobileBanners = [mobileHero1, mobileHero2, mobileHero3];

const MainBannerPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState<string[]>(fallbackBanners);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await bannerApi.getAllHomepageImages() as any;
        if (response.status === true && response.data?.bannerImages?.length > 0) {
          setBanners(response.data.bannerImages);
        }
      } catch {
        // Silent fallback to static images
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative w-full h-[85vh] sm:h-screen min-h-[500px] overflow-hidden" aria-label="Hero banner">
      {banners.map((banner, index) => {
        const bgImage = isMobile ? fallbackMobileBanners[index % fallbackMobileBanners.length] : banner;
        return (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            style={{ backgroundImage: `url(${bgImage})` }}
            role="img"
            aria-label={`Banner image ${index + 1}`}
          />
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 sm:from-black/70 sm:via-black/30 sm:to-transparent" />
      <div className="absolute inset-0 bg-primary/20" />

      <div className="relative h-full flex flex-col items-start justify-center text-left px-4 sm:px-12 pt-16 sm:pt-0 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-2xl w-full"
        >
          <div className="mb-3 sm:mb-5">
            <span className="text-white/90 text-[10px] sm:text-sm font-semibold tracking-wide uppercase">
              {t('banner.badge')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-6 leading-[1.15] sm:leading-[1.1] tracking-tight font-sans">
            {t('banner.titleLine1')}
            <br />
            <span style={{ color: "#8c2963" }}>{t('banner.titleLine2')}</span>
          </h1>

          <p className="text-sm sm:text-lg text-white/90 sm:text-white/80 mb-5 sm:mb-8 max-w-xl leading-relaxed font-body">
            {t('banner.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mt-2 sm:mt-8 w-full max-w-md sm:max-w-none">

            {/* SUBMIT button — glassy purple */}
            <button
              onClick={() => navigate("/login")}
              className="group relative flex flex-col items-center justify-center gap-3 sm:gap-5 flex-1 py-3 sm:py-0 sm:h-[190px] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(145deg, rgba(140, 41, 99, 0.50) 0%, rgba(100, 20, 65, 0.28) 100%)",
                border: "1px solid rgba(200, 80, 140, 0.40)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 8px 32px rgba(140, 41, 99, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              {/* Inner gloss sheen */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)",
                }}
              />
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: "linear-gradient(145deg, rgba(200,80,140,0.25) 0%, rgba(140,41,99,0.12) 100%)",
                }}
              />

              {/* Icon */}
              <FileUp
                className="w-8 h-8 sm:w-11 sm:h-11 text-pink-100 group-hover:scale-110 transition-transform duration-300 drop-shadow"
                strokeWidth={1.4}
              />

              {/* Text instead of pill */}
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "rgba(255,210,235,0.95)",
                  textTransform: "uppercase" as const,
                }}
              >
                USER LOGIN
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "rgba(255,190,225,0.70)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  transition: "color 0.2s",
                }}
                className="group-hover:!text-pink-100"
              >
                I Want To Submit Proposal
              </span>
            </button>

            {/* REVIEW button — glassy white/frost */}
            <button
              onClick={() => navigate("/reviewer-registration")}
              className="group relative flex flex-col items-center justify-center gap-3 sm:gap-5 flex-1 py-3 sm:py-0 sm:h-[190px] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(140,41,99,0.15) 100%)",
                border: "1px solid rgba(255,255,255,0.30)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 8px 32px rgba(140,41,99,0.20), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              {/* Inner gloss sheen */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
                }}
              />
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: "rgba(255,255,255,0.08)",
                }}
              />

              {/* Icon */}
              <FileCheck
                className="w-8 h-8 sm:w-11 sm:h-11 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow"
                strokeWidth={1.4}
              />

              {/* Text instead of pill */}
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.95)",
                  textTransform: "uppercase" as const,
                }}
              >
                REVIEWER REGISTRATION
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.65)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  transition: "color 0.2s",
                }}
                className="group-hover:!text-white"
              >
                I Want To Review Proposal
              </span>
            </button>

          </div>
        </motion.div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainBannerPage;
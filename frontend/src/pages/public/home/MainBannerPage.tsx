import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import bannerApi from "../../../api/BannerApi";
import banner1 from "../../../assets/b-1.jpg";
import banner2 from "../../../assets/b-2.jpg";
import banner3 from "../../../assets/b-3.jpg";
import banner4 from "../../../assets/b-4.jpg";

const fallbackBanners = [banner1, banner2, banner4, banner3];

const MainBannerPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState<string[]>(fallbackBanners);
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

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] overflow-hidden" aria-label="Hero banner">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${banner})` }}
          role="img"
          aria-label={`Banner image ${index + 1}`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-primary/20" />

      <div className="relative h-full flex flex-col items-start justify-center text-left px-6 sm:px-12 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-2xl"
        >
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-white/90 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              {t('banner.badge')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight font-sans">
            {t('banner.titleLine1')}
            <br />
            <span className="text-primary-light">{t('banner.titleLine2')}</span>
          </h1>

          <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl leading-relaxed font-body">
            {t('banner.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => navigate("/main-page")}
              className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
            >
              {t('banner.submitResearch')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/proposal")}
              className="flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 active:scale-[0.97]"
            >
              {t('banner.exploreProposals')}
            </button>
          </div>
        </motion.div>

        <div className="absolute bottom-8 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
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

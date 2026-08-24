import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import DOMPurify from 'dompurify';
import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import newsApi from "../../../api/NewsApi.ts";
import { useTranslation } from "react-i18next";

const NewsUpdatesScreen = () => {
  const { t, i18n } = useTranslation();
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNews = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await newsApi.getAllNews() as any;
      if (response.status === true) {
        setNewsList(response.data);
      } else {
        setError(t('news.fetchError'));
      }
    } catch {
      setError(t('news.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Skeleton loading cards
  if (isLoading) {
    return (
      <section id="updates-news" className="bg-white dark:bg-dark-bg py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="h-8 w-48 bg-gray-200 dark:bg-dark-surface rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-72 bg-gray-200 dark:bg-dark-surface rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface dark:bg-dark-surface rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-dark-border" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-24 bg-gray-200 dark:bg-dark-border rounded" />
                  <div className="h-5 w-full bg-gray-200 dark:bg-dark-border rounded" />
                  <div className="h-3 w-full bg-gray-200 dark:bg-dark-border rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-dark-border rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="updates-news" className="bg-white dark:bg-dark-bg py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">{error}</p>
          <button onClick={fetchNews} className="mt-4 text-primary hover:underline text-sm font-medium">
            {t('news.tryAgain')}
          </button>
        </div>
      </section>
    );
  }

  if (newsList.length === 0) return null;

  return (
    <section id="updates-news" className="bg-white dark:bg-dark-bg py-16 sm:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-text-primary dark:text-white mb-3 font-sans tracking-tight">
            {t('news.sectionTitle')}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-text-secondary dark:text-gray-400 max-w-xl mx-auto font-body">
            {t('news.sectionSubtitle')}
          </p>
        </motion.div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={true}
          autoplay={{ delay: 7000, disableOnInteraction: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={newsList.length > 3}
          className="pb-4"
        >
          {(newsList).map((item: any) => {
            const currentLang = i18n.language || 'en';
            
            const isFieldEmpty = (val: string) => !val || (val.replace(/<[^>]*>?/gm, '').trim() === '' && !val.includes('<img'));

            const getLocalizedField = (fieldName: string) => {
              if (currentLang.startsWith('si')) {
                  const val = item[`${fieldName}Si`];
                  return isFieldEmpty(val) ? item[`${fieldName}En`] : val;
              }
              if (currentLang.startsWith('ta')) {
                  const val = item[`${fieldName}Ta`];
                  return isFieldEmpty(val) ? item[`${fieldName}En`] : val;
              }
              return item[`${fieldName}En`];
            };

            const getLocalizedImage = () => {
              if (currentLang.startsWith('si') && item.imageSi) return item.imageSi;
              if (currentLang.startsWith('ta') && item.imageTa) return item.imageTa;
              if (currentLang.startsWith('en') && item.imageEn) return item.imageEn;
              return item.commonImage;
            };

            const title = getLocalizedField('title');
            const content = getLocalizedField('content');
            const image = getLocalizedImage();

            return (
            <SwiperSlide key={item._id}>
              <article className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] group flex flex-col h-full">
                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={image || "https://fakeimg.pl/600x400"}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary dark:text-gray-400 mb-3 font-body">
                    <Calendar size={12} className="text-primary" />
                    {item.date ? new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    }) : t('news.dateNotAvailable')}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-text-primary dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors font-sans leading-snug">
                    {title || t('news.untitledArticle')}
                  </h3>

                  {/* Description */}
                  <div
                    className="text-sm text-text-secondary dark:text-gray-400 mb-5 line-clamp-3 prose prose-sm max-w-none font-body flex-grow"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(content || t('news.contentNotAvailable'))
                    }}
                  />

                  {/* Read More */}
                  <div className="pt-2">
                    <Link
                      to={`/news-updates/${item.slug || item._id}`}
                      className="inline-flex items-center text-primary dark:text-primary-light font-semibold hover:text-primary-dark dark:hover:text-white transition-colors duration-300 text-sm"
                    >
                      {t('news.readMore')}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          )})}
        </Swiper>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            to="/all-news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-150 active:scale-95"
          >
            {t('news.viewAllNews')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsUpdatesScreen;

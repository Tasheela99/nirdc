import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import bannerApi from "../../../api/BannerApi";
import { useTranslation } from 'react-i18next';
import Image1 from "../../../assets/about-1.png";
import Image2 from "../../../assets/about-2.png";
import Image3 from "../../../assets/about-3.png";
import Image4 from "../../../assets/about-4.png";

const fallbackImages = [Image1, Image2, Image3, Image4];

const AboutUsScreen: FC = () => {
  const { t } = useTranslation();
  const [galleryImages, setGalleryImages] = useState<string[]>(fallbackImages);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await bannerApi.getAllHomepageImages() as any;
        if (response.status === true && response.data?.aboutUsImages?.length > 0) {
          // ensure we have exactly 4 images for the 2x2 grid layout
          let fetched = response.data.aboutUsImages;
          // repeat items if less than 4
          while (fetched.length < 4) {
            fetched = [...fetched, ...fetched];
          }
          setGalleryImages(fetched.slice(0, 4));
        }
      } catch {
        // Silent fallback to static images
      }
    };
    fetchImages();
  }, []);

  // Tailwind rounded corner classes for the central cross shape effect
  // Top-left: rounded bottom-right
  // Top-right: rounded bottom-left
  // Bottom-left: rounded top-right
  // Bottom-right: rounded top-left
  const roundedClasses = [
    "rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-[4rem] md:rounded-br-[6rem]",
    "rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-[4rem] md:rounded-bl-[6rem]",
    "rounded-tl-3xl rounded-bl-3xl rounded-br-3xl rounded-tr-[4rem] md:rounded-tr-[6rem]",
    "rounded-tr-3xl rounded-bl-3xl rounded-br-3xl rounded-tl-[4rem] md:rounded-tl-[6rem]"
  ];

  return (
    <section id="about-us" className="bg-gradient-to-br from-primary to-primary-dark min-h-auto pt-32 pb-20 text-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-sans tracking-tight">
              {t('about.title')}
            </h2>
            <div className="w-16 h-1 bg-white rounded-full mb-8" />

            <div className="mb-8 lg:mb-14">
              <p className="text-white/90 text-lg leading-relaxed max-w-4xl font-body">
                {t('about.description')}
              </p>
            </div>
          </motion.div>

          {/* Right Column - Collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className={`overflow-hidden group aspect-square shadow-2xl ${roundedClasses[index]}`}
              >
                <img
                  src={image}
                  alt={`About Us ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutUsScreen;

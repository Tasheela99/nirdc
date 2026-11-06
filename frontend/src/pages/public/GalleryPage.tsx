import React, { useState } from "react";
import PageHero from "@/components/common/PageHero";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Calendar } from "lucide-react";

import about1 from "@/assets/about-1.png";
import about2 from "@/assets/about-2.png";
import about3 from "@/assets/about-3.png";
import about4 from "@/assets/about-4.png";
import hero1 from "@/assets/hero_01.png";
import hero2 from "@/assets/hero_02.png";
import hero3 from "@/assets/hero_03.png";
import b1 from "@/assets/b-1.jpg";
import b2 from "@/assets/b-2.jpg";

interface GalleryItem {
  id: string;
  title: { en: string; si: string; ta: string };
  category: "all" | "events" | "research" | "initiatives";
  image: string;
  date: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: {
      en: "National R&D Commercialisation Launch Forum",
      si: "ජාතික පර්යේෂණ වාණිජකරණ සමාරම්භක සමුළුව",
      ta: "தேசிய ஆராய்ச்சி வர்த்தகமயமாக்கல் தொடக்க மாநாடு",
    },
    category: "events",
    image: hero1,
    date: "2026-02-15",
  },
  {
    id: "2",
    title: {
      en: "State Scientific Delegation & Laboratory Tour",
      si: "රාජ්‍ය විද්‍යාත්මක නියෝජිත පිරිස සහ රසායනාගාර නිරීක්ෂණය",
      ta: "அரசு அறிவியல் பிரதிநிதிகள் ஆய்வக பார்வை",
    },
    category: "research",
    image: hero2,
    date: "2026-01-28",
  },
  {
    id: "3",
    title: {
      en: "High-Tech Prototyping Innovation Hub",
      si: "උසස් තාක්ෂණික මූලාකෘති නිර්මාණ නවෝත්පාදන කේන්ද්‍රය",
      ta: "உயர் தொழில்நுட்ப மாதிரி கண்டுபிடிப்பு மையம்",
    },
    category: "research",
    image: hero3,
    date: "2026-01-10",
  },
  {
    id: "4",
    title: {
      en: "Presidential Secretariat Commercialisation Review",
      si: "ජනාධිපති ලේකම් කාර්යාල වාණිජකරණ ප්‍රගති සමාලෝචනය",
      ta: "ஜனாதிபதி செயலக வர்த்தகமயமாக்கல் முன்னேற்ற மீளாய்வு",
    },
    category: "events",
    image: about1,
    date: "2025-12-05",
  },
  {
    id: "5",
    title: {
      en: "Industry-Academic Partnership Roundtable",
      si: "කර්මාන්ත හා විශ්වවිද්‍යාල සහයෝගිතා වටමේස සාකච්ඡාව",
      ta: "தொழில்துறை-பல்கலைக்கழக கூட்டாண்மை வட்டமேசை மாநாடு",
    },
    category: "initiatives",
    image: about2,
    date: "2025-11-20",
  },
  {
    id: "6",
    title: {
      en: "Clean Energy & Sustainable Technologies Showcase",
      si: "තිරසාර බලශක්ති සහ පරිසර හිතකාමී තාක්ෂණ දැක්ම",
      ta: "நிலையான ஆற்றல் மற்றும் தொழில்நுட்ப கண்காட்சி",
    },
    category: "initiatives",
    image: about3,
    date: "2025-10-18",
  },
  {
    id: "7",
    title: {
      en: "National Research Advisory Committee Convention",
      si: "ජාතික පර්යේෂණ උපදේශක කමිටු සම්මේලනය",
      ta: "தேசிய ஆராய்ச்சி ஆலோசனைக் குழு மாநாடு",
    },
    category: "events",
    image: about4,
    date: "2025-09-14",
  },
  {
    id: "8",
    title: {
      en: "Biotech & Agritech Commercialization Showcase",
      si: "ජෛව හා කෘෂි තාක්ෂණික වාණිජකරණ ප්‍රදර්ශනය",
      ta: "உயிரியல் மற்றும் விவசாய தொழில்நுட்ப கண்காட்சி",
    },
    category: "research",
    image: b1,
    date: "2025-08-22",
  },
  {
    id: "9",
    title: {
      en: "Youth Innovation & Entrepreneurship Mentorship",
      si: "තරුණ නවෝත්පාදන සහ ව්‍යවසායකත්ව උපදේශන සැසිය",
      ta: "இளைஞர் கண்டுபிடிப்பு மற்றும் தொழில்முனைவோர் வழிகாட்டுதல்",
    },
    category: "initiatives",
    image: b2,
    date: "2025-07-30",
  },
];

const GalleryPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language?.startsWith("si") ? "si" : i18n.language?.startsWith("ta") ? "ta" : "en") as "en" | "si" | "ta";

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = [
    { key: "all", label: currentLang === "si" ? "සියල්ල" : currentLang === "ta" ? "அனைத்தும்" : "All Photos" },
    { key: "events", label: currentLang === "si" ? "සමුළු සහ උත්සව" : currentLang === "ta" ? "நிகழ்வுகள்" : "Events & Forums" },
    { key: "research", label: currentLang === "si" ? "පර්යේෂණ සහ නවෝත්පාදන" : currentLang === "ta" ? "ஆராய்ச்சிகள்" : "Research & Labs" },
    { key: "initiatives", label: currentLang === "si" ? "ජාතික වැඩසටහන්" : currentLang === "ta" ? "திட்டங்கள்" : "National Initiatives" },
  ];

  const filteredItems = activeCategory === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const heroTitle = currentLang === "si" ? "ඡායාරූප එකතුව" : currentLang === "ta" ? "படத்தொகுப்பு" : "Gallery";
  const heroSubtitle = currentLang === "si"
    ? "NIRDC ආයතනයේ ප්‍රධාන වැඩසටහන්, පර්යේෂණ ව්‍යාපෘති සහ ජාතික නවෝත්පාදන සමුළු වල විශේෂ අවස්ථා."
    : currentLang === "ta"
    ? "NIRDC இன் முக்கிய நிகழ்வுகள், ஆராய்ச்சி திட்டங்கள் மற்றும் தேசிய கண்டுபிடிப்பு மாநாடுகளின் சிறப்பம்சங்கள்."
    : "Highlights from NIRDC national forums, research commercialization breakthroughs, and innovation showcases.";

  return (
    <div className="min-h-screen bg-[#edf2f7] text-slate-900">
      <PageHero
        badge={heroTitle}
        title={heroTitle}
        subtitle={heroSubtitle}
        breadcrumbs={[
          { label: heroTitle },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-black text-white shadow-md scale-105"
                    : "bg-white text-slate-700 hover:text-black border border-slate-200/90 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => {
            const title = item.title[currentLang] || item.title.en;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <ZoomIn size={22} />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                      <Calendar size={13} />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                      {title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title[currentLang] || selectedImage.title.en}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
              <div className="p-6 bg-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                  <Calendar size={14} />
                  <span>{selectedImage.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedImage.title[currentLang] || selectedImage.title.en}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;

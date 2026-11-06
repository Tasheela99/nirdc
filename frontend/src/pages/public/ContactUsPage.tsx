import React from "react";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/common/PageHero";
import ContactUsSection from "./home/ContactUsSection";

const ContactUsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language?.startsWith("si") ? "si" : i18n.language?.startsWith("ta") ? "ta" : "en") as "en" | "si" | "ta";

  const heroBadge = t("header.contactUs", "Contact Us");
  const heroTitle = currentLang === "si"
    ? "අප හා සම්බන්ධ වන්න"
    : currentLang === "ta"
    ? "எங்களைத் தொடர்பு கொள்ளவும்"
    : "Contact Us";

  const heroSubtitle = currentLang === "si"
    ? "ඔබගේ පර්යේෂණ වාණිජකරණ විමසීම්, යෝජනා හෝ අවශ්‍යතා සඳහා අප හා සම්බන්ධ වන්න."
    : currentLang === "ta"
    ? "உங்கள் விசாரணைகள் மற்றும் கருத்துக்களுக்காக எங்களைத் தொடர்பு கொள்ளவும்."
    : "Reach out to the NIRDC team for research commercialization inquiries, investor matching, or public feedback.";

  return (
    <div className="min-h-screen bg-[#edf2f7] text-slate-900">
      {/* Page Hero */}
      <PageHero
        badge={heroBadge}
        title={heroTitle}
        subtitle={heroSubtitle}
        breadcrumbs={[
          { label: t("header.contactUs", "Contact Us") },
        ]}
      />

      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto relative z-10">
          <ContactUsSection />
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;

import React from "react";
import PageHero from "@/components/common/PageHero";
import { useTranslation } from "react-i18next";

const FunctionsServicesPage: React.FC = () => {
  const { t } = useTranslation();

  const functionsList: string[] = t("functionsServices.functionsList", {
    returnObjects: true,
    defaultValue: [
      "ආසන්න වශයෙන් නිම කරන ලද පර්යේෂණ හා සංවර්ධන (R&D) ව්‍යාපෘති සඳහා රජයේ මූල්‍ය ප්‍රතිපාදන (රුපියල් මිලියන 500 ක් දක්වා) ලබා දීම.",
      "සම්පූර්ණ කරන ලද පර්යේෂණ හා සංවර්ධන (R&D) ව්‍යාපෘති වලට ආයෝජකයින් ගැලපීම.",
      "දැනටමත් ආයෝජකයන් සම්බන්ධ කරගෙන සිටින පර්යේෂකයන්ගේ ගැටළු විසදීම.",
      "පර්යේෂණ හා සංවර්ධන ආශ්‍රිතව ජනතාව දැනුවත් කිරීම සහ පර්යේෂණ ආශ්‍රිත දැනුම ප්‍රචාරය කිරීම.",
    ],
  }) as string[];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        title={t("functionsServices.title", "Functions & Services")}
        subtitle={t(
          "functionsServices.subtitle",
          "Key commercialisation services provided by the National Initiative for Research and Development Commercialisation for state and semi-government institutions, researchers, innovators, and entrepreneurs."
        )}
        breadcrumbs={[
          { label: t("header.home", "Home"), href: "/" },
          { label: t("functionsServices.title", "Functions & Services") },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Introduction Narrative - Centered, no box */}
        <div className="max-w-4xl mx-auto text-center text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed">
          <p>
            {t(
              "functionsServices.intro",
              "The main services provided by the National Initiative for Research and Development Commercialisation (NIRDC) for state and semi-government institutions, researchers, innovators, and entrepreneurs regarding the commercialisation of Research and Development (R&D) projects are outlined below:"
            )}
          </p>
        </div>

        {/* Key Functions Section - 2 boxes per row */}
        <div className="space-y-6">
          <div className="pb-2 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t("functionsServices.mainFunctionsTitle", "Key Functions")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {Array.isArray(functionsList) &&
              functionsList.map((item, index) => (
                <div
                  key={index}
                  className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 shadow-xs flex items-start gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="font-mono text-base sm:text-lg font-bold text-primary dark:text-pink-400 shrink-0 pt-0.5">
                    0{index + 1}.
                  </span>
                  <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionsServicesPage;

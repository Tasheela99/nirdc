import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Printer,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import ContactApi, { ContactInfoData, HeadOfficeOfficerData } from "../../api/ContactApi";

interface ContactUsPageProps {
  defaultTab?: "inquiry" | "head-office";
}

const ContactUsPage: React.FC<ContactUsPageProps> = ({ defaultTab = "inquiry" }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = (i18n.language?.startsWith("si") ? "si" : i18n.language?.startsWith("ta") ? "ta" : "en") as "en" | "si" | "ta";

  // Tab State
  const [activeTab, setActiveTab] = useState<"inquiry" | "head-office">(() => {
    if (location.pathname.includes("head-office") || defaultTab === "head-office") {
      return "head-office";
    }
    return "inquiry";
  });

  useEffect(() => {
    if (location.pathname.includes("head-office")) {
      setActiveTab("head-office");
    } else if (location.pathname.includes("inquiry")) {
      setActiveTab("inquiry");
    }
  }, [location.pathname]);

  // General Contact Info State
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);

  useEffect(() => {
    ContactApi.getContactInfo()
      .then((res) => {
        if (res?.data) {
          setContactInfo(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitMode, setSubmitMode] = useState<"APP" | "EMAIL">("APP");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Officers State
  const [officers, setOfficers] = useState<HeadOfficeOfficerData[]>([]);

  useEffect(() => {
    if (activeTab === "head-office") {
      ContactApi.getHeadOfficeOfficers()
        .then((res) => {
          if (res?.data) {
            setOfficers(res.data);
          }
        })
        .catch(() => {
          // fallback default will be displayed
        });
    }
  }, [activeTab]);

  const handleFormSubmit = async (e: React.FormEvent, directMode?: "APP" | "EMAIL") => {
    e.preventDefault();
    setSubmitError(null);

    const mode = directMode || submitMode;

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitError(
        currentLang === "si"
          ? "කරුණාකර සියලුම අනිවාර්ය ක්ෂේත්‍ර (නම, විද්‍යුත් තැපෑල, මාතෘකාව, පණිවුඩය) සම්පූර්ණ කරන්න."
          : currentLang === "ta"
          ? "தயவுசெய்து தேவையான அனைத்து புலங்களையும் பூர்த்தி செய்யவும்."
          : "Please complete all required fields (Name, Email, Subject, Message)."
      );
      return;
    }

    if (mode === "EMAIL") {
      // Open in Email Client
      const mailtoUrl = `mailto:nirdc@presidentsoffice.lk?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoUrl;

      // Also record in backend asynchronously
      ContactApi.submitInquiry({
        ...formData,
        submissionMethod: "EMAIL_CLIENT",
      }).catch(() => {});

      setSubmitted(true);
      return;
    }

    // Submit via Web Portal App
    setSubmitting(true);
    try {
      await ContactApi.submitInquiry({
        ...formData,
        submissionMethod: "APP",
      });
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ||
          (currentLang === "si"
            ? "පණිවුඩය යොමු කිරීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න."
            : "Failed to send message. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getLocalized = (obj?: { en?: string; si?: string; ta?: string }, fallback = "") => {
    if (!obj) return fallback;
    return obj[currentLang] || obj.en || fallback;
  };

  return (
    <div className="min-h-screen bg-[#09030c] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[550px] h-[550px] bg-pink-700/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto relative z-10 space-y-10">


        {/* Tab 1: INQUIRY (විමසීම්) */}
        {activeTab === "inquiry" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
          >
            {/* Left Card: Direct Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div
                className="relative rounded-3xl p-7 sm:p-9 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-6 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(155deg, rgba(255, 255, 255, 0.12) 0%, rgba(140, 41, 99, 0.20) 45%, rgba(18, 9, 28, 0.90) 100%)",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                {/* Header Title */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                    {currentLang === "si" ? "විමසීම් (Inquiry)" : currentLang === "ta" ? "விசாரணைகள் (Inquiry)" : "Public Inquiries"}
                  </h2>
                  <p className="text-xs sm:text-sm text-pink-200/90 mt-1 font-medium">
                    {currentLang === "si"
                      ? "පර්යේෂණ හා සංවර්ධන වාණිජකරණ ජාතික ප්‍රවේශය"
                      : "National Initiative for Research & Development Commercialization"}
                  </p>
                </div>

                <div className="h-[1px] bg-white/15 w-full" />

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-pink-300 flex items-center justify-center shrink-0 border border-white/15 backdrop-blur-md shadow-sm">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      {currentLang === "si" ? "ලිපිනය (Address)" : "Address"}
                    </h3>
                    <p className="text-sm text-white/90 mt-1 leading-relaxed font-medium">
                      {getLocalized(
                        contactInfo?.location?.address,
                        currentLang === "si"
                          ? "පර්යේෂණ හා සංවර්ධන වාණිජකරණ ජාතික ප්‍රවේශය, ජනාධිපති කාර්යාලය, ගාලුමුවදොර, කොළඹ 01, ශ්‍රී ලංකාව."
                          : "National Initiative for Research & Development Commercialization, President's Office, Galle Face, Colombo 01, Sri Lanka."
                      )}
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center shrink-0 border border-white/15 backdrop-blur-md shadow-sm">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      {currentLang === "si" ? "දුරකථනය (Telephone)" : "Telephone"}
                    </h3>
                    <a
                      href={`tel:${(contactInfo?.telephone?.number || "+94 (0)11 2354 354").replace(/\s+/g, "")}`}
                      className="text-base text-emerald-300 hover:text-white font-semibold transition-colors mt-1 block"
                    >
                      {contactInfo?.telephone?.number || "+94 (0)11 2354 354"}
                    </a>
                  </div>
                </div>

                {/* Fax */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-sky-300 flex items-center justify-center shrink-0 border border-white/15 backdrop-blur-md shadow-sm">
                    <Printer size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      {currentLang === "si" ? "Fax අංකය (Fax Number)" : "Fax Number"}
                    </h3>
                    <span className="text-sm text-white/85 font-medium mt-1 block">
                      {contactInfo?.fax?.number || "+94 (0)11 2354 355"}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-purple-300 flex items-center justify-center shrink-0 border border-white/15 backdrop-blur-md shadow-sm">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      {currentLang === "si" ? "විද්‍යුත් තැපෑල (Email)" : "Email Inquiries"}
                    </h3>
                    <a
                      href={`mailto:${contactInfo?.email?.address || "nirdc@presidentsoffice.lk"}`}
                      className="text-sm text-pink-300 hover:text-white font-semibold transition-colors mt-1 block"
                    >
                      {contactInfo?.email?.address || "nirdc@presidentsoffice.lk"}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0 border border-white/15 backdrop-blur-md shadow-sm">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      {currentLang === "si" ? "සේවා කාලය (Working Hours)" : "Working Hours"}
                    </h3>
                    <p className="text-sm text-white/85 mt-1 font-medium">
                      {getLocalized(
                        contactInfo?.workingHours?.schedule,
                        currentLang === "si"
                          ? "සඳුදා - සිකුරාදා: පෙ.ව. 8:30 - ප.ව. 4:30"
                          : "Monday - Friday: 8:30 AM - 4:30 PM"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Required Contact Form with Dual Submission (Email or App) */}
            <div className="lg:col-span-7">
              <div
                className="relative rounded-3xl p-7 sm:p-10 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(155deg, rgba(255, 255, 255, 0.12) 0%, rgba(120, 35, 90, 0.20) 50%, rgba(14, 7, 24, 0.92) 100%)",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                    {currentLang === "si"
                      ? "සම්බන්ධතා පෝරමය (Contact Form)"
                      : currentLang === "ta"
                      ? "தொடர்பு படிவம் (Contact Form)"
                      : "Inquiry & Contact Form"}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/75 mt-1.5 leading-relaxed">
                    {currentLang === "si"
                      ? "අනිවාර්යයෙන්ම පිරවිය යුතු තීරු (*) සම්පූර්ණ කර Send Email හෝ App පහසුකම ඔස්සේ අප වෙත යොමු කරන්න."
                      : "Please fill in all mandatory fields (*) and submit directly via the portal Web App or your Email client."}
                  </p>
                </div>

                {submitError && (
                  <div className="p-4 mb-6 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-3 text-red-200 text-sm">
                    <AlertCircle size={20} className="shrink-0 text-red-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                {submitted ? (
                  <div className="p-8 text-center bg-emerald-500/15 border border-emerald-500/30 rounded-2xl space-y-4">
                    <CheckCircle2 size={52} className="text-emerald-400 mx-auto" />
                    <h3 className="text-emerald-200 font-extrabold text-xl">
                      {currentLang === "si" ? "ඔබගේ පණිවුඩය සාර්ථකව ලැබිණි!" : "Message Submitted Successfully!"}
                    </h3>
                    <p className="text-sm text-white/80 max-w-md mx-auto">
                      {currentLang === "si"
                        ? "ඔබගේ විමසීම NIRDC නිලධාරී මණ්ඩලය වෙත යොමු කර ඇත. නුදුරේදීම ඔබ හා සම්බන්ධ වන්නෙමු."
                        : "Your inquiry has been successfully forwarded to NIRDC. Our team will review and respond promptly."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/15 hover:bg-white/25 transition-all cursor-pointer"
                    >
                      {currentLang === "si" ? "තවත් පණිවුඩයක් යොමු කරන්න" : "Send Another Message"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleFormSubmit(e)} className="space-y-5">
                    {/* Submission Mode Selector */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                        {currentLang === "si" ? "යොමු කිරීමේ ක්‍රමය (Submission Method)" : "Submission Method"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setSubmitMode("APP")}
                          className={`flex items-center gap-2.5 p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-left cursor-pointer ${
                            submitMode === "APP"
                              ? "bg-primary/40 border-pink-500 text-white shadow-md"
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <ShieldCheck size={18} className={submitMode === "APP" ? "text-pink-300" : "text-white/40"} />
                          <div>
                            <p className="font-bold">
                              {currentLang === "si" ? "Send via App (පද්ධතිය මඟින්)" : "Submit via Web App"}
                            </p>
                            <p className="text-[11px] opacity-75">
                              {currentLang === "si" ? "වෙබ් අඩවිය ඔස්සේ සෘජුවම" : "Direct portal submission"}
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSubmitMode("EMAIL")}
                          className={`flex items-center gap-2.5 p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-left cursor-pointer ${
                            submitMode === "EMAIL"
                              ? "bg-primary/40 border-pink-500 text-white shadow-md"
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Mail size={18} className={submitMode === "EMAIL" ? "text-pink-300" : "text-white/40"} />
                          <div>
                            <p className="font-bold">
                              {currentLang === "si" ? "Send Email (ඊමේල් මඟින්)" : "Send via Email App"}
                            </p>
                            <p className="text-[11px] opacity-75">
                              {currentLang === "si" ? "ඔබගේ Email App එක ඔස්සේ" : "Opens your mail client"}
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Form Input Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name - Required */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                          {currentLang === "si" ? "නම (Name)" : "Full Name"} <span className="text-pink-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all text-sm"
                          placeholder={currentLang === "si" ? "ඔබගේ නම ඇතුළත් කරන්න" : "e.g. Dr. Jane Perera"}
                        />
                      </div>

                      {/* Email - Required */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                          {currentLang === "si" ? "විද්‍යුත් තැපෑල (Email)" : "Email Address"} <span className="text-pink-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all text-sm"
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>

                    {/* Subject - Required */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                        {currentLang === "si" ? "මාතෘකාව (Subject)" : "Subject"} <span className="text-pink-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all text-sm"
                        placeholder={
                          currentLang === "si"
                            ? "විමසීමට අදාළ මාතෘකාව (e.g. පර්යේෂණ වාණිජකරණය පිළිබඳ විමසීමක්)"
                            : "e.g. R&D Commercialization Inquiry"
                        }
                      />
                    </div>

                    {/* Message - Required */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                        {currentLang === "si" ? "පණිවුඩය (Message)" : "Message"} <span className="text-pink-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all text-sm resize-none"
                        placeholder={
                          currentLang === "si"
                            ? "ඔබගේ විමසීම හෝ පණිවුඩය මෙහි සටහන් කරන්න..."
                            : "Write your message or inquiry here..."
                        }
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-pink-600 hover:from-primary-dark hover:to-pink-700 shadow-lg shadow-primary/30 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        {submitMode === "APP" ? (
                          <>
                            <Send size={18} />
                            <span>
                              {submitting
                                ? currentLang === "si"
                                  ? "යොමු වෙමින්..."
                                  : "Submitting..."
                                : currentLang === "si"
                                ? "Send via App (පද්ධතිය මඟින්)"
                                : "Submit via App"}
                            </span>
                          </>
                        ) : (
                          <>
                            <ExternalLink size={18} />
                            <span>
                              {currentLang === "si" ? "Send Email (ඊමේල් මඟින්)" : "Send via Email Client"}
                            </span>
                          </>
                        )}
                      </button>

                      {/* Quick alternate trigger */}
                      <button
                        type="button"
                        onClick={(e) => handleFormSubmit(e, submitMode === "APP" ? "EMAIL" : "APP")}
                        className="px-5 py-3.5 rounded-xl text-xs font-semibold text-white/80 bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-center cursor-pointer"
                      >
                        {submitMode === "APP"
                          ? currentLang === "si"
                            ? "හෝ Send Email මඟින් යවන්න"
                            : "Or Send via Email App"
                          : currentLang === "si"
                          ? "හෝ Web App මඟින් යවන්න"
                          : "Or Submit via Web App"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: HEAD OFFICE (ප්‍රධාන කාර්යාලය) */}
        {activeTab === "head-office" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Head Office Overview Card */}
            <div
              className="relative rounded-3xl p-7 sm:p-9 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(155deg, rgba(255, 255, 255, 0.12) 0%, rgba(140, 41, 99, 0.20) 45%, rgba(18, 9, 28, 0.90) 100%)",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider">
                    <Building2 size={14} />
                    <span>{currentLang === "si" ? "ප්‍රධාන කාර්යාලය" : "Head Office Directorate"}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {currentLang === "si"
                      ? "ජාතික පර්යේෂණ හා සංවර්ධන වාණිජකරණ ප්‍රවේශය - ප්‍රධාන කාර්යාලය"
                      : "National Initiative for Research and Development Commercialization - Head Office"}
                  </h2>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {currentLang === "si"
                      ? "ජනාධිපති කාර්යාලය, ගාලුමුවදොර, කොළඹ 01, ශ්‍රී ලංකාව. පර්යේෂණ වාණිජකරණය, ව්‍යාපෘති අධීක්ෂණය සහ පරිපාලන කටයුතු සම්බන්ධීකරණය මෙහිදී සිදු කෙරේ."
                      : "President's Office, Galle Face, Colombo 01, Sri Lanka. Serving as the primary national nexus for R&D commercialization policies, industry linkages, and administration."}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-emerald-300 shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase font-bold text-white/60">
                        {currentLang === "si" ? "පොදු දුරකථන අංකය" : "General Telephone"}
                      </p>
                      <a
                        href={`tel:${(contactInfo?.telephone?.number || "+94 (0)11 2354 354").replace(/\s+/g, "")}`}
                        className="text-sm font-bold text-white hover:text-emerald-300"
                      >
                        {contactInfo?.telephone?.number || "+94 (0)11 2354 354"}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Printer size={18} className="text-sky-300 shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase font-bold text-white/60">
                        {currentLang === "si" ? "Fax අංකය" : "Fax"}
                      </p>
                      <p className="text-sm font-bold text-white">
                        {contactInfo?.fax?.number || "+94 (0)11 2354 355"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-pink-300 shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase font-bold text-white/60">
                        {currentLang === "si" ? "විද්‍යුත් තැපෑල" : "Email"}
                      </p>
                      <a
                        href={`mailto:${contactInfo?.email?.address || "nirdc@presidentsoffice.lk"}`}
                        className="text-sm font-bold text-pink-300 hover:text-white"
                      >
                        {contactInfo?.email?.address || "nirdc@presidentsoffice.lk"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Officer Directory Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {currentLang === "si"
                      ? "කාර්යාල නිලධාරීන්ගේ තොරතුරු (Office Officers & Directory)"
                      : currentLang === "ta"
                      ? "அலுவலக அதிகாரிகள் விவரம்"
                      : "Head Office Officers & Key Contacts"}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">
                    {currentLang === "si"
                      ? "(මෙහි කාර්යාල නිලධාරීන්ට අදාළ තොරතුරු ඇතුළත් කර ඇත. අනවශ්‍ය නම් මෙම කොටස ඉවත් කළ හැක)"
                      : "(Official contact information for head office directorates. Section can be modified as needed)"}
                  </p>
                </div>
                <div className="text-xs text-pink-300/80 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-lg shrink-0">
                  {currentLang === "si" ? "කාර්යාලීය භාවිතයට පමණි" : "Official Directory"}
                </div>
              </div>

              {/* Officers Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(officers.length > 0
                  ? officers
                  : [
                      {
                        name: {
                          en: "Dr. H. M. Bandara",
                          si: "ආචාර්ය එච්. එම්. බණ්ඩාර",
                          ta: "கலாநிதி எச். எம். பண்டார"
                        },
                        designation: {
                          en: "Director General / CEO",
                          si: "අධ්‍යක්ෂ ජනරාල් / ප්‍රධාන විධායක නිලධාරී",
                          ta: "பணிப்பாளர் நாயகம் / பிரதம நிறைவேற்று அதிகாரி"
                        },
                        division: {
                          en: "Executive Directorate",
                          si: "විධායක අධ්‍යක්ෂ මණ්ඩලය",
                          ta: "நிறைவேற்று பணிப்பாளர் சபை"
                        },
                        generalNumber: "+94 (0)11 2354 354 Ext. 101",
                        mobileNumber: "+94 (0)71 2345 678",
                        email: "director@presidentsoffice.lk"
                      },
                      {
                        name: {
                          en: "Mrs. K. D. Jayawardena",
                          si: "කේ. ඩී. ජයවර්ධන මිය",
                          ta: "திருமதி கே. டி. ஜயவர்தன"
                        },
                        designation: {
                          en: "Deputy Director (Commercialization)",
                          si: "නියෝජ්‍ය අධ්‍යක්ෂ (වාණිජකරණ)",
                          ta: "பிரதி பணிப்பாளர் (வணிகமயமாக்கல்)"
                        },
                        division: {
                          en: "Commercialization & Industry Linkage",
                          si: "වාණිජකරණ හා කර්මාන්ත සබඳතා අංශය",
                          ta: "வணிகமயமாக்கல் மற்றும் கைத்தொழில் இணைப்பு"
                        },
                        generalNumber: "+94 (0)11 2354 354 Ext. 104",
                        mobileNumber: "+94 (0)77 3456 789",
                        email: "dep.director@presidentsoffice.lk"
                      },
                      {
                        name: {
                          en: "Mr. T. S. Senanayake",
                          si: "ටී. එස්. සේනානායක මයා",
                          ta: "திரு டி. எஸ். சேனநாயக்க"
                        },
                        designation: {
                          en: "Senior Technical & Research Officer",
                          si: "ජ්‍යෙෂ්ඨ තාක්ෂණික හා පර්යේෂණ නිලධාරී",
                          ta: "சிரேஷ்ட தொழில்நுட்ப மற்றும் ஆராய்ச்சி அதிகாரி"
                        },
                        division: {
                          en: "Research & Development Division",
                          si: "පර්යේෂණ හා සංවර්ධන අංශය",
                          ta: "ஆராய்ச்சி மற்றும் அபிவிருத்தி பிரிவு"
                        },
                        generalNumber: "+94 (0)11 2354 354 Ext. 110",
                        mobileNumber: "",
                        email: "tech.officer@presidentsoffice.lk"
                      },
                      {
                        name: {
                          en: "Ms. R. M. Perera",
                          si: "ආර්. එම්. පෙරේරා මෙනවිය",
                          ta: "செல்வி ஆர். எம். பெரேரா"
                        },
                        designation: {
                          en: "Public Inquiries & Administrative Officer",
                          si: "මහජන විමසීම් හා පරිපාලන නිලධාරී",
                          ta: "பொது விசாரணைகள் மற்றும் நிர்வாக அதிகாரி"
                        },
                        division: {
                          en: "Administration & Inquiries",
                          si: "පරිපාලන හා මහජන සබඳතා අංශය",
                          ta: "நிர்வாகம் மற்றும் விசாரணைகள்"
                        },
                        generalNumber: "+94 (0)11 2354 354 Ext. 102",
                        mobileNumber: "+94 (0)70 1234 567",
                        email: "inquiries@presidentsoffice.lk"
                      }
                    ]
                ).map((officer, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-white/15 backdrop-blur-xl space-y-4 hover:border-pink-500/40 transition-all duration-200"
                    style={{
                      background:
                        "linear-gradient(155deg, rgba(255, 255, 255, 0.08) 0%, rgba(120, 35, 90, 0.12) 50%, rgba(14, 7, 24, 0.85) 100%)",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.35)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">
                          {getLocalized(officer.name, "Officer")}
                        </h4>
                        <p className="text-xs font-semibold text-pink-300 mt-0.5">
                          {getLocalized(officer.designation, "Designation")}
                        </p>
                      </div>
                      {officer.division && (
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/10 text-white/80 shrink-0">
                          {getLocalized(officer.division, "")}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10 text-xs sm:text-sm">
                      {/* General Number */}
                      <div className="flex items-center gap-2.5 text-white/80">
                        <Phone size={15} className="text-emerald-300 shrink-0" />
                        <span className="text-white/60 text-xs font-medium">
                          {currentLang === "si" ? "පොදු දුරකථන අංකය:" : "General No:"}
                        </span>
                        <span className="font-semibold text-white">
                          {officer.generalNumber || "+94 (0)11 2354 354"}
                        </span>
                      </div>

                      {/* Official Mobile Number */}
                      <div className="flex items-center gap-2.5 text-white/80">
                        <Smartphone size={15} className="text-pink-300 shrink-0" />
                        <span className="text-white/60 text-xs font-medium">
                          {currentLang === "si" ? "ජංගම දුරකථනය:" : "Mobile No:"}
                        </span>
                        {officer.mobileNumber ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{officer.mobileNumber}</span>
                            <span className="text-[10px] text-pink-300 bg-pink-500/15 px-1.5 py-0.5 rounded">
                              {currentLang === "si" ? "කාර්යාලීය භාවිතයට" : "Official"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-white/40 italic">
                            {currentLang === "si" ? "ලබා දී නොමැත" : "Not Issued"}
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      {officer.email && (
                        <div className="flex items-center gap-2.5 text-white/80">
                          <Mail size={15} className="text-purple-300 shrink-0" />
                          <span className="text-white/60 text-xs font-medium">
                            {currentLang === "si" ? "ඊමේල්:" : "Email:"}
                          </span>
                          <a
                            href={`mailto:${officer.email}`}
                            className="font-medium text-pink-300 hover:text-white transition-colors"
                          >
                            {officer.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContactUsPage;

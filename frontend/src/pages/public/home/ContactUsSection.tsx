import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Printer, Clock, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import ContactApi, { ContactInfoData } from "../../../api/ContactApi";

const ContactUsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || "en") as "en" | "si" | "ta";
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    ContactApi.getContactInfo()
      .then((res: any) => {
        const data = res?.data || res;
        if (data && (data.telephone || data.email || data.location || data.organizationName)) {
          setContactInfo(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching contact info in ContactUsSection:", err);
      });
  }, []);

  const getLocalized = (
    obj?: { en?: string; si?: string; ta?: string } | string,
    fallback = ""
  ) => {
    if (!obj) return fallback;
    if (typeof obj === "string") return obj.trim() || fallback;
    const current = obj[currentLang]?.trim();
    if (current) return current;
    const en = obj.en?.trim();
    if (en) return en;
    const si = obj.si?.trim();
    if (si) return si;
    const ta = obj.ta?.trim();
    if (ta) return ta;
    return fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError(
        currentLang === "si"
          ? "කරුණාකර සියලුම අනිවාර්ය ක්ෂේත්‍ර (නම, විද්‍යුත් තැපෑල, පණිවුඩය) සම්පූර්ණ කරන්න."
          : currentLang === "ta"
          ? "தயவுசெய்து தேவையான அனைத்து புலங்களையும் பூர்த்தி செய்யவும்."
          : "Please complete all required fields (Name, Email, Message)."
      );
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    try {
      await ContactApi.submitInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || (currentLang === "si" ? "සාමාන්‍ය විමසීම" : "General Inquiry"),
        message: formData.message.trim(),
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

  return (
    <section id="contact-us-section" className="w-full pt-2 sm:pt-4" aria-label="Contact Us">
      {/* Main Grid: Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Contact Info Cards - Sculpted Aerodynamic Shape */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative rounded-tl-[3rem] sm:rounded-tl-[4.5rem] rounded-br-[3rem] sm:rounded-br-[4.5rem] rounded-tr-2xl rounded-bl-2xl p-6 sm:p-9 lg:p-10 border border-slate-200/90 shadow-sm space-y-6 overflow-hidden bg-white"
            style={{
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)",
            }}
          >
            <h3 className="relative text-xl sm:text-2xl font-extrabold text-slate-900 pb-2 tracking-tight">
              {getLocalized(
                contactInfo?.organizationName,
                getLocalized(contactInfo?.location?.title, t("homeContact.office", "President's Office"))
              )}
            </h3>

            {/* Address */}
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                <MapPin size={22} className="text-slate-800" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {getLocalized(contactInfo?.location?.title, t("contactPage.officeTitle", "Office Location"))}
                </h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                  {getLocalized(
                    contactInfo?.location?.address,
                    t(
                      "homeContact.addressLine",
                      "President's Office, Galle Face, Colombo 01, Sri Lanka."
                    )
                  )}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                <Mail size={22} className="text-slate-800" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {getLocalized(contactInfo?.email?.title, t("contactPage.emailTitle", "Email Inquiries"))}
                </h4>
                <a
                  href={`mailto:${contactInfo?.email?.address || "nirdc@presidentsoffice.lk"}`}
                  className="text-sm text-slate-800 hover:text-black hover:underline mt-1 block font-semibold transition-colors"
                >
                  {contactInfo?.email?.address || "nirdc@presidentsoffice.lk"}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                <Phone size={22} className="text-slate-800" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {getLocalized(contactInfo?.telephone?.title, t("contactPage.phoneTitle", "Telephone"))}
                </h4>
                <a
                  href={`tel:${(contactInfo?.telephone?.number || "+94112354354").replace(/\s+/g, "")}`}
                  className="text-sm text-slate-800 hover:text-black hover:underline mt-1 block font-semibold transition-colors"
                >
                  {contactInfo?.telephone?.number || "+94 (0)11 2354 354"}
                </a>
              </div>
            </div>

            {/* Fax (if present) */}
            {contactInfo?.fax?.number && (
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                  <Printer size={22} className="text-slate-800" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {getLocalized(contactInfo?.fax?.title, "Fax Number")}
                  </h4>
                  <span className="text-sm text-slate-700 mt-1 block font-semibold">
                    {contactInfo.fax.number}
                  </span>
                </div>
              </div>
            )}

            {/* Working hours */}
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                <Clock size={22} className="text-slate-800" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {getLocalized(contactInfo?.workingHours?.title, t("contactPage.hoursTitle", "Working Hours"))}
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  {getLocalized(
                    contactInfo?.workingHours?.schedule,
                    t("contactPage.hours", "Monday - Friday: 8:30 AM - 4:30 PM")
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Interactive Message Form - Interlocking Complementary Shape */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative rounded-tr-[3rem] sm:rounded-tr-[4.5rem] rounded-bl-[3rem] sm:rounded-bl-[4.5rem] rounded-tl-2xl rounded-br-2xl p-6 sm:p-9 lg:p-12 border border-slate-200/90 shadow-sm overflow-hidden bg-white"
            style={{
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)",
            }}
          >
            <h3 className="relative text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {t("contactPage.formTitle", "Send Us a Message")}
            </h3>
            <p className="relative text-sm text-slate-600 mb-7">
              {t(
                "contactPage.formDesc",
                "Fill out the form below and our team will get back to you promptly."
              )}
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
                <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
                <p className="text-emerald-900 font-semibold text-lg">
                  {t(
                    "contactPage.success",
                    "Your message has been received. We will get back to you soon!"
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-black border border-black bg-white hover:bg-black hover:text-white transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      {t("contactPage.name", "Your Full Name")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      {t("contactPage.email", "Email Address")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {t("contactPage.subject", "Subject")}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-sm"
                    placeholder="Commercialization Inquiry"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    {t("contactPage.message", "Message")} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-sm resize-none"
                    placeholder="Write your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-black border border-black bg-white hover:bg-black hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-black"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-current" />
                      <span>{t("contactPage.sending", "Sending...")}</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} className="text-current" />
                      <span>{t("contactPage.send", "Send Message")}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;

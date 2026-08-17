import { useState, useEffect } from "react";
import adApi from "../../api/AdApi";
import { X } from "lucide-react";

const AD_POPUP_SESSION_KEY = "nirdc_ad_popup_dismissed";

const AdPopupModal = () => {
  const [ad, setAd] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem(AD_POPUP_SESSION_KEY);
    if (dismissed) return;

    const fetchPopupAd = async () => {
      try {
        const response = (await adApi.getPopupAd()) as any;
        if (response.status && response.data) {
          setAd(response.data);
          // Small delay for smooth entrance
          setTimeout(() => setIsVisible(true), 500);
        }
      } catch {
        // Silently fail
      }
    };
    fetchPopupAd();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(AD_POPUP_SESSION_KEY, "true");
    setTimeout(() => setAd(null), 300);
  };

  const handleDontShowAgain = () => {
    handleClose();
    // Also store in localStorage to persist across sessions for the day
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("nirdc_ad_popup_date", today);
  };

  // Check localStorage for "don't show again today"
  useEffect(() => {
    const savedDate = localStorage.getItem("nirdc_ad_popup_date");
    const today = new Date().toISOString().split("T")[0];
    if (savedDate === today) {
      setAd(null);
    }
  }, []);

  if (!ad) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
        >
          <X size={16} className="text-gray-600" />
        </button>

        {/* Header Gradient */}
        <div
          className="px-6 py-4 text-white"
          style={{ background: "linear-gradient(135deg, #003893 0%, #2E86C1 100%)" }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 mb-2">
            {ad.category}
          </span>
          <h2 className="text-xl font-bold">{ad.title}</h2>
        </div>

        {/* Image */}
        {ad.imageUrl && (
          <div className="max-h-48 overflow-hidden">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-600 text-sm leading-relaxed">
            {ad.description}
          </p>

          {/* Date Info */}
          <p className="text-xs text-gray-400 mt-3">
            Valid until: {new Date(ad.endDate).toLocaleDateString()}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-gray-600">
            <input
              type="checkbox"
              onChange={handleDontShowAgain}
              className="rounded border-gray-300"
            />
            Don't show again today
          </label>

          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #003893, #2E86C1)" }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdPopupModal;

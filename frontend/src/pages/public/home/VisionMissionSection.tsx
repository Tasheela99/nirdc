import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Eye, Target } from "lucide-react";
import QuickLinksSection from "./QuickLinksSection";
import ContactUsSection from "./ContactUsSection";
import homePageContentApi, { VisionMissionData } from "@/api/HomePageContentApi";

type Pt = [number, number];

// Closed path with rounded corners, in real pixels (used with CSS clip-path: path())
const roundedPath = (pts: Pt[], r: number): string => {
  const n = pts.length;
  const f = (v: number) => v.toFixed(1);
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const l1 = Math.hypot(prev[0] - cur[0], prev[1] - cur[1]);
    const l2 = Math.hypot(next[0] - cur[0], next[1] - cur[1]);
    const rad = Math.min(r, l1 / 2, l2 / 2);
    const p1: Pt = [cur[0] + ((prev[0] - cur[0]) / l1) * rad, cur[1] + ((prev[1] - cur[1]) / l1) * rad];
    const p2: Pt = [cur[0] + ((next[0] - cur[0]) / l2) * rad, cur[1] + ((next[1] - cur[1]) / l2) * rad];
    d += `${i === 0 ? "M" : "L"} ${f(p1[0])} ${f(p1[1])} Q ${f(cur[0])} ${f(cur[1])} ${f(p2[0])} ${f(p2[1])} `;
  }
  return d + "Z";
};

// Font sizes scale with the width of the desktop box (container query units)
const titleSize = "clamp(26px, 3.3cqw, 42px)";
const bodySize = "clamp(13px, 1.4cqw, 17px)";

const SLOPE = 0.84; // sleek parallel diagonal. Both shapes share it, so the gap stays parallel.
const ICON = 64;

interface VisionMissionSectionProps {
  showQuickLinks?: boolean;
  showContactUs?: boolean;
  noBackground?: boolean;
}

const VisionMissionSection: React.FC<VisionMissionSectionProps> = ({
  showQuickLinks = true,
  showContactUs = true,
  noBackground = false,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const langKey: "en" | "si" | "ta" = currentLang.startsWith("si")
    ? "si"
    : currentLang.startsWith("ta")
    ? "ta"
    : "en";

  const [dbData, setDbData] = useState<VisionMissionData | null>(null);

  useEffect(() => {
    let isMounted = true;
    homePageContentApi
      .getVisionMission()
      .then((res) => {
        if (res?.data && isMounted) {
          setDbData(res.data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const visionTitle =
    dbData?.vision?.title?.[langKey] ||
    dbData?.vision?.title?.en ||
    t("strategic.vision.title", "අපගේ දැක්ම");
  const visionSummary =
    dbData?.vision?.highlightText?.[langKey] ||
    dbData?.vision?.highlightText?.en ||
    t("strategic.vision.summary", "ක්ෂණික බලපෑමක් ඇති කිරීම");
  const visionContent =
    dbData?.vision?.description?.[langKey] ||
    dbData?.vision?.description?.en ||
    t(
      "strategic.vision.content",
      "ආර්ථික වර්ධනය ඉහළ නැංවීම, සමාජ සුබසාධනය වැඩි දියුණු කිරීම සහ පාරිසරික තිරසරබව ප්‍රවර්ධනය කිරීම සඳහා ජාතික පර්යේෂණයෙහි වේගවත් වාණිජකරණය හරහා ක්ෂණික බලපෑමක් ඇතිකිරීම."
    );

  const missionTitle =
    dbData?.mission?.title?.[langKey] ||
    dbData?.mission?.title?.en ||
    t("strategic.mission.title", "අපගේ මෙහෙවර");
  const missionSummary =
    dbData?.mission?.highlightText?.[langKey] ||
    dbData?.mission?.highlightText?.en ||
    t(
      "strategic.mission.summary",
      "ආයෝජකයින් සමඟ වෙළඳපොළ සඳහා සූදානම් විසඳුම් සම්බන්ධ කරන ක්‍රියාශීලී වේදිකාවක් නිර්මාණය කිරීම."
    );
  const missionContent =
    dbData?.mission?.description?.[langKey] ||
    dbData?.mission?.description?.en ||
    t(
      "strategic.mission.content",
      "අතිරේක අරමුදල් සපයා ගැනීම සහ ආයෝජකයින් සමඟ වෙළඳපොළ සඳහා සූදානම් විසඳුම් සමඟ සම්බන්ධ වන ක්‍රියාශීලී වේදිකාවක් නිර්මාණය කිරීම පිණිස ඉලක්කගත යාන්ත්‍රණ සංවර්ධනය කිරිමේ අරමුණින් ඉහළ වාණිජකරණ විභවතාවයක් සහිත නිම කරන ලද හෝ ආසන්න වශයෙන් නිම කරන ලද පර්යේෂණ ව්‍යාපෘති හඳුනා ගැනීම."
    );

  // Measure the desktop box width and the two text blocks, so the shapes can fit the content
  const boxRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1100);
  const [vh, setVh] = useState(220);
  const [mh, setMh] = useState(260);

  useLayoutEffect(() => {
    const measure = () => {
      if (boxRef.current && boxRef.current.offsetWidth > 0) setW(boxRef.current.offsetWidth);
      if (visionRef.current && visionRef.current.offsetHeight > 0) setVh(visionRef.current.offsetHeight);
      if (missionRef.current && missionRef.current.offsetHeight > 0) setMh(missionRef.current.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    [boxRef.current, visionRef.current, missionRef.current].forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [visionContent, missionContent, visionTitle, missionTitle, visionSummary, missionSummary]);

  // ---- Layout in pixels, driven by the content ----
  const tipTopY = 22; // top tip of the mission shape
  const vTopRight = 0.69 * w; // top-right of vision shape (restores wide, grand top edge)
  const xPeak = 0.75 * w; // peak of mission shape (smooth parallel gap)

  const vLeft = 0.05 * w;
  const vWidth = 0.38 * w;
  const vTop = 0.07 * w;
  const eyeLeft = 0.08 * w;
  const eyeTop = vTop + vh + 0.035 * w;

  const mTop = 0.23 * w; // top of the mission text
  const mEdgeAtText = xPeak - SLOPE * (mTop - tipTopY); // mission shape's left edge at the text's top
  const mLeft = mEdgeAtText + 0.015 * w;
  const mWidth = Math.max(0.35 * w, 0.98 * w - mLeft);

  const needVision = eyeTop + ICON + 0.07 * w;
  const needMission = mTop + mh + 0.05 * w;
  const H = Math.round(Math.max(needVision, needMission, 0.50 * w));

  const r = Math.min(50, Math.max(28, 0.04 * w));

  const vTipY = H * 0.955;
  const visionPath = roundedPath(
    [
      [0, 0],
      [vTopRight, 0],
      [vTopRight - SLOPE * vTipY, vTipY],
      [0, H * 0.69],
    ],
    r
  );
  const missionPath = roundedPath(
    [
      [xPeak, tipTopY],
      [w, tipTopY + 0.14 * w],
      [w, H],
      [xPeak - SLOPE * (H - tipTopY), H],
    ],
    r
  );

  return (
    <section
      id="vision-mission-section"
      className="relative z-20 w-full pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 overflow-visible flex items-center justify-center"
      style={{
        background: noBackground
          ? "transparent"
          : `
          radial-gradient(circle at 25% 65%, rgba(138, 133, 219, 0.22) 0%, transparent 45%),
          radial-gradient(circle at 75% 45%, rgba(111, 78, 185, 0.20) 0%, transparent 50%),
          linear-gradient(180deg, #120726 0%, #180d32 25%, #0f0722 55%, #090416 85%, #07091d 100%)
        `,
      }}
      aria-label="Vision and Mission"
    >
      {/* Background silk wave glow */}
      {!noBackground && (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-90">
          <svg
            className="absolute w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1440 600"
          >
            <defs>
              <linearGradient id="purpleWaveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5846a3" stopOpacity="0.85" />
                <stop offset="25%" stopColor="#8a85db" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#6f4eb9" stopOpacity="0.9" />
                <stop offset="85%" stopColor="#6c52af" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#3e1c6e" stopOpacity="0.65" />
              </linearGradient>
              <filter id="waveBlurHeavy" filterUnits="userSpaceOnUse" x="-1000" y="-1000" width="3440" height="2600">
                <feGaussianBlur stdDeviation="55" />
              </filter>
              <filter id="waveBlurCore" filterUnits="userSpaceOnUse" x="-1000" y="-1000" width="3440" height="2600">
                <feGaussianBlur stdDeviation="28" />
              </filter>
            </defs>

            <path
              d="M-300,460 C280,530 380,270 780,340 C1080,390 1280,210 1800,270 L1800,800 L-300,800 Z"
              fill="url(#purpleWaveGrad)"
              filter="url(#waveBlurHeavy)"
              opacity="0.8"
            />
            <path
              d="M-300,430 C260,490 360,260 760,330 C1060,380 1260,200 1800,260"
              fill="none"
              stroke="url(#purpleWaveGrad)"
              strokeWidth="120"
              filter="url(#waveBlurCore)"
              opacity="0.95"
            />
          </svg>
        </div>
      )}

      {/* Soft fade into the next section (removes the hard seam between the two sections) */}
      {!noBackground && (
        <div
          className="absolute inset-x-0 bottom-0 h-24 sm:h-28 lg:h-32 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(18, 7, 38, 0) 0%, #111827 100%)" }}
        />
      )}

      {/* Main Container */}
      <div className="max-w-screen-xl w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* DESKTOP (>= lg): the height and the triangles adapt to the text of the current language */}
          <div
            ref={boxRef}
            className="hidden lg:block relative w-full"
            style={{ height: `${H}px`, containerType: "inline-size" }}
          >
            {/* SHAPE 1 (VISION) */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                clipPath: `path('${visionPath}')`,
                WebkitClipPath: `path('${visionPath}')`,
                background: noBackground
                  ? "linear-gradient(145deg, #8C2963 0%, #5F1441 100%)"
                  : "linear-gradient(145deg, rgba(140, 41, 99, 0.45) 0%, rgba(100, 20, 65, 0.25) 100%)",
                filter: noBackground ? "drop-shadow(0 15px 35px rgba(140, 41, 99, 0.25))" : undefined,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            />

            {/* SHAPE 2 (MISSION) */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                clipPath: `path('${missionPath}')`,
                WebkitClipPath: `path('${missionPath}')`,
                background: noBackground
                  ? "linear-gradient(145deg, #2A1024 0%, #170513 100%)"
                  : "linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, rgba(140, 41, 99, 0.12) 100%)",
                filter: noBackground ? "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.25))" : undefined,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            />

            {/* CONTENT: VISION */}
            <div
              ref={visionRef}
              className="absolute z-10"
              style={{ left: vLeft, top: vTop, width: vWidth }}
            >
              <h3
                className="font-extrabold text-white mb-[1.2cqw] tracking-tight font-sans drop-shadow-sm leading-tight"
                style={{ fontSize: titleSize }}
              >
                {visionTitle}
              </h3>

              <div className="mb-[1.4cqw] inline-block bg-white/10 border-l-2 border-pink-300 rounded-r-lg px-3.5 py-2 backdrop-blur-sm">
                <p className="leading-snug font-semibold text-pink-100" style={{ fontSize: bodySize }}>
                  "{visionSummary}"
                </p>
              </div>

              <p className="text-white/95 leading-relaxed font-body" style={{ fontSize: bodySize }}>
                {visionContent}
              </p>
            </div>

            {/* Eye icon (sits right under the vision text, inside the tip) */}
            <div className="absolute z-10" style={{ left: eyeLeft, top: eyeTop }}>
              <div
                className="rounded-2xl inline-flex items-center justify-center text-white"
                style={{
                  width: ICON,
                  height: ICON,
                  background: "rgba(255, 255, 255, 0.16)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <Eye size={32} strokeWidth={1.8} className="drop-shadow" />
              </div>
            </div>

            {/* Target icon (top of the mission shape) */}
            <div className="absolute z-10" style={{ left: 0.77 * w - ICON / 2, top: 0.075 * w }}>
              <div
                className="rounded-2xl inline-flex items-center justify-center text-white"
                style={{
                  width: ICON,
                  height: ICON,
                  background: "rgba(255, 255, 255, 0.18)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <Target size={32} strokeWidth={1.8} className="drop-shadow" />
              </div>
            </div>

            {/* CONTENT: MISSION */}
            <div
              ref={missionRef}
              className="absolute z-10"
              style={{ left: mLeft, top: mTop, width: mWidth }}
            >
              <h3
                className="font-extrabold text-white mb-[1.2cqw] tracking-tight font-sans drop-shadow-sm leading-tight"
                style={{ fontSize: titleSize }}
              >
                {missionTitle}
              </h3>

              <div className="mb-[1.4cqw] inline-block bg-white/10 border-l-2 border-purple-200 rounded-r-lg px-3.5 py-2 backdrop-blur-sm">
                <p className="leading-snug font-semibold text-purple-100" style={{ fontSize: bodySize }}>
                  "{missionSummary}"
                </p>
              </div>

              <p className="text-white/95 leading-relaxed font-body" style={{ fontSize: bodySize }}>
                {missionContent}
              </p>
            </div>
          </div>

          {/* MOBILE & TABLET (< lg) */}
          <div className="block lg:hidden space-y-5 sm:space-y-6 max-w-2xl mx-auto">
            {/* Vision Mobile Card */}
            <div
              className="relative rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-9 overflow-hidden"
              style={{
                background: noBackground
                  ? "linear-gradient(145deg, #8C2963 0%, #5F1441 100%)"
                  : "linear-gradient(145deg, rgba(140, 41, 99, 0.45) 0%, rgba(100, 20, 65, 0.25) 100%)",
                border: noBackground
                  ? "1px solid rgba(255, 255, 255, 0.15)"
                  : "1px solid rgba(200, 80, 140, 0.40)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: noBackground
                  ? "0 15px 35px rgba(140, 41, 99, 0.25)"
                  : "0 8px 32px rgba(140, 41, 99, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              }}
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white mb-5"
                style={{ background: "rgba(255, 255, 255, 0.16)", border: "1px solid rgba(255, 255, 255, 0.2)" }}
              >
                <Eye size={28} strokeWidth={1.8} />
              </div>

              <h3 className="text-3xl sm:text-4xl leading-tight font-extrabold text-white mb-4 tracking-tight">
                {visionTitle}
              </h3>
              <p className="text-sm sm:text-base leading-snug font-semibold text-pink-200 mb-4 bg-white/10 px-3.5 py-2.5 rounded-lg border-l-2 border-pink-300">
                "{visionSummary}"
              </p>
              <p className="text-base sm:text-lg text-white/95 leading-relaxed">{visionContent}</p>
            </div>

            {/* Mission Mobile Card */}
            <div
              className="relative rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-9 overflow-hidden"
              style={{
                background: noBackground
                  ? "linear-gradient(145deg, #2A1024 0%, #170513 100%)"
                  : "linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, rgba(140, 41, 99, 0.12) 100%)",
                border: noBackground
                  ? "1px solid rgba(255, 255, 255, 0.15)"
                  : "1px solid rgba(255, 255, 255, 0.30)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: noBackground
                  ? "0 15px 35px rgba(0, 0, 0, 0.25)"
                  : "0 8px 32px rgba(140, 41, 99, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
              }}
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white mb-5"
                style={{ background: "rgba(255, 255, 255, 0.18)", border: "1px solid rgba(255, 255, 255, 0.2)" }}
              >
                <Target size={28} strokeWidth={1.8} />
              </div>

              <h3 className="text-3xl sm:text-4xl leading-tight font-extrabold text-white mb-4 tracking-tight">
                {missionTitle}
              </h3>
              <p className="text-sm sm:text-base leading-snug font-semibold text-purple-200 mb-4 bg-white/10 px-3.5 py-2.5 rounded-lg border-l-2 border-purple-200">
                "{missionSummary}"
              </p>
              <p className="text-base sm:text-lg text-white/95 leading-relaxed">{missionContent}</p>
            </div>
          </div>
        </motion.div>
        {showQuickLinks && <QuickLinksSection />}
        {showContactUs && <ContactUsSection />}
      </div>
    </section>
  );
};

export default VisionMissionSection;
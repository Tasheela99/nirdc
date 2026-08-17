import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cpu, Sprout, Globe2, Heart, Users, MoreHorizontal,
  ArrowRight,
} from "lucide-react";

const avenues = [
  {
    title: "TECHNOLOGY",
    displayTitle: "Technology",
    items: [
      "Engineering", "AI", "Information Technology",
      "Communication", "Maritime", "Power & Energy",
      "Transport & Other Technologies",
    ],
    Icon: Cpu,
    gradient: "from-[#003893] to-[#2E86C1]",
    lightGlow: "rgba(0,56,147,0.15)",
    accentColor: "#003893",
    tagColor: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    title: "FOOD & SUSTENANCE",
    displayTitle: "Food & Sustenance",
    items: ["Agriculture", "Fisheries", "Livestock", "Food Security & Safety"],
    Icon: Sprout,
    gradient: "from-emerald-600 to-teal-500",
    lightGlow: "rgba(16,185,129,0.15)",
    accentColor: "#10b981",
    tagColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    title: "ENVIRONMENT",
    displayTitle: "Environment",
    items: ["Land", "Water", "Air", "Mineral Resources", "Forest Resources"],
    Icon: Globe2,
    gradient: "from-cyan-600 to-sky-500",
    lightGlow: "rgba(6,182,212,0.15)",
    accentColor: "#0891b2",
    tagColor: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  },
  {
    title: "WELL-BEING & INTELLECTUAL",
    displayTitle: "Well-being & Intellectual",
    items: ["Health", "Education", "Science"],
    Icon: Heart,
    gradient: "from-rose-500 to-pink-500",
    lightGlow: "rgba(244,63,94,0.15)",
    accentColor: "#f43f5e",
    tagColor: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  },
  {
    title: "SOCIAL DEVELOPMENT",
    displayTitle: "Social Development",
    items: ["Arts & Culture", "History", "Heritage"],
    Icon: Users,
    gradient: "from-violet-600 to-purple-500",
    lightGlow: "rgba(124,58,237,0.15)",
    accentColor: "#7c3aed",
    tagColor: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    title: "OTHER",
    displayTitle: "Other",
    items: ["Interdisciplinary Research", "Cross-Sector Innovation"],
    Icon: MoreHorizontal,
    gradient: "from-slate-600 to-gray-500",
    lightGlow: "rgba(100,116,139,0.12)",
    accentColor: "#64748b",
    tagColor: "bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
  },
];

const RelevantAvenuesScreen: FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const savedOption = localStorage.getItem("selectedOption");
    if (savedOption) setSelectedOption(savedOption);
  }, []);

  const handleCardClick = (title: string) => {
    let route = "";
    if (selectedOption === "I have an R&D Proposal") {
      route = `/research-proposal-application/${title}`;
    } else if (selectedOption === "I Want to Invest") {
      route = `/investor-application/${title}`;
    } else if (selectedOption === "Proposal & Funding Ready") {
      route = `/research-investment-application/${title}`;
    } else {
      // Fallback for old localStorage values
      const opt = (selectedOption || "").toUpperCase();
      if (opt.includes("PROPOSAL") && !opt.includes("FINANCIAL")) {
        route = `/research-proposal-application/${title}`;
      } else if (opt.includes("INVEST")) {
        route = `/investor-application/${title}`;
      } else if (opt.includes("FINANCIAL")) {
        route = `/research-investment-application/${title}`;
      } else {
        route = "/";
      }
    }
    navigate(route, { state: { avenue: title } });
  };

  return (
    <section
      className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #f8fafc 0%, #eef2f7 50%, #e0e7ef 100%)',
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #003893, transparent)' }} />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
      </div>

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <h2
          className="text-3xl md:text-4xl font-extrabold"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #003893 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Select the Relevant Avenue
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full relative z-10">
        {avenues.map((avenue, index) => {
          const isHovered = hoveredIdx === index;
          return (
            <div
              key={index}
              onClick={() => handleCardClick(avenue.title)}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative rounded-2xl cursor-pointer transition-all duration-500 group h-full flex flex-col"
              style={{
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: isHovered
                  ? `0 20px 40px -12px ${avenue.lightGlow}, 0 0 0 1px ${avenue.accentColor}30`
                  : '0 4px 20px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)',
              }}
            >
              <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden relative flex-1 flex flex-col">
                {/* Top gradient */}
                <div
                  className={`h-1 bg-gradient-to-r ${avenue.gradient} transition-all duration-500`}
                  style={{ height: isHovered ? '4px' : '3px' }}
                />

                {/* Glow overlay */}
                <div
                  className="absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none"
                  style={{
                    opacity: isHovered ? 0.04 : 0,
                    background: `radial-gradient(circle at 50% 0%, ${avenue.accentColor}, transparent 70%)`,
                  }}
                />

                <div className="p-7 relative flex-1 flex flex-col">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br ${avenue.gradient} transition-all duration-500`}
                    style={{
                      transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0)',
                      boxShadow: isHovered ? `0 8px 20px ${avenue.lightGlow}` : 'none',
                    }}
                  >
                    <avenue.Icon size={24} className="text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-4 tracking-tight" style={{ color: '#1a1a2e' }}>
                    {avenue.displayTitle}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {avenue.items.filter(i => i).map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-block text-xs font-medium px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: `${avenue.accentColor}12`, color: avenue.accentColor }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div
                    className="inline-flex items-center gap-2 text-sm font-bold transition-all duration-300 mt-auto"
                    style={{ color: avenue.accentColor }}
                  >
                    Explore
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isHovered ? avenue.accentColor : `${avenue.accentColor}15`,
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                      }}
                    >
                      <ArrowRight size={13} style={{ color: isHovered ? 'white' : avenue.accentColor }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RelevantAvenuesScreen;

import { FC, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, TrendingUp, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import UserContext from "../../../store/UserContext.tsx";

const categoryCards = [
  {
    id: 1,
    title: "Research Proposal",
    subtitle: "I have an R&D Proposal",
    description: "Need gap-filling funding for your research project? Submit your proposal to connect with potential investors.",
    Icon: FileText,
    gradient: "from-[#003893] to-[#2E86C1]",
    lightGlow: "rgba(0,56,147,0.15)",
    accentColor: "#003893",
    route: "/relevant",
  },
  {
    id: 2,
    title: "Invest in R&D",
    subtitle: "I Want to Invest",
    description: "Looking for a promising R&D project to invest in? Browse verified research proposals from top institutions.",
    Icon: TrendingUp,
    gradient: "from-emerald-600 to-teal-500",
    lightGlow: "rgba(16,185,129,0.15)",
    accentColor: "#10b981",
    route: "/relevant",
  },
  {
    id: 3,
    title: "Full Package",
    subtitle: "Proposal & Funding Ready",
    description: "Have both the proposal and financial backing? Get government support to bring your project to market.",
    Icon: Briefcase,
    gradient: "from-violet-600 to-purple-500",
    lightGlow: "rgba(124,58,237,0.15)",
    accentColor: "#7c3aed",
    route: "/relevant",
  },
];

const WhoAreYou: FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleCardClick = (route: string, text: string) => {
    localStorage.setItem("selectedOption", text);
    if (isLoggedIn) {
      navigate(route);
    } else {
      navigate("/login", { state: { redirectTo: route } });
    }
  };

  return (
    <div 
      className="min-h-[80vh] h-full flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden flex-grow"
      style={{
        background: 'linear-gradient(160deg, #f8fafc 0%, #eef2f7 50%, #e0e7ef 100%)',
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #003893, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      </div>

      {/* Header */}
      <div className="text-center mb-14 max-w-2xl relative z-10">
        <div className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full mb-5 border"
          style={{
            background: 'linear-gradient(135deg, rgba(0,56,147,0.08), rgba(46,134,193,0.08))',
            borderColor: 'rgba(0,56,147,0.15)',
            color: '#003893',
          }}
        >
          <Sparkles size={15} />
          Submit a Proposal
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #003893 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          How Can We Help?
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          Choose the option that best describes your journey
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl w-full relative z-10">
        {categoryCards.map((card) => {
          const isHovered = hoveredId === card.id;
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.route, card.subtitle)}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative rounded-2xl cursor-pointer transition-all duration-500 group h-full flex flex-col"
              style={{
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: isHovered
                  ? `0 25px 50px -12px ${card.lightGlow}, 0 0 0 1px ${card.accentColor}30`
                  : '0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
              }}
            >
              {/* Card body */}
              <div className="bg-white rounded-2xl overflow-hidden relative flex-1 flex flex-col">
                {/* Top gradient bar */}
                <div
                  className={`h-1 bg-gradient-to-r ${card.gradient} transition-all duration-500`}
                  style={{ height: isHovered ? '4px' : '3px' }}
                />

                {/* Hover glow overlay */}
                <div
                  className="absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none"
                  style={{
                    opacity: isHovered ? 0.04 : 0,
                    background: `radial-gradient(circle at 50% 0%, ${card.accentColor}, transparent 70%)`,
                  }}
                />

                <div className="p-8 relative flex-1 flex flex-col">
                  {/* Icon container */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 bg-gradient-to-br ${card.gradient}`}
                    style={{
                      transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0)',
                      boxShadow: isHovered ? `0 8px 24px ${card.lightGlow}` : 'none',
                    }}
                  >
                    <card.Icon size={28} className="text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                    {card.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-sm font-semibold mb-3 transition-colors duration-300"
                    style={{ color: card.accentColor }}
                  >
                    {card.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    {card.description}
                  </p>

                  {/* CTA */}
                  <div
                    className="inline-flex items-center gap-2 text-sm font-bold transition-all duration-300 mt-auto"
                    style={{ color: card.accentColor }}
                  >
                    Get Started
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isHovered ? card.accentColor : `${card.accentColor}15`,
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                      }}
                    >
                      <ArrowRight size={14} style={{ color: isHovered ? 'white' : card.accentColor }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhoAreYou;

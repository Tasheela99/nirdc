import { FC, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, FolderOpen, ArrowRight, Sparkles } from "lucide-react";
import UserContext from "../../../store/UserContext.tsx";
import { useTranslation } from "react-i18next";

const Proposal: FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cards = [
    {
      id: 1,
      title: t('proposal.submitNewProposal'),
      subtitle: "Start a New Journey",
      description: "Ready to submit your R&D proposal? Click here to begin a new application and explore opportunities.",
      Icon: FilePlus,
      gradient: "from-[#003893] to-[#2E86C1]",
      lightGlow: "rgba(0,56,147,0.15)",
      accentColor: "#003893",
      action: () => navigate("/main-page"),
    },
    ...(isLoggedIn ? [{
      id: 2,
      title: t('proposal.viewMyProposals'),
      subtitle: "Track Your Submissions",
      description: "View the status of your previously submitted proposals, track their progress, and check for updates.",
      Icon: FolderOpen,
      gradient: "from-emerald-600 to-teal-500",
      lightGlow: "rgba(16,185,129,0.15)",
      accentColor: "#10b981",
      action: () => navigate("/view-my-proposals"),
    }] : []),
  ];

  return (
    <div 
      className="min-h-[80vh] flex flex-col h-full flex-grow relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #f8fafc 0%, #eef2f7 50%, #e0e7ef 100%)',
      }}
    >
      <section className="flex flex-col items-center justify-center px-4 py-20 relative z-10 flex-grow">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #003893, transparent)' }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
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
            Proposals Portal
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #003893 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Manage Your Proposals
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Choose whether to submit a new proposal or track your existing ones
          </p>
        </div>

        {/* Cards */}
        <div className={`grid grid-cols-1 ${isLoggedIn ? 'md:grid-cols-2' : 'max-w-md'} gap-8 max-w-4xl w-full relative z-10 px-4`}>
          {cards.map((card) => {
            const isHovered = hoveredId === card.id;
            return (
              <div
                key={card.id}
                onClick={card.action}
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
                      Continue
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
      </section>
    </div>
  );
};

export default Proposal;

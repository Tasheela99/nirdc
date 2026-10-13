import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import { Mail, Linkedin, Phone } from "lucide-react";
import aboutUsContentApi, { TeamMemberData, getMultiLangText } from "@/api/AboutUsContentApi";
import { useTranslation } from "react-i18next";

const defaultTeamMembers = [
  {
    name: "Dr. Kalinga Wickramasinghe",
    role: "Director General",
    division: "Executive Directorate",
    bio: "Ph.D. in Materials Science with over 20 years of experience directing technology transfer initiatives across Asia and Europe.",
    initials: "KW",
    color: "from-purple-600 to-pink-600",
    phone: "+94 11 267 8901",
    email: "dg@nirdc.gov.lk",
    linkedin: "https://linkedin.com",
    image: undefined as string | undefined,
  },
  {
    name: "Prof. Anoma Jayawardena",
    role: "Head of Research Evaluation",
    division: "Scientific Directorate",
    bio: "Senior Fellow at the National Academy of Sciences, expert in biomedical engineering and multi-institutional academic consortia.",
    initials: "AJ",
    color: "from-pink-600 to-rose-600",
    phone: "+94 11 267 8902",
    email: "anoma.j@nirdc.gov.lk",
    linkedin: "https://linkedin.com",
    image: undefined as string | undefined,
  },
  {
    name: "Mr. Rohan Senanayake",
    role: "Director of Capital & Venture Alliances",
    division: "Commercialisation Directorate",
    bio: "Former venture capital partner managing private equity funds across frontier Asian markets, specializing in deep-tech syndication.",
    initials: "RS",
    color: "from-blue-600 to-indigo-600",
    phone: "+94 11 267 8903",
    email: "rohan.s@nirdc.gov.lk",
    linkedin: "https://linkedin.com",
    image: undefined as string | undefined,
  },
  {
    name: "Attorney Devika Weerakoon",
    role: "Head of Legal & Intellectual Property",
    division: "IP & Governance Directorate",
    bio: "Specialist in WIPO patent drafting, cross-border technology licensing, and sovereign digital asset protections.",
    initials: "DW",
    color: "from-emerald-600 to-teal-600",
    phone: "+94 11 267 8904",
    email: "devika.w@nirdc.gov.lk",
    linkedin: "https://linkedin.com",
    image: undefined as string | undefined,
  },
  {
    name: "Eng. Chathura Samarasinghe",
    role: "Director of Technology Incubation",
    division: "Innovation Directorate",
    bio: "Serial entrepreneur and robotics engineer with 3 successful hardware startups and 12 granted international patents.",
    initials: "CS",
    color: "from-amber-600 to-orange-600",
    phone: "+94 11 267 8905",
    email: "chathura.s@nirdc.gov.lk",
    linkedin: "https://linkedin.com",
    image: undefined as string | undefined,
  },
  {
    name: "Ms. Shanika Perera",
    role: "Head of Strategic Communications & Outreach",
    division: "Public Engagement",
    bio: "Expert in brand positioning, international stakeholder relations, and youth innovation summit orchestrations.",
    initials: "SP",
    color: "from-fuchsia-600 to-pink-600",
    phone: "+94 11 267 8906",
    email: "shanika.p@nirdc.gov.lk",
    linkedin: "https://linkedin.com",
    image: undefined as string | undefined,
  },
];

const TeamPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [dbMembers, setDbMembers] = useState<TeamMemberData[]>([]);

  useEffect(() => {
    let isMounted = true;
    aboutUsContentApi
      .getPublicTeamMembers()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0 && isMounted) {
          setDbMembers(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const items =
    dbMembers.length > 0
      ? dbMembers.map((m) => {
          const name = getMultiLangText(m.name, currentLang);
          const initials =
            m.initials ||
            name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase() ||
            "TM";

          return {
            name,
            role: getMultiLangText(m.role, currentLang),
            division: getMultiLangText(m.division, currentLang, "Executive"),
            bio: getMultiLangText(m.bio, currentLang),
            initials,
            color: m.color || "from-purple-600 to-pink-600",
            phone: m.phone,
            email: m.email,
            linkedin: m.linkedin,
            image: m.image,
          };
        })
      : defaultTeamMembers;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge="Leadership"
        title="Our Team"
        subtitle="The dedicated professionals, scientists, legal minds, and venture experts driving NIRDC's operational excellence."
        breadcrumbs={[
          { label: "About Us", href: "/about-us" },
          { label: "Our Team" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((member, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Avatar / Photo */}
                <div className="flex items-center gap-4 mb-6">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-200 dark:border-white/10 shadow-md"
                    />
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${member.color} text-white font-extrabold text-xl flex items-center justify-center shadow-md`}
                    >
                      {member.initials}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold leading-tight">{member.name}</h3>
                    <p className="text-xs font-semibold text-primary dark:text-pink-400 uppercase tracking-wider mt-1">
                      {member.role}
                    </p>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {member.division}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>
              </div>

              {/* Social / Direct Contacts */}
              <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex items-center gap-4 text-gray-400">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="hover:text-primary transition-colors p-1"
                    title={member.phone}
                  >
                    <Phone size={18} />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:text-primary transition-colors p-1"
                    title={member.email}
                  >
                    <Mail size={18} />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors p-1"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;

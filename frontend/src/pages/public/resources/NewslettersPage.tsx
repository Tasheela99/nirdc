import React, { useState } from "react";
import PageHero from "@/components/common/PageHero";
import { Mail, Calendar, ArrowRight, Download, CheckCircle2 } from "lucide-react";

const newsletterIssues = [
  {
    issue: "Issue 12 — Dec 2024",
    title: "Year-End Renaissance: 20 Commercialisation Breakthroughs of 2024",
    highlight:
      "A special retrospective honoring top innovators in nanotech, agri-bio, and green energy who achieved market deployment this year.",
    date: "December 2024",
  },
  {
    issue: "Issue 11 — Nov 2024",
    title: "Venture Capital Influx: Mobilising Foreign Direct Innovation Investment",
    highlight:
      "Insights into our Singapore and Tokyo bilateral investor roadshows, with over $12M pledged for Sri Lankan deep-tech spin-offs.",
    date: "November 2024",
  },
  {
    issue: "Issue 10 — Oct 2024",
    title: "Patenting Indigenous Science: Protecting Sovereign Herbal & Biological IP",
    highlight:
      "Special feature on Ayurvedic pharmacology standardization and patent filings in major global regulatory jurisdictions.",
    date: "October 2024",
  },
  {
    issue: "Issue 09 — Sep 2024",
    title: "University Spin-Offs in Action: Campus Labs to Factory Floors",
    highlight:
      "Profiling 4 student-led hardware robotics ventures from Moratuwa and Peradeniya expanding into commercial pilot manufacturing.",
    date: "September 2024",
  },
  {
    issue: "Issue 08 — Aug 2024",
    title: "Clean Technology Corridors: Sri Lanka's Graphite & Battery Frontier",
    highlight:
      "In-depth analysis of value addition in high-purity vein graphite for international EV battery manufacturing consortia.",
    date: "August 2024",
  },
  {
    issue: "Issue 07 — Jul 2024",
    title: "Democratising Seed Funding: Regional Innovation Grants Unveiled",
    highlight:
      "How NIRDC’s provincial outreach centers are funding rural inventions across agriculture, water filtration, and solar drying.",
    date: "July 2024",
  },
];

const NewslettersPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge="Resources"
        title="Newsletters"
        subtitle="Curated monthly roundups of high-impact research, commercialisation milestones, and venture opportunities."
        breadcrumbs={[
          { label: "Resources", href: "/resources/newsletters" },
          { label: "Newsletters" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        {/* Subscription Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/15 via-white dark:via-white/5 to-white dark:to-[#1A0D15] border border-primary/20 dark:border-pink-500/30 shadow-xl max-w-3xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary dark:text-pink-400 flex items-center justify-center">
            <Mail size={28} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Subscribe to NIRDC Innovation Digest
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-xl mx-auto">
            Receive exclusive monthly updates on new grant openings, investment roadshows, patent disclosures, and breakthrough technologies directly to your inbox.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              <CheckCircle2 size={18} />
              <span>Thank you! You are now subscribed to our newsletter.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your official email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Newsletter Archive */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold mb-3">Newsletter Archive</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Catch up on past issues, stories of innovation triumphs, and strategic sector roundups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsletterIssues.map((item, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="font-bold text-primary dark:text-pink-400 uppercase tracking-wider">
                      {item.issue}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {item.highlight}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">
                    PDF Edition
                  </span>
                  <button
                    onClick={() => alert(`Reading ${item.title}...`)}
                    className="text-xs font-semibold text-primary dark:text-pink-400 hover:underline flex items-center gap-1"
                  >
                    <Download size={13} />
                    <span>Download Edition</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewslettersPage;



const ResearchProposalGuidelines = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-12 border border-gray-200">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-main-color mb-6">
            Guidelines for Research Proposal (R&D) Application
          </h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">


          {/* Research Gaps */}
          <div>
            <h2 className="text-2xl font-semibold text-main-color mb-3">
              Research Gaps
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Identify the gaps preventing your research from reaching the market in the following areas (up to 100 words total):
            </p>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
              <li>Technical (prototype refinement, testing, etc.)</li>
              <li>Financial (funding for production or marketing, etc.)</li>
              <li>Regulatory (certifications or approvals required, etc.)</li>
              <li>Infrastructure (specialized lab equipment or manufacturing setups, etc.)</li>
              <li>Any other relevant areas</li>
            </ul>
          </div>

          {/* Innovation/Novelty */}
          <div>
            <h2 className="text-2xl font-semibold text-main-color mb-3">
              Innovation/Novelty (Scientific and Technical)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Explain how your research is innovative or unique in{" "}
              <span className="font-bold text-main-color">100 words</span>. Highlight any scientific breakthroughs, technological advancements, or novel applications.
            </p>
          </div>

          {/* Current Outputs */}
          <div>
            <h2 className="text-2xl font-semibold text-main-color mb-3">
              Current Outputs
            </h2>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
              <li>Patent status (applied/granted)</li>
              <li>Patent details (number, date, local/international)</li>
              <li>Technology Readiness Level (TRL 1-9)</li>
              <li>Publications or Google Scholar link</li>
            </ul>
          </div>

          {/* Research Plan */}
          <div>
            <h2 className="text-2xl font-semibold text-main-color mb-3">
              Research Plan
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Attach a write-up (not exceeding 3 pages) covering:
            </p>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
              <li>Background and introduction with relevant references</li>
              <li>Specific aims/actions matching your objectives</li>
              <li>Experimental methodologies</li>
              <li>Timeline and major milestones</li>
              <li>Expected challenges and alternative approaches</li>
            </ul>
          </div>

          {/* Project Cost */}
          <div>
            <h2 className="text-2xl font-semibold text-main-color mb-3">
              Total Project Cost
            </h2>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
              <li>Total cost to date (specify USD or LKR)</li>
              <li>Expected total funding for gap filling</li>
              <li>Cost breakdown per milestone</li>
            </ul>
          </div>

          {/* Research Location */}
          <div>
            <h2 className="text-2xl font-semibold text-main-color mb-3">
              Research Location(s)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              List all locations where key research activities will be conducted (e.g., University, research institute, private company, etc.).
            </p>
          </div>

          {/* Required Documents Note */}
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-main-color">
            <h3 className="text-xl font-semibold text-main-color mb-3">
              Required Documents for Next Level
            </h3>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
              <li>Detailed business/commercialization plan</li>
              <li>Detailed research methodologies</li>
              <li>Comprehensive budget breakdown (equipment, consumables, workforce, etc.)</li>
              <li>Collaboration details (agency names, interventions, financial contributions)</li>
              <li>Research team information</li>
              <li>Risk assessment and contingency plan</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchProposalGuidelines;

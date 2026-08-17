import React from "react";

const ResearchAndInvestmentGuidelines: React.FC = () => {
    return (
        <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-12 border border-gray-200">
                {/* Title Section */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-main-color mb-6">
                        Research & Investment Guidelines
                    </h1>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">

                    {/* Title of the Project */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-3">
                            Title of the Project
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Provide a clear and concise title that reflects the essence of your research.
                        </p>
                    </div>

                    {/* Investment Objectives */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-3">
                            Investment Objectives
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Define 1-5 objectives of your investment in 200 words or less. Focus on the goals and intended outcomes.
                        </p>
                    </div>

                    {/* Market Demand */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-3">
                            Market Demand
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Provide evidence of market demand (up to{" "}
                            <span className="font-bold text-main-color">100 words</span>). Use data to demonstrate that there is a need for your solution, whether in local or international markets. You can include market research, competitor analysis, or industry interest.
                        </p>
                    </div>

                    {/* Required Assistance */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-3">
                            Required Assistance
                        </h2>
                        <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                            <li>Funds</li>
                            <li>Regulatory approvals</li>
                            <li>Land</li>
                            <li>Access to infrastructure/equipment</li>
                            <li>Technical assistance</li>
                            <li>Industry partnerships</li>
                            <li>IP/Patent applications</li>
                            <li>Other (please specify)</li>
                        </ul>
                    </div>

                    {/* Research Gaps */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-3">
                            Research Gaps
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Explain the gaps preventing your research from reaching the market in the following areas:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                            <li>Technical: Prototype refinement, testing, etc.</li>
                            <li>Financial: Funding for production or marketing, etc.</li>
                            <li>Regulatory: Certifications or approvals required, etc.</li>
                            <li>Infrastructure: Need for specialized lab equipment or manufacturing setups, etc.</li>
                            <li>Any other area</li>
                        </ul>
                    </div>

                    {/* Research Objectives */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-3">
                            Research Objectives
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Define 1-5 objectives that align EXACTLY with the gap-filling needs mentioned above. Use{" "}
                            <span className="font-bold text-main-color">200 words</span> or less in total.
                        </p>
                    </div>

                    {/* Significance */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-3">
                            Significance for the Country and Expected Impact
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Describe how your research can contribute to the economic, social, or environmental development of the country, using no more than{" "}
                            <span className="font-bold text-main-color">100 words</span> in each category:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                            <li>Economic Impact: GDP, export potential, tax revenue generation, etc.</li>
                            <li>Social Impact: Benefits to society, e.g., improving public health or creating jobs.</li>
                            <li>Environmental Impact: Address positive or negative environmental impacts.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResearchAndInvestmentGuidelines;

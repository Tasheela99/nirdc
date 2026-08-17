import { FC } from "react";

const InvestorGuidelinesScreen: FC = () => {
    return (
        <section className="bg-gradient-to-b from-white to-gray-50 py-8 px-4 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-8 space-y-10 border border-gray-200">
                {/* Title Section */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-main-color mb-4">
                        Guidelines for Filling Out the Investor Application
                    </h1>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">


                    {/* Objectives */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-2">
                            Objectives
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Define <span className="font-bold text-main-color">1-5 objectives</span> of your investment in <span className="font-bold text-main-color">200 words or less</span>. Focus on the goals and intended outcomes.
                        </p>
                    </div>

                    {/* Market Demand */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-2">
                            Market Demand
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Provide evidence of market demand (up to <span className="font-bold text-main-color">100 words</span>). Use data such as market research, competitor analysis, or industry interest to demonstrate the need for your solution in local or international markets.
                        </p>
                    </div>

                    {/* Significance for the Country and Expected Impact */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-2">
                            Significance for the Country and Expected Impact
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Describe how your research can contribute to the economic, social, or environmental development of the country. Use up to <span className="font-bold text-main-color">100 words</span> for each category:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                            <li>
                                <span className="font-bold text-main-color">Economic Impact:</span> Contributions to GDP, export potential, foreign exchange savings, tax revenue generation, etc.
                            </li>
                            <li>
                                <span className="font-bold text-main-color">Social Impact:</span> Improving public health, enhancing education, creating jobs, etc.
                            </li>
                            <li>
                                <span className="font-bold text-main-color">Environmental Impact:</span> Addressing positive or negative environmental impacts.
                            </li>
                        </ul>
                    </div>

                    {/* Total Project Investment */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-2">
                            Total Project Investment
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Indicate the source of funding and whether the value is in <span className="font-bold text-main-color">USD</span> or <span className="font-bold text-main-color">LKR</span>. Provide details of investment timelines and intended KPIs.
                        </p>
                    </div>

                    {/* Expected Return on Investment */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-2">
                            Expected Return on Investment
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Provide forecasts such as <span className="font-bold text-main-color">IRR</span>, <span className="font-bold text-main-color">NPV</span>, Payback Period, Cost-Benefit Ratio, etc., to estimate returns.
                        </p>
                    </div>

                    {/* Existing Resources & Collaborations */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-2">
                            Existing Resources & Collaborations
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            List local and international collaborations, partnerships, or agreements. Specify the nature and financial contributions of each partnership, as well as the benefit-sharing process.
                        </p>
                    </div>

                    {/* Required Assistance from the Government */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-2">
                            Required Assistance from the Government
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            List all forms of support needed from the government, such as:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                            <li>Regulatory approvals</li>
                            <li>Land</li>
                            <li>Financial assistance</li>
                            <li>Access to infrastructure/equipment</li>
                            <li>Industry partnerships</li>
                            <li>IP/Patent applications</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                            This helps the government allocate resources appropriately.
                        </p>
                    </div>

                    {/* Risk and Assumptions */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-2">
                            Risk and Assumptions
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Describe the key risks associated with your project, such as technical challenges or market adoption issues, and outline assumptions made in estimating success (<span className="font-bold text-main-color">100 words max</span>).
                        </p>
                    </div>

                    {/* Supporting Documents */}
                    <div>
                        <h2 className="text-2xl font-semibold text-main-color mb-2">
                            Supporting Documents
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Attach certifications and other relevant documents. Be prepared to provide detailed plans, budgets, and benefit-sharing details if selected for the next level.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InvestorGuidelinesScreen;

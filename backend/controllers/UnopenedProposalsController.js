// Get count of unopened proposals for both types
const ResearchProposalApplicationSchema = require('../schemas/ResearchProposalApplicationSchema');
const ResearchInvestmentApplicationSchema = require('../schemas/ResearchInvestmentApplicationSchema');
const InvestorApplicationSchema = require('../schemas/InvestorApplicationSchema');

const getUnopenedProposalsCount = async (req, res) => {
    try {
        const [researchCount, investorCount, researchInvestmentCount] = await Promise.all([
            ResearchProposalApplicationSchema.countDocuments({ isOpenedByAdmin: false }),
            InvestorApplicationSchema.countDocuments({ isOpenedByAdmin: false }),
            ResearchInvestmentApplicationSchema.countDocuments({ isOpenedByAdmin: false })
        ]);
        return res.status(200).json({
            status: true,
            message: 'Unopened proposals count',
            data: {
                research: researchCount,
                investor: investorCount,
                researchInvestment: researchInvestmentCount,
                total: researchCount + investorCount + researchInvestmentCount
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Error fetching unopened proposals count',
            error: error.message
        });
    }
};

module.exports = { getUnopenedProposalsCount };

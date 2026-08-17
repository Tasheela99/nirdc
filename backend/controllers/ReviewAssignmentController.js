const ReviewAssignmentSchema = require('../schemas/ReviewAssignmentSchema');
const UserSchema = require('../schemas/UserSchema');
const ResearchProposalApplicationSchema = require('../schemas/ResearchProposalApplicationSchema');
const InvestorApplicationSchema = require('../schemas/InvestorApplicationSchema');
const ResearchInvestmentApplicationSchema = require('../schemas/ResearchInvestmentApplicationSchema');

const assignReviewer = async (req, res) => {
    try {
        const { proposalId, proposalType, reviewerId } = req.body;
        const assignedBy = req.user.id; // from auth middleware

        if (!proposalId || !proposalType || !reviewerId) {
            return res.status(400).json({ status: false, message: 'Missing required fields' });
        }

        // Verify the reviewer exists and is approved
        const reviewer = await UserSchema.findById(reviewerId);
        if (!reviewer || reviewer.role !== 'REVIEWER' || reviewer.reviewerStatus !== 'APPROVED') {
            return res.status(400).json({ status: false, message: 'Invalid or unapproved reviewer' });
        }

        // Check how many reviewers are already assigned
        const currentAssignments = await ReviewAssignmentSchema.find({ proposalId });
        if (currentAssignments.length >= 3) {
            return res.status(400).json({ status: false, message: 'This proposal already has the maximum of 3 reviewers assigned' });
        }

        // Check if this reviewer is already assigned
        const alreadyAssigned = currentAssignments.some(a => a.reviewerId.toString() === reviewerId);
        if (alreadyAssigned) {
            return res.status(400).json({ status: false, message: 'This reviewer is already assigned to this proposal' });
        }

        const assignment = new ReviewAssignmentSchema({
            proposalId,
            proposalType,
            reviewerId,
            assignedBy
        });

        await assignment.save();
        return res.status(201).json({ status: true, message: 'Reviewer assigned successfully', data: assignment });

    } catch (error) {
        console.error('Error assigning reviewer:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const getReviewsForProposal = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await ReviewAssignmentSchema.countDocuments({ proposalId });
        const assignments = await ReviewAssignmentSchema.find({ proposalId })
            .populate('reviewerId', 'firstName lastName email designation institution areasOfExpertise')
            .populate('assignedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({ 
            status: true, 
            data: assignments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const getAssignedProposals = async (req, res) => {
    try {
        const reviewerId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { reviewerId };
        if (req.query.status) {
            query.status = req.query.status;
        }

        const total = await ReviewAssignmentSchema.countDocuments(query);
        const assignments = await ReviewAssignmentSchema.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // We need to fetch the actual proposal details for each assignment
        const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
            let proposal = null;
            if (assignment.proposalType === 'research-proposal') {
                proposal = await ResearchProposalApplicationSchema.findById(assignment.proposalId).select('title department applicationStatus applicationId createdAt');
            } else if (assignment.proposalType === 'investment') {
                proposal = await InvestorApplicationSchema.findById(assignment.proposalId).select('title department applicationStatus applicationId createdAt');
            } else if (assignment.proposalType === 'research-investment') {
                proposal = await ResearchInvestmentApplicationSchema.findById(assignment.proposalId).select('title department applicationStatus applicationId createdAt');
            }

            return {
                ...assignment.toObject(),
                proposalDetails: proposal
            };
        }));

        return res.status(200).json({ 
            status: true, 
            data: enrichedAssignments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching assigned proposals:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const submitReview = async (req, res) => {
    try {
        const reviewerId = req.user.id;
        const { assignmentId } = req.params;
        const { marks, comment } = req.body;

        if (marks === undefined || !comment) {
            return res.status(400).json({ status: false, message: 'Marks and comment are required' });
        }

        const assignment = await ReviewAssignmentSchema.findOne({ _id: assignmentId, reviewerId });
        if (!assignment) {
            return res.status(404).json({ status: false, message: 'Assignment not found or unauthorized' });
        }

        assignment.marks = marks;
        assignment.comment = comment;
        assignment.status = 'COMPLETED';
        assignment.completedAt = new Date();

        await assignment.save();
        return res.status(200).json({ status: true, message: 'Review submitted successfully', data: assignment });
    } catch (error) {
        console.error('Error submitting review:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const removeAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        await ReviewAssignmentSchema.findByIdAndDelete(assignmentId);
        return res.status(200).json({ status: true, message: 'Assignment removed successfully' });
    } catch (error) {
        console.error('Error removing assignment:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    assignReviewer,
    getReviewsForProposal,
    getAssignedProposals,
    submitReview,
    removeAssignment
};

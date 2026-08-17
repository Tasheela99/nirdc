// Get Research Proposal Application by ID
const getResearchProposalApplicationById = async (req, res) => {
    try {
        const proposalId = req.params.id;
        // Mark as opened by admin if not already
        let proposal = await ResearchProposalApplicationSchema.findById(proposalId);
        if (proposal && !proposal.isOpenedByAdmin) {
            proposal.isOpenedByAdmin = true;
            await proposal.save();
        }
        // Populate user info after possible update
        proposal = await ResearchProposalApplicationSchema
            .findById(proposalId)
            .populate('userId', 'userName email mobile firstName lastName');
        if (!proposal) {
            return res.status(404).json({
                status: false,
                message: 'Research proposal not found'
            });
        }
        return res.status(200).json({
            status: true,
            message: 'Research proposal retrieved successfully',
            data: proposal
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Error fetching research proposal',
            error: error.message
        });
    }
};

// Get Research Proposal Applications by User
const getResearchProposalApplicationsByUser = async (req, res) => {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    try {
        const result = await ResearchProposalApplicationSchema.find({ userId })
            .skip(skip)
            .limit(limit);
        const totalCount = await ResearchProposalApplicationSchema.countDocuments({ userId });
        const totalPages = Math.ceil(totalCount / limit);
        return res.status(200).json({
            status: true,
            message: 'Research Proposals By User',
            data: result,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalCount,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Error fetching Research Proposals by user',
            error: error.message
        });
    }
};
const ResearchProposalApplicationSchema = require('../schemas/ResearchProposalApplicationSchema');
const UserSchema = require('../schemas/UserSchema');
const { sendMail, sendProposalStatusEmail, sendProposalSubmissionDetailsEmail } = require('../utils/EmailUtil');
const { awsFolderNames } = require("../utils/FileUploadAwsUtil");
const ApplicationService = require('../services/ApplicationService');
const logger = require('../utils/LoggerUtil');
const ResearchInvestmentApplicationSchema = require("../schemas/ResearchInvestmentApplicationSchema");


// Save Research Proposal
const saveResearchProposal = async (req, res) => {
    try {
        // Parse JSON strings from form-data using ApplicationService
        let significanceData, patentData;
        try {
            significanceData = ApplicationService.parseJsonField(req.body.significance, 'significance');
            patentData = ApplicationService.parseJsonField(req.body.intellectualProperty, 'intellectualProperty');
        } catch (parseError) {
            return res.status(400).json({
                status: false,
                message: "Invalid JSON in request body.",
                error: parseError.message,
            });
        }

        // Generate applicationId
        const applicationId = ApplicationService.createApplicationId('RPINV');

        // Upload files to AWS S3 using ApplicationService
        const { supportingDocumentsUrls, certificationsUrls } = await ApplicationService.uploadApplicationFiles(
            req.files,
            awsFolderNames.researchProposalResource,
            req.user.id
        );

        // Prepare main application data with embedded objects and S3 URLs
        const applicationData = {
            userId: req.user.id,
            department: req.body.department || "",
            title: req.body.title || "",
            researchGaps: req.body.researchGaps || "",
            objectives: req.body.objectives || "",
            significance: significanceData,
            marketDemand: req.body.marketDemand || "",
            innovation: req.body.innovation || "",
            intellectualProperty: patentData,
            technologyReadinessLevel: req.body.technologyReadinessLevel || "",
            publications: req.body.publications || "",
            researchPlan: req.body.researchPlan || "",
            existingResources: req.body.existingResources || "",
            supportingDocuments: supportingDocumentsUrls,
            certifications: certificationsUrls,
            currency: req.body.currency || "",
            currencyValue: req.body.currencyValue || "",
            expenditure: req.body.expenditure || "",
            budget: req.body.budget || "",
            milestone_budget: req.body.milestone_budget || "",
            research_place: req.body.researchPlace || req.body.research_place || "",
            resources: req.body.resources || req.body.resource || req.body.existingResources || "",
            applicationId: applicationId,
        };

        const application = await new ResearchProposalApplicationSchema(applicationData).save();

        // Find user to get full details for email
        const user = await UserSchema.findById(req.user.id);
        
        // Send HTML proposal details email
        if (user) {
            await sendProposalSubmissionDetailsEmail(user, "Research Proposal", application.toObject());
        }

        return res.status(201).json({
            status: true,
            message: 'Research proposal created successfully',
            data: {
                applicationId: application._id
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Error processing application',
            error: error.message,
        });
    }
};

// Get All Research Proposals
const getAllResearchProposalApplications = async (req, res) => {
    try {
        const proposals = await ResearchProposalApplicationSchema
            .find()
            .populate('userId', 'userName email mobile')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: 'Research proposals retrieved successfully',
            data: proposals
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Error fetching proposals',
            error: error.message
        });
    }
};

const getResearchProposalApplicationCount = async (req, res) => {
    try {
        const count = await ResearchProposalApplicationSchema.countDocuments();
        return res.status(200).json({
            status: true,
            message: 'Research proposal retrieved successfully',
            count: count
        });
    } catch (error) {
        console.error('Error fetching count:', error);
        res.status(500).json({ error: 'Failed to fetch count' });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate the status value
        const validStatuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid status value. Must be PENDING, UNDER_REVIEW, APPROVED, or REJECTED.'
            });
        }

        const application = await ResearchProposalApplicationSchema.findById(id);
        if (!application) {
            return res.status(404).json({
                status: false,
                message: 'Application not found.'
            });
        }

        application.applicationStatus = status;
        await application.save();

        // Send professional email notification to the user about status change
        const user = await UserSchema.findById(application.userId);
        if (user) {
            await sendProposalStatusEmail(
                user,
                application.applicationId,
                'Research Proposal',
                status
            );
        }

        return res.status(200).json({
            status: true,
            message: 'Application status updated successfully.',
            data: {
                applicationId: application._id,
                applicationStatus: application.applicationStatus
            }
        });

    } catch (error) {
        console.error("Error updating application status:", error);
        return res.status(500).json({
            status: false,
            message: 'Error updating application status',
            error: error.message
        });
    }
};

const getApplicationsByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        // Validate the status value
        const validStatuses = ['APPROVED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid status value. Must be APPROVED or REJECTED.'
            });
        }

        const applications = await ResearchProposalApplicationSchema
            .find({ applicationStatus: status })
            .populate('userId', 'userName email mobile firstName lastName')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: `${status} research proposal applications retrieved successfully`,
            data: applications
        });

    } catch (error) {
        console.error(`Error fetching ${req.query.status} research proposal applications:`, error);
        return res.status(500).json({
            status: false,
            message: `Error fetching ${req.query.status} research proposal applications`,
            error: error.message
        });
    }
};

// Add a comment to a proposal
const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user?._id || req.user?.id;

        if (!text || !text.trim()) {
            return res.status(400).json({ status: false, message: 'Comment text is required.' });
        }

        const application = await ResearchProposalApplicationSchema.findById(id);
        if (!application) {
            return res.status(404).json({ status: false, message: 'Application not found.' });
        }

        const user = await UserSchema.findById(userId);
        const comment = {
            text: text.trim(),
            authorId: userId,
            authorName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unknown',
            role: user?.role || 'ADMIN',
            createdAt: new Date()
        };

        application.comments.push(comment);
        await application.save();

        return res.status(200).json({ status: true, message: 'Comment added successfully.', data: comment });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ status: false, message: 'Error adding comment', error: error.message });
    }
};

// Get all comments for a proposal
const getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await ResearchProposalApplicationSchema.findById(id).select('comments');
        if (!application) {
            return res.status(404).json({ status: false, message: 'Application not found.' });
        }
        return res.status(200).json({
            status: true,
            data: application.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ status: false, message: 'Error fetching comments', error: error.message });
    }
};

module.exports = {
    saveResearchProposal,
    getAllResearchProposalApplications,
    getResearchProposalApplicationById,
    getResearchProposalApplicationsByUser,
    getResearchProposalApplicationCount,
    updateApplicationStatus,
    getApplicationsByStatus,
    addComment,
    getComments
};

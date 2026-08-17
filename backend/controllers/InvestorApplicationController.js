const InvestorApplicationSchema = require('../schemas/InvestorApplicationSchema');
const UserSchema = require("../schemas/UserSchema");
const { sendMail, sendProposalStatusEmail, sendProposalSubmissionDetailsEmail } = require("../utils/EmailUtil");
const { awsFolderNames, handleFileUploads } = require("../utils/FileUploadAwsUtil");
const { promises: fs } = require("fs");
const { generateApplicationId } = require("../utils/OtpGeneraterUtil");
const ResearchInvestmentApplicationSchema = require("../schemas/ResearchInvestmentApplicationSchema");

const saveInvestorApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const applicationId = generateApplicationId("INV")
        const user = await UserSchema.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found.",
            });
        }

        // Handle file uploads
        let resource = [];
        const awsFolder = awsFolderNames.resource;

        try {
            const files = req.files?.resource || req.file?.resource;

            if (files) {
                const fileArray = Array.isArray(files) ? files : [files];
                resource = await handleFileUploads(fileArray, awsFolder, userId, 'resources');
                // Uploaded resource URLs (console.log removed)
            }
        } catch (uploadError) {
            console.error("File upload error:", uploadError);
            return res.status(500).json({
                status: false,
                message: "Error uploading files to AWS S3.",
                error: uploadError.message
            });
        }

        if (resource.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No files uploaded.",
            });
        }

        // --- Legacy support: map governmentAssistance to requiredAssistanceFromGovernment if present ---
        if (!req.body.requiredAssistanceFromGovernment && req.body.governmentAssistance) {
            try {
                const legacy = typeof req.body.governmentAssistance === 'string' ? JSON.parse(req.body.governmentAssistance) : req.body.governmentAssistance;
                // Map legacy keys to new keys
                const mapped = {
                    funds: false, // not present in legacy
                    regulatory: legacy.regulatoryApprovals || false,
                    land: legacy.land || false,
                    infrastructure: legacy.accessInfrastructure || false,
                    technicalAssistance: legacy.technicalAssistance || false,
                    partnerships: legacy.industryPartnerships || false,
                    ip: legacy.ipPatentApplications || false,
                    other: legacy.other || ""
                };
                req.body.requiredAssistanceFromGovernment = JSON.stringify(mapped);
            } catch (e) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid legacy governmentAssistance JSON.",
                    error: e.message,
                });
            }
        }

        let significanceData, existingResourcesData, requiredAssistanceData;
        try {
            significanceData = JSON.parse(req.body.significance);
            existingResourcesData = JSON.parse(req.body.existingResources);
            requiredAssistanceData = JSON.parse(req.body.requiredAssistanceFromGovernment);
            // DEBUG requiredAssistanceData (console.log removed)
        } catch (parseError) {
            return res.status(400).json({
                status: false,
                message: "Invalid JSON in request body.",
                error: parseError.message,
            });
        }

        // --- Validation: At least one required assistance must be selected or 'other' must be non-empty ---
        if (
            !requiredAssistanceData ||
            !(
                requiredAssistanceData.funds ||
                requiredAssistanceData.regulatory ||
                requiredAssistanceData.land ||
                requiredAssistanceData.infrastructure ||
                requiredAssistanceData.technicalAssistance ||
                requiredAssistanceData.partnerships ||
                requiredAssistanceData.ip ||
                (typeof requiredAssistanceData.other === 'string' && requiredAssistanceData.other.trim() !== "")
            )
        ) {
            return res.status(400).json({
                status: false,
                message: "Required Assistance (at least one must be selected or specify 'Other')",
            });
        }

        try {

            const application = await new InvestorApplicationSchema({
                userId: userId,
                department: req.body.department,
                investmentObjectives: req.body.investmentObjectives,
                marketDemand: req.body.marketDemand,
                significance: significanceData,
                totalProjectInvestment: req.body.totalProjectInvestment,
                expectedROI: req.body.expectedROI,
                existingResources: existingResourcesData,
                requiredAssistanceFromGovernment: requiredAssistanceData,
                riskAndAssumptions: req.body.riskAndAssumptions,
                documents: resource,
                applicationId: applicationId
            }).save();

            // Send HTML proposal details email
            if (user) {
                await sendProposalSubmissionDetailsEmail(user, "Investor Application", application.toObject());
            }
            return res.status(201).json({
                status: true,
                message: "Application created successfully",
                data: {
                    applicationId: application._id
                }
            });

        } catch (saveError) {
            console.error("Error saving application:", saveError);

            // Attempt to clean up any saved documents if there's an error
            try {
            } catch (cleanupError) {
                console.error("Cleanup error:", cleanupError);
            }

            return res.status(500).json({
                status: false,
                message: "Error processing application",
                error: saveError.message,
            });
        }

    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const getAllInvestorApplications = async (req, res) => {
    try {
        const proposals = InvestorApplicationSchema
            .find()
            .populate('userId', 'userName email mobile firstName lastName')
            .lean()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: 'Research Investment Applications retrieved successfully',
            data: proposals
        });

    } catch (error) {
        console.error("Error fetching research proposals:", error);
        return res.status(500).json({
            status: false,
            message: 'Error fetching research proposals',
            error: error.message
        });
    }
};

const getInvestorApplicationById = async (req, res) => {
    try {
        const proposalId = req.params.id;

        // Validate ObjectId format
        if (!proposalId || !proposalId.match(/^[0-9a-fA-F]{24}$/)) {
            console.error('[InvestorApplicationController] Invalid ObjectId format:', proposalId);
            return res.status(400).json({
                status: false,
                message: 'Invalid proposal ID format'
            });
        }

        // Find and populate proposal with user info
        let proposal = await InvestorApplicationSchema
            .findById(proposalId)
            .populate({
                path: 'userId',
                select: 'userName email mobile firstName lastName',
                strictPopulate: false
            })
            .lean(); // Convert to plain JavaScript object for easier manipulation

        if (!proposal) {
            return res.status(404).json({
                status: false,
                message: 'Investment proposal is not found'
            });
        }

        // Handle case where user reference is missing or invalid
        if (!proposal.userId) {
            proposal.userId = {
                userName: 'Unknown User',
                email: 'N/A',
                mobile: 'N/A',
                firstName: 'Unknown',
                lastName: 'User'
            };
        }

        // Mark as opened by admin if not already (update the actual document)
        if (!proposal.isOpenedByAdmin) {
            await InvestorApplicationSchema.findByIdAndUpdate(
                proposalId,
                { isOpenedByAdmin: true },
                { new: false }
            );
            proposal.isOpenedByAdmin = true;
        }

        return res.status(200).json({
            status: true,
            message: 'Investment proposal retrieved successfully',
            data: proposal
        });

    } catch (error) {
        console.error('[InvestorApplicationController] Error:', error.message);
        return res.status(500).json({
            status: false,
            message: 'Error fetching investment proposal',
            error: error.message
        });
    }
};

const getInvestorApplicationsByUser = async (req, res) => {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    try {
        const result = await InvestorApplicationSchema.find({ user: userId })
            .skip(skip)
            .limit(limit);

        const totalCount = await InvestorApplicationSchema.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            status: true,
            message: 'InvestorApplication By User',
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
            message: 'Error fetching InvestorApplication by user',
            error: "Error",
        });
    }
};

const getInvestorApplicationsCount = async (req, res) => {
    try {
        const count = await InvestorApplicationSchema.countDocuments();
        return res.status(200).json({
            status: true,
            message: 'Research Investment  retrieved successfully',
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

        const application = await InvestorApplicationSchema.findById(id);
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
                'Investment Proposal',
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

        const applications = await InvestorApplicationSchema
            .find({ applicationStatus: status })
            .populate('userId', 'userName email mobile')
            .populate('requiredAssistanceFromGovernment')
            .populate('significance')
            .populate('existingResources')
            .lean()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: `${status} investor applications retrieved successfully`,
            data: applications
        });

    } catch (error) {
        console.error(`Error fetching ${req.query.status} investor applications:`, error);
        return res.status(500).json({
            status: false,
            message: `Error fetching ${req.query.status} investor applications`,
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

        const application = await InvestorApplicationSchema.findById(id);
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

        return res.status(200).json({
            status: true,
            message: 'Comment added successfully.',
            data: comment
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ status: false, message: 'Error adding comment', error: error.message });
    }
};

// Get all comments for a proposal
const getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await InvestorApplicationSchema.findById(id).select('comments');
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
    saveInvestorApplication,
    getAllInvestorApplications,
    getInvestorApplicationById,
    getInvestorApplicationsByUser,
    getInvestorApplicationsCount,
    updateApplicationStatus,
    getApplicationsByStatus,
    addComment,
    getComments
};
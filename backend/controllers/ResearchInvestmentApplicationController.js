const ResearchInvestmentApplicationSchema = require('../schemas/ResearchInvestmentApplicationSchema');
const { awsFolderNames, handleFileUploads } = require("../utils/FileUploadAwsUtil");
const UserSchema = require("../schemas/UserSchema");
const { sendMail, sendProposalStatusEmail, sendProposalSubmissionDetailsEmail } = require("../utils/EmailUtil");
const ApplicationService = require("../services/ApplicationService");
const logger = require("../utils/LoggerUtil");
const ResearchProposalApplicationSchema = require("../schemas/ResearchProposalApplicationSchema");
const InvestorApplicationSchema = require("../schemas/InvestorApplicationSchema");


const saveResearchApplication = async (req, res) => {
    // No separate collections, all data will be embedded
    try {
        const userId = req.user.id;
        const applicationId = ApplicationService.createApplicationId("RINV");
        const user = await UserSchema.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found." });
        }

        let certificationsDocuments = [];
        let extraCertificationsDocuments = [];
        const awsFolder = awsFolderNames.researchInvestmentResource;

        // Handle file uploads
        try {
            if (req.files?.certificationsDocuments) {
                const files = Array.isArray(req.files.certificationsDocuments)
                    ? req.files.certificationsDocuments
                    : [req.files.certificationsDocuments];
                certificationsDocuments = await handleFileUploads(files, awsFolder, userId, "certifications-documents");
            }

            if (req.files?.extraCertificationsDocuments) {
                const files = Array.isArray(req.files.extraCertificationsDocuments)
                    ? req.files.extraCertificationsDocuments
                    : [req.files.extraCertificationsDocuments];
                extraCertificationsDocuments = await handleFileUploads(files, awsFolder, userId, "extra-certifications-documents");
            }
        } catch (uploadError) {
            return res.status(500).json({
                status: false,
                message: "Error uploading files to AWS S3.",
                error: uploadError.message,
            });
        }

        // Parse and validate JSON fields (handle both string and object)
        let requiredAssistanceData, patentData;
        try {
            requiredAssistanceData = ApplicationService.parseJsonField(req.body.requiredAssistanceFromGovernment, 'requiredAssistanceFromGovernment');

            const intellectualProperty = ApplicationService.parseJsonField(req.body.intellectualProperty, 'intellectualProperty');

            if (intellectualProperty && intellectualProperty.status === "None") {
                patentData = { status: "None" };
            } else {
                patentData = {
                    ...intellectualProperty,
                };
            }
        } catch (parseError) {
            return res.status(400).json({
                status: false,
                message: "Invalid JSON in request body.",
                error: parseError.message,
            });
        }

        // Validate length-constrained fields
        const validateFieldLength = (field, maxLength, fieldName) => {
            if (field && field.trim().length > maxLength) {
                return `${fieldName} must not exceed ${maxLength} characters.`;
            }
            return null;
        };

        // Validate numeric fields if provided (optional fields)
        const numericFields = [
            { value: req.body.projectCost, name: "projectCost" },
            { value: req.body.expenditure, name: "expenditure" },
            { value: req.body.budget, name: "budget" },
        ];
        const invalidNumericFields = numericFields.filter(f => f.value && f.value !== '' && isNaN(Number(f.value)));
        if (invalidNumericFields.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Invalid numeric values for fields: ${invalidNumericFields.map(f => f.name).join(", ")}`
            });
        }

        const validationErrors = [
            validateFieldLength(req.body.investmentObjectives, 5000, "Investment Objectives"),
            validateFieldLength(req.body.marketDemand, 5000, "Market Demand"),
        ].filter((error) => error);

        if (validationErrors.length > 0) {
            return res.status(400).json({
                status: false,
                message: "Validation error.",
                errors: validationErrors,
            });
        }

        // Save main application with embedded objects
        try {
            const application = await new ResearchInvestmentApplicationSchema({
                userId,
                department: req.body.department,
                projectTitle: req.body.projectTitle,
                investmentObjectives: req.body.investmentObjectives,
                marketDemand: req.body.marketDemand,
                requiredAssistanceFromGovernment: requiredAssistanceData,
                researchGaps: req.body.researchGaps,
                researchObjectives: req.body.researchObjectives,
                researchPlan: req.body.researchPlan,
                currencyValue: req.body.currencyValue,
                projectCost: req.body.projectCost !== undefined && req.body.projectCost !== null ? String(req.body.projectCost) : "",
                expenditure: req.body.expenditure !== undefined && req.body.expenditure !== null ? String(req.body.expenditure) : "",
                budget: req.body.budget !== undefined && req.body.budget !== null ? String(req.body.budget) : "",
                researchPlace: req.body.researchPlace,

                significance: typeof req.body.significance === 'string'
                    ? JSON.parse(req.body.significance)
                    : req.body.significance,

                intellectualProperty: {
                    patentNumber: patentData.patentNumber || "",
                    receivedDate: patentData.receivedDate || "",
                    localOrInternational: patentData.localOrInternational || "",
                    status: patentData.status || "",
                },

                trl: req.body.trl,
                publications: req.body.publications,
                totalInvestment: req.body.totalInvestment,
                roi: req.body.roi,
                resourcesCollaborations: req.body.resourcesCollaborations,
                riskAssumptions: req.body.riskAssumptions,
                certificationsDocuments,
                extraCertificationsDocuments,
                applicationId: applicationId,
            }).save();

            // Send HTML proposal details email
            if (user) {
                await sendProposalSubmissionDetailsEmail(user, "Research Investment Application", application.toObject());
            }

            return res.status(201).json({
                status: true,
                message: "Application created successfully.",
                data: { applicationId: application._id },
            });
        } catch (saveError) {
            console.error("Error saving application:", saveError);
            return res.status(500).json({
                status: false,
                message: "Error processing application.",
                error: saveError.message,
            });
        }
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({
            status: false,
            message: "Server error.",
            error: error.message,
        });
    }
};


const getAllResearchApplications = async (req, res) => {
    try {
        const proposals = await ResearchInvestmentApplicationSchema
            .find()
            .populate('userId', 'userName email mobile firstName lastName')
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

const getResearchApplicationById = async (req, res) => {
    try {
        const proposalId = req.params.id;

        // Mark as opened by admin if not already
        let proposal = await ResearchInvestmentApplicationSchema.findById(proposalId);
        if (proposal && !proposal.isOpenedByAdmin) {
            proposal.isOpenedByAdmin = true;
            await proposal.save();
        }
        // Populate user info after possible update
        proposal = await ResearchInvestmentApplicationSchema
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
        console.error("Error fetching research proposal:", error);
        return res.status(500).json({
            status: false,
            message: 'Error fetching research proposal',
            error: error.message
        });
    }
};

const getResearchApplicationsByUser = async (req, res) => {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    try {
        const result = await ResearchInvestmentApplicationSchema.find({ userId: userId })
            .skip(skip)
            .limit(limit);

        const totalCount = await ResearchInvestmentApplicationSchema.countDocuments({ userId: userId });
        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            status: true,
            message: 'ResearchApplication By User',
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
            message: 'Error fetching ResearchApplication by user',
            error: "Error"
        });
    }
};

const getResearchInvestmentApplicationsCount = async (req, res) => {
    try {
        const count = ResearchInvestmentApplicationSchema.countDocuments();
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

        const application = await ResearchInvestmentApplicationSchema.findById(id);
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
                'Research Investment Proposal',
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

        const applications = await ResearchInvestmentApplicationSchema
            .find({ applicationStatus: status })
            .populate('userId', 'userName email mobile firstName lastName')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: `${status} research investment applications retrieved successfully`,
            data: applications
        });

    } catch (error) {
        console.error(`Error fetching ${req.query.status} research investment applications:`, error);
        return res.status(500).json({
            status: false,
            message: `Error fetching ${req.query.status} research investment applications`,
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

        const application = await ResearchInvestmentApplicationSchema.findById(id);
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
        const application = await ResearchInvestmentApplicationSchema.findById(id).select('comments');
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
    saveResearchApplication,
    getAllResearchApplications,
    getResearchApplicationById,
    getResearchApplicationsByUser,
    getResearchInvestmentApplicationsCount,
    updateApplicationStatus,
    getApplicationsByStatus,
    addComment,
    getComments
};
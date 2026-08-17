const InvestorApplicationSchema = require('../schemas/InvestorApplicationSchema');
const ResearchInvestmentApplicationSchema = require('../schemas/ResearchInvestmentApplicationSchema');
const ResearchProposalApplicationSchema = require('../schemas/ResearchProposalApplicationSchema');
const UserSchema = require('../schemas/UserSchema');
const mongoose = require('mongoose');
const { deleteFileFromAws, extractFileNameFromUrl } = require('../utils/FileUploadAwsUtil');

/**
 * Delete proposal by Admin/Super Admin with role-based access control
 * Only ADMIN and SUPER_ADMIN can delete proposals
 */
const adminDeleteProposal = async (req, res) => {
    try {
        const proposalId = req.params.id;
        const requestingUserId = req.user.id;
        const requestingUserRole = req.user.role;

        // Role-based access control - Only ADMIN and SUPER_ADMIN
        if (requestingUserRole !== 'ADMIN' && requestingUserRole !== 'SUPER_ADMIN') {
            return res.status(403).json({
                status: false,
                message: 'PERMISSION DENIED: Only ADMIN and SUPER_ADMIN can delete proposals'
            });
        }

        // Validate required fields
        if (!proposalId) {
            return res.status(400).json({
                status: false,
                message: 'Missing required field: proposalId'
            });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(proposalId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid proposal ID format'
            });
        }

        // Try to find the proposal in all three collections to determine type
        let proposal = null;
        let ProposalSchema = null;
        let proposalType = '';
        let proposalTypeName = '';

        // Check Investment proposals first
        proposal = await InvestorApplicationSchema.findById(proposalId).populate('userId', 'userName email');
        if (proposal) {
            ProposalSchema = InvestorApplicationSchema;
            proposalType = 'investment';
            proposalTypeName = 'Investment Proposal';
        } else {
            // Check Research Investment proposals
            proposal = await ResearchInvestmentApplicationSchema.findById(proposalId).populate('userId', 'userName email');
            if (proposal) {
                ProposalSchema = ResearchInvestmentApplicationSchema;
                proposalType = 'research-investment';
                proposalTypeName = 'Research Investment Proposal';
            } else {
                // Check Research proposals
                proposal = await ResearchProposalApplicationSchema.findById(proposalId).populate('userId', 'userName email');
                if (proposal) {
                    ProposalSchema = ResearchProposalApplicationSchema;
                    proposalType = 'research-proposal';
                    proposalTypeName = 'Research Proposal';
                }
            }
        }

        if (!proposal) {
            return res.status(404).json({
                status: false,
                message: 'Proposal not found in any collection'
            });
        }

        // Delete associated files from S3
        await deleteProposalFilesFromS3(proposal, proposalType);

        // Delete the proposal from database
        const deleteResult = await ProposalSchema.deleteOne({ _id: proposalId });

        if (!deleteResult || deleteResult.deletedCount === 0) {
            return res.status(500).json({
                status: false,
                message: `Failed to delete ${proposalTypeName}`
            });
        }

        return res.status(200).json({
            status: true,
            message: `${proposalTypeName} deleted successfully`,
            deletedProposal: {
                id: proposal._id,
                type: proposalTypeName,
                applicant: proposal.userId?.userName || proposal.userId?.email,
                department: proposal.department
            }
        });

    } catch (error) {
        console.error('[AdminDeleteProposal] Error:', error.message);
        return res.status(500).json({
            status: false,
            message: 'Server error while deleting proposal',
            error: error.message
        });
    }
};

/**
 * Helper function to delete files from S3 bucket based on proposal type
 */
const deleteProposalFilesFromS3 = async (proposal, proposalType) => {
    const filesToDelete = [];

    try {
        // Extract file URLs based on proposal type
        switch (proposalType) {
            case 'research-proposal':
                if (proposal.supportingDocuments && Array.isArray(proposal.supportingDocuments)) {
                    filesToDelete.push(...proposal.supportingDocuments.filter(url => url));
                }
                if (proposal.certifications && Array.isArray(proposal.certifications)) {
                    filesToDelete.push(...proposal.certifications.filter(url => url));
                }
                break;

            case 'investment':
                if (proposal.businessPlan && Array.isArray(proposal.businessPlan)) {
                    filesToDelete.push(...proposal.businessPlan.filter(url => url));
                }
                if (proposal.financialProjections && Array.isArray(proposal.financialProjections)) {
                    filesToDelete.push(...proposal.financialProjections.filter(url => url));
                }
                if (proposal.supportingDocuments && Array.isArray(proposal.supportingDocuments)) {
                    filesToDelete.push(...proposal.supportingDocuments.filter(url => url));
                }
                break;

            case 'research-investment':
                if (proposal.researchProposal && Array.isArray(proposal.researchProposal)) {
                    filesToDelete.push(...proposal.researchProposal.filter(url => url));
                }
                if (proposal.businessPlan && Array.isArray(proposal.businessPlan)) {
                    filesToDelete.push(...proposal.businessPlan.filter(url => url));
                }
                if (proposal.supportingDocuments && Array.isArray(proposal.supportingDocuments)) {
                    filesToDelete.push(...proposal.supportingDocuments.filter(url => url));
                }
                break;
        }

        // Delete each file from S3
        for (const fileUrl of filesToDelete) {
            try {
                const fileName = extractFileNameFromUrl(fileUrl);
                if (fileName) {
                    await deleteFileFromAws(fileName);
                }
            } catch (error) {
                console.error(`[DeleteS3Files] Error deleting file ${fileUrl}:`, error.message);
            }
        }

    } catch (error) {
        console.error('[DeleteS3Files] Error in deleteProposalFilesFromS3:', error.message);
    }
};

module.exports = {
    adminDeleteProposal,
    deleteProposalFilesFromS3
};
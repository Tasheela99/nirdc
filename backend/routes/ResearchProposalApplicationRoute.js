const express = require('express');
const ResearchProposalApplicationController = require('../controllers/ResearchProposalApplicationController');
const ProposalDeleteController = require('../controllers/ProposalDeleteController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');

router.post('/create', authorized(["USER"]), ResearchProposalApplicationController.saveResearchProposal);
router.get('/admin/get-all', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchProposalApplicationController.getAllResearchProposalApplications);
router.get('/get-by-id/:id', authorized(['USER', 'SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'REVIEWER']), ResearchProposalApplicationController.getResearchProposalApplicationById);
router.get('/get-by-user/user', authorized(['USER']), ResearchProposalApplicationController.getResearchProposalApplicationsByUser);
router.get('/count', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchProposalApplicationController.getResearchProposalApplicationCount);
router.put('/update-status/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchProposalApplicationController.updateApplicationStatus);
router.get('/status', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchProposalApplicationController.getApplicationsByStatus);
router.post('/add-comment/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchProposalApplicationController.addComment);
router.get('/comments/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchProposalApplicationController.getComments);

// Admin proposal deletion - Only ADMIN and SUPER_ADMIN
router.delete('/admin/delete-proposal/:id', authorized(['SUPER_ADMIN', 'ADMIN']), ProposalDeleteController.adminDeleteProposal);

module.exports = router;


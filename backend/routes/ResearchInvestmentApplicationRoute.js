const express = require('express');
const ResearchInvestmentApplicationController = require('../controllers/ResearchInvestmentApplicationController');
const ProposalDeleteController = require('../controllers/ProposalDeleteController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');

router.post('/create', authorized(["USER"]), ResearchInvestmentApplicationController.saveResearchApplication);
router.get('/admin/get-all', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchInvestmentApplicationController.getAllResearchApplications);
router.get('/get-by-id/:id', authorized(['USER', 'SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'REVIEWER']), ResearchInvestmentApplicationController.getResearchApplicationById);
router.get('/get-by-user/user', authorized(['USER']), ResearchInvestmentApplicationController.getResearchApplicationsByUser);
router.get('/count', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchInvestmentApplicationController.getResearchInvestmentApplicationsCount);
router.put('/update-status/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchInvestmentApplicationController.updateApplicationStatus);
router.get('/status', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchInvestmentApplicationController.getApplicationsByStatus);
router.post('/add-comment/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchInvestmentApplicationController.addComment);
router.get('/comments/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ResearchInvestmentApplicationController.getComments);

// Admin proposal deletion - Only ADMIN and SUPER_ADMIN
router.delete('/admin/delete-proposal/:id', authorized(['SUPER_ADMIN', 'ADMIN']), ProposalDeleteController.adminDeleteProposal);

module.exports = router;


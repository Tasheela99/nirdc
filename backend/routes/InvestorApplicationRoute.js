const express = require('express');
const InvestorApplicationController = require('../controllers/InvestorApplicationController');
const ProposalDeleteController = require('../controllers/ProposalDeleteController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');

router.post('/create', authorized(["USER"]), InvestorApplicationController.saveInvestorApplication);
router.get('/admin/get-all', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), InvestorApplicationController.getAllInvestorApplications);
router.get('/get-by-id/:id', authorized(['USER', 'SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'REVIEWER']), InvestorApplicationController.getInvestorApplicationById);
router.get('/get-by-user/user', authorized(['USER']), InvestorApplicationController.getInvestorApplicationsByUser);
router.get('/count', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), InvestorApplicationController.getInvestorApplicationsCount);
router.put('/update-status/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), InvestorApplicationController.updateApplicationStatus);
router.get('/status', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), InvestorApplicationController.getApplicationsByStatus);
router.post('/add-comment/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), InvestorApplicationController.addComment);
router.get('/comments/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), InvestorApplicationController.getComments);

// Admin proposal deletion - Only ADMIN and SUPER_ADMIN
router.delete('/admin/delete-proposal/:id', authorized(['SUPER_ADMIN', 'ADMIN']), ProposalDeleteController.adminDeleteProposal);

module.exports = router;


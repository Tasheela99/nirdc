const express = require('express');
const router = express.Router();
const ReviewAssignmentController = require('../controllers/ReviewAssignmentController');
const authorized = require('../middleware/AuthMiddleware');

// Reviewer routes
router.get('/my-assignments', authorized(['REVIEWER']), ReviewAssignmentController.getAssignedProposals);
router.put('/:assignmentId/submit', authorized(['REVIEWER']), ReviewAssignmentController.submitReview);

// Admin routes
router.post('/assign', authorized(['ADMIN', 'SUPER_ADMIN']), ReviewAssignmentController.assignReviewer);
router.get('/proposal/:proposalId', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), ReviewAssignmentController.getReviewsForProposal);
router.delete('/:assignmentId', authorized(['ADMIN', 'SUPER_ADMIN']), ReviewAssignmentController.removeAssignment);

module.exports = router;

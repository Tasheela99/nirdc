const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');


router.post('/sign-up', UserController.signUp);
router.post('/sign-in', UserController.signIn);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);
router.post('/verify-email', UserController.verifyEmailWithOtp);
router.post('/resend-otp', UserController.resendOTP);


router.post('/admin/create-director', authorized(['SUPER_ADMIN', 'ADMIN']), UserController.createDirector);
router.get('/admin/get-all-directors', authorized(['SUPER_ADMIN', 'ADMIN']), UserController.getAllDirectors);


router.put('/admin/update-user/:id', authorized(['SUPER_ADMIN', 'ADMIN']), UserController.updateUser);
router.put('/admin/update-user-role/:id', authorized(['SUPER_ADMIN']), UserController.updateUserRole);
router.get('/admin/get-all-users', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), UserController.getAllUsers);
router.delete('/admin/delete-user', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), UserController.deleteUser);


const ReviewerController = require('../controllers/ReviewerController');

router.get('/user/proposals/:userId', authorized(['USER', 'SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), UserController.getAllUserProposals);
router.post('/user/proposals/:userId/delete', authorized(['USER']), UserController.deleteUserProposal);
router.post('/user/change-password', authorized(['USER', 'ADMIN', 'DIRECTOR', 'SUPER_ADMIN']), UserController.changePassword);

router.post('/register-reviewer', ReviewerController.registerReviewer);
// Reviewer specific routes
router.get('/admin/reviewers/all', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ReviewerController.getAllReviewers);
router.get('/admin/reviewers/pending', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ReviewerController.getPendingReviewers);
router.get('/admin/reviewers/approved', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ReviewerController.getApprovedReviewers);
router.put('/admin/reviewers/:id/approve', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ReviewerController.approveReviewer);
router.put('/admin/reviewers/:id/reject', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ReviewerController.rejectReviewer);


module.exports = router;
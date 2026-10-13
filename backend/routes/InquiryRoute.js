const express = require('express');
const router = express.Router();
const InquiryController = require('../controllers/InquiryController');
const authorized = require('../middleware/AuthMiddleware');

// Public inquiry submission
router.post('/', InquiryController.createInquiry);

// Admin-only management
router.get('/', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), InquiryController.getInquiries);
router.patch('/:id/status', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), InquiryController.updateInquiryStatus);
router.delete('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), InquiryController.deleteInquiry);

module.exports = router;

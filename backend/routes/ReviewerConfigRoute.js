const express = require('express');
const router = express.Router();
const ReviewerConfigController = require('../controllers/ReviewerConfigController');
const authorized = require('../middleware/AuthMiddleware.js');

router.post('/video', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ReviewerConfigController.uploadTrainingVideo);
router.get('/video', ReviewerConfigController.getTrainingVideo);

module.exports = router;

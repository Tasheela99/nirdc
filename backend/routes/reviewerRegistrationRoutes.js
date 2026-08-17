const express = require('express');
const router = express.Router();
const reviewerRegistrationController = require('../controllers/reviewerRegistrationController');

// Route to start a new reviewer registration session
router.post('/start-session', reviewerRegistrationController.startSession);

// Route to get the current state of a registration session
router.get('/:sessionId/state', reviewerRegistrationController.getSessionState);

// Route to mark a specific step as completed for a session
router.post('/:sessionId/complete-step', reviewerRegistrationController.completeStep);

module.exports = router;

const express = require('express');
const router = express.Router();
const McqController = require('../controllers/McqController');
const authorized = require('../middleware/AuthMiddleware.js');

// Admin CRUD routes
router.post('/admin/mcqs', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), McqController.createMcq);
router.get('/admin/mcqs', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), McqController.getAllMcqs);
router.put('/admin/mcqs/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), McqController.updateMcq);
router.delete('/admin/mcqs/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), McqController.deleteMcq);

// Public/User routes
router.get('/mcqs/random', McqController.getRandomMcqs);

module.exports = router;

const express = require('express');
const router = express.Router();
const HeadOfficeOfficerController = require('../controllers/HeadOfficeOfficerController');
const authorized = require('../middleware/AuthMiddleware');

// Public route
router.get('/', HeadOfficeOfficerController.getOfficers);

// Admin-only routes
router.get('/all', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HeadOfficeOfficerController.getAllOfficers);
router.post('/', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HeadOfficeOfficerController.createOfficer);
router.put('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HeadOfficeOfficerController.updateOfficer);
router.delete('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HeadOfficeOfficerController.deleteOfficer);

module.exports = router;

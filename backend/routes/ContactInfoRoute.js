const express = require('express');
const router = express.Router();
const ContactInfoController = require('../controllers/ContactInfoController');
const authorized = require('../middleware/AuthMiddleware');
const cacheMiddleware = require('../middleware/CacheMiddleware');

// Public endpoints
router.get('/', ContactInfoController.getContactInfo);

// Admin-only endpoints
router.get('/all', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ContactInfoController.getAllContactInfos);
router.post('/', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ContactInfoController.createContactInfo);
router.put('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ContactInfoController.updateContactInfo);
router.delete('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), ContactInfoController.deleteContactInfo);

module.exports = router;

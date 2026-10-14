const express = require('express');
const router = express.Router();
const PartnerCardController = require('../controllers/PartnerCardController');
const authorized = require('../middleware/AuthMiddleware');
const cacheMiddleware = require('../middleware/CacheMiddleware');

// Admin-only list endpoints (must precede /:id)
router.get('/admin/all', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), PartnerCardController.getAllPartnerCardsAdmin);
router.get('/all', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), PartnerCardController.getAllPartnerCardsAdmin);

// Public endpoints
router.get('/', cacheMiddleware(60, 'partner_cards'), PartnerCardController.getAllPartnerCards);
router.get('/:id', PartnerCardController.getPartnerCardById);
router.post('/upload-logo', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), PartnerCardController.uploadPartnerLogo);
router.post('/', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), PartnerCardController.createPartnerCard);
router.put('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), PartnerCardController.updatePartnerCard);
router.delete('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), PartnerCardController.deletePartnerCard);

module.exports = router;

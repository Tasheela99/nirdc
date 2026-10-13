const express = require('express');
const router = express.Router();
const HeroSectionController = require('../controllers/HeroSectionController');
const authorized = require('../middleware/AuthMiddleware');
const cacheMiddleware = require('../middleware/CacheMiddleware');

// Public endpoints
router.get('/', cacheMiddleware(300, 'hero'), HeroSectionController.getHeroSection);

// Admin-only endpoints
router.get('/all', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HeroSectionController.getAllHeroSections);
router.post('/upload-image', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HeroSectionController.uploadHeroImage);
router.post('/', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HeroSectionController.createHeroSection);
router.put('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HeroSectionController.updateHeroSection);
router.delete('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HeroSectionController.deleteHeroSection);

module.exports = router;

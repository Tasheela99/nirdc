const express = require('express');
const AdController = require('../controllers/AdController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');

// Public endpoints
router.get('/active', AdController.getActiveAds);
router.get('/popup', AdController.getPopupAd);
router.get('/get-by-id/:id', AdController.getAdById);

// Admin endpoints
router.post('/admin/create', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), AdController.createAd);
router.get('/admin/get-all', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), AdController.getAllAds);
router.put('/admin/update/:id', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), AdController.updateAd);
router.delete('/admin/delete/:id', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), AdController.deleteAd);

module.exports = router;

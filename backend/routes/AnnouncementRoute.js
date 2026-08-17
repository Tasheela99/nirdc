const express = require('express');
const AnnouncementController = require('../controllers/AnnouncementController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');

const cacheMiddleware = require('../middleware/CacheMiddleware');

router.post('/create', AnnouncementController.createAnnouncement);
router.get('/get-all', cacheMiddleware(300, 'announcements'), AnnouncementController.getAllAnnouncements);
router.get('/get-by-id/:id', cacheMiddleware(300, 'announcements'), AnnouncementController.getAnnouncementById);
router.delete('/admin/delete/:id', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), AnnouncementController.deleteAnnouncement);
router.put('/admin/update/:id', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), AnnouncementController.updateAnnouncement);

module.exports = router;
const express = require('express');
const DownloadController = require('../controllers/DownloadController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');
const cacheMiddleware = require('../middleware/CacheMiddleware');

const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR'];

// Public list & category endpoints
router.get('/', cacheMiddleware(300, 'downloads'), DownloadController.getAllDownloads);
router.get('/get-all', cacheMiddleware(300, 'downloads'), DownloadController.getAllDownloads);
router.get('/categories', (req, res) => res.json({ status: true, data: DownloadController.CATEGORY_PRESETS }));

// Admin-only list endpoint (must precede /:id)
router.get('/admin/all', authorized(adminRoles), DownloadController.getAllDownloadsAdmin);
router.get('/all', authorized(adminRoles), DownloadController.getAllDownloadsAdmin);

// Public single & action endpoints
router.patch('/:id/download', DownloadController.incrementDownloadCount);
router.get('/:id', DownloadController.getDownloadById);

// Admin-only mutations
router.post('/', authorized(adminRoles), DownloadController.createDownload);
router.post('/create', authorized(adminRoles), DownloadController.createDownload);
router.put('/:id', authorized(adminRoles), DownloadController.updateDownload);
router.delete('/admin/delete/:id', authorized(adminRoles), DownloadController.deleteDownload);
router.delete('/:id', authorized(adminRoles), DownloadController.deleteDownload);

module.exports = router;

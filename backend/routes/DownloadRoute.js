const express = require('express');
const DownloadController = require('../controllers/DownloadController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');
const cacheMiddleware = require('../middleware/CacheMiddleware');

router.post('/create', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), DownloadController.createDownload);
router.get('/get-all', cacheMiddleware(300, 'downloads'), DownloadController.getAllDownloads);
router.delete('/admin/delete/:id', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), DownloadController.deleteDownload);

module.exports = router;

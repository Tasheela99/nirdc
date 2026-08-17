const express = require('express');
const NewsController = require('../controllers/NewsController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');

const cacheMiddleware = require('../middleware/CacheMiddleware');

router.post('/create', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), NewsController.createNews);
router.get('/get-all', cacheMiddleware(300, 'news'), NewsController.getAllNews);
router.get('/get-by-id/:id', cacheMiddleware(300, 'news'), NewsController.getNewsById);
router.delete('/admin/delete/:id', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), NewsController.deleteNews);
router.put('/admin/update/:id', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), NewsController.updateNews);

module.exports = router;
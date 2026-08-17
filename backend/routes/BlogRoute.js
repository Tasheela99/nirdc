const express = require('express');
const BlogController = require('../controllers/BlogController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');

const cacheMiddleware = require('../middleware/CacheMiddleware');

router.post('/create', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), BlogController.createBlog);
router.get('/get-all', cacheMiddleware(300, 'blogs'), BlogController.getAllBlogs);
router.get('/get-by-id/:id', cacheMiddleware(300, 'blogs'), BlogController.getBlogById);
router.delete('/admin/delete/:id', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), BlogController.deleteBlog);
router.put('/admin/update/:id', authorized(['ADMIN', 'SUPER_ADMIN', 'DIRECTOR']), BlogController.updateBlog);

module.exports = router;
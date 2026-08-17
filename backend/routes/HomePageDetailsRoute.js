const express = require('express');
const HomePageDetailsController = require('../controllers/HomePageDetailsController');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware.js');

const cacheMiddleware = require('../middleware/CacheMiddleware');

// Banner images
router.post('/create', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HomePageDetailsController.createDetails);
router.get('/get-all', cacheMiddleware(300, 'homepage'), HomePageDetailsController.getAllDetails);
router.get('/delete/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HomePageDetailsController.deleteDetails);

// About Us images
router.post('/about-us/upload', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HomePageDetailsController.uploadAboutUsImages);
router.get('/about-us/delete/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), HomePageDetailsController.deleteAboutUsImage);

module.exports = router;

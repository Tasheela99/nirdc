const express = require('express');
const router = express.Router();
const VisionMissionController = require('../controllers/VisionMissionController');
const authorized = require('../middleware/AuthMiddleware');
const cacheMiddleware = require('../middleware/CacheMiddleware');

// Public endpoints
router.get('/', cacheMiddleware(300, 'vision_mission'), VisionMissionController.getVisionMission);

// Admin-only endpoints
router.get('/all', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), VisionMissionController.getAllVisionMissions);
router.post('/', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), VisionMissionController.createVisionMission);
router.put('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), VisionMissionController.updateVisionMission);
router.delete('/:id', authorized(['SUPER_ADMIN', 'ADMIN', 'DIRECTOR']), VisionMissionController.deleteVisionMission);

module.exports = router;

const VisionMission = require('../schemas/VisionMissionSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');

/**
 * Get active/latest vision & mission
 * GET /api/v1/vision-mission
 * Public
 */
const getVisionMission = async (req, res) => {
  try {
    const item = await VisionMission.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!item) {
      return res.status(200).json({
        status: true,
        message: 'No active vision and mission found',
        data: null
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Vision & Mission fetched successfully',
      data: item
    });
  } catch (error) {
    logger.error('Error fetching vision and mission:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch vision and mission',
      error: error.message
    });
  }
};

/**
 * Get all vision & mission records (admin)
 * GET /api/v1/vision-mission/all
 * Admin only
 */
const getAllVisionMissions = async (req, res) => {
  try {
    const items = await VisionMission.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching all vision and mission records:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch vision and mission records',
      error: error.message
    });
  }
};

const normalizeMultiLang = (val) => {
  if (!val) return { en: '', si: '', ta: '' };
  if (typeof val === 'string') return { en: val.trim(), si: '', ta: '' };
  return {
    en: typeof val.en === 'string' ? val.en.trim() : '',
    si: typeof val.si === 'string' ? val.si.trim() : '',
    ta: typeof val.ta === 'string' ? val.ta.trim() : '',
  };
};

const normalizeSection = (sec) => {
  if (!sec || typeof sec !== 'object') sec = {};
  return {
    title: normalizeMultiLang(sec.title),
    highlightText: normalizeMultiLang(sec.highlightText),
    description: normalizeMultiLang(sec.description)
  };
};

/**
 * Create vision & mission
 * POST /api/v1/vision-mission
 * Admin only
 */
const createVisionMission = async (req, res) => {
  try {
    let { vision, mission, isActive } = req.body;

    if (typeof vision === 'string') {
      try { vision = JSON.parse(vision); } catch (_) {}
    }
    if (typeof mission === 'string') {
      try { mission = JSON.parse(mission); } catch (_) {}
    }

    if (!vision || !mission) {
      return res.status(400).json({
        status: false,
        message: 'Both vision and mission objects are required with multi-language values.'
      });
    }

    if (isActive !== false) {
      await VisionMission.updateMany({}, { isActive: false });
    }

    const newItem = new VisionMission({
      vision: normalizeSection(vision),
      mission: normalizeSection(mission),
      isActive: isActive !== undefined ? isActive : true
    });

    await newItem.save();

    await cacheService.clearPattern('vision_mission_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(201).json({
      status: true,
      message: 'Vision & Mission created successfully',
      data: newItem
    });
  } catch (error) {
    logger.error('Error creating vision and mission:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create vision and mission',
      error: error.message
    });
  }
};

/**
 * Update vision & mission by ID
 * PUT /api/v1/vision-mission/:id
 * Admin only
 */
const updateVisionMission = async (req, res) => {
  try {
    const { id } = req.params;
    let { vision, mission, isActive } = req.body;

    const item = await VisionMission.findById(id);
    if (!item) {
      return res.status(404).json({
        status: false,
        message: 'Vision & Mission not found'
      });
    }

    if (typeof vision === 'string') {
      try { vision = JSON.parse(vision); } catch (_) {}
    }
    if (typeof mission === 'string') {
      try { mission = JSON.parse(mission); } catch (_) {}
    }

    if (vision) item.vision = normalizeSection(vision);
    if (mission) item.mission = normalizeSection(mission);
    if (isActive !== undefined) {
      if (isActive === true) {
        await VisionMission.updateMany({ _id: { $ne: id } }, { isActive: false });
      }
      item.isActive = isActive;
    }

    await item.save();

    await cacheService.clearPattern('vision_mission_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(200).json({
      status: true,
      message: 'Vision & Mission updated successfully',
      data: item
    });
  } catch (error) {
    logger.error('Error updating vision and mission:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update vision and mission',
      error: error.message
    });
  }
};

/**
 * Delete vision & mission by ID
 * DELETE /api/v1/vision-mission/:id
 * Admin only
 */
const deleteVisionMission = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await VisionMission.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Vision & Mission not found'
      });
    }

    await cacheService.clearPattern('vision_mission_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(200).json({
      status: true,
      message: 'Vision & Mission deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting vision and mission:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete vision and mission',
      error: error.message
    });
  }
};

module.exports = {
  getVisionMission,
  getAllVisionMissions,
  createVisionMission,
  updateVisionMission,
  deleteVisionMission
};

const AboutNavConfig = require('../schemas/AboutNavConfigSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');

const DEFAULT_VISIBILITY = {
  introduction: true,
  history: true,
  visionMission: true,
  values: true,
  objectives: true,
  responsibilities: true,
  functionsServices: true,
  directorMessage: true,
  team: true,
  organizationalStructure: true,
  downloads: true,
  reportsPublications: true,
  newsletters: true
};

exports.getNavConfig = async (req, res) => {
  try {
    let config = await AboutNavConfig.findOne().sort({ updatedAt: -1 });
    if (!config) {
      config = await AboutNavConfig.create({ visibility: DEFAULT_VISIBILITY });
    }

    return res.status(200).json({
      status: true,
      message: 'Navigation configuration retrieved successfully',
      data: config.visibility
    });
  } catch (error) {
    logger.error('Error fetching about navigation configuration:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch navigation configuration',
      error: error.message
    });
  }
};

exports.updateNavConfig = async (req, res) => {
  try {
    const { visibility } = req.body;
    if (!visibility || typeof visibility !== 'object') {
      return res.status(400).json({
        status: false,
        message: 'Invalid navigation visibility payload'
      });
    }

    let config = await AboutNavConfig.findOne().sort({ updatedAt: -1 });
    if (config) {
      config.visibility = { ...config.visibility.toObject(), ...visibility };
      await config.save();
    } else {
      config = await AboutNavConfig.create({
        visibility: { ...DEFAULT_VISIBILITY, ...visibility }
      });
    }

    // Invalidate cache
    await cacheService.clearPattern('about_nav*');

    return res.status(200).json({
      status: true,
      message: 'Navigation configuration updated successfully',
      data: config.visibility
    });
  } catch (error) {
    logger.error('Error updating about navigation configuration:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update navigation configuration',
      error: error.message
    });
  }
};

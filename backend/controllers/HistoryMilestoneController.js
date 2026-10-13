const HistoryMilestone = require('../schemas/HistoryMilestoneSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

const parseJsonIfNeeded = (val) => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch (_) { return val; }
  }
  return val;
};

// GET /api/v1/about/history
const getAllMilestones = async (req, res) => {
  try {
    const milestones = await HistoryMilestone.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      message: 'Milestones fetched successfully',
      count: milestones.length,
      data: milestones
    });
  } catch (error) {
    logger.error('Error fetching milestones:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch milestones',
      error: error.message
    });
  }
};

// GET /api/v1/about/history/admin/all
const getAllMilestonesAdmin = async (req, res) => {
  try {
    const milestones = await HistoryMilestone.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      count: milestones.length,
      data: milestones
    });
  } catch (error) {
    logger.error('Error fetching admin milestones:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch admin milestones',
      error: error.message
    });
  }
};

// POST /api/v1/about/history
const createMilestone = async (req, res) => {
  try {
    let { year, title, description, icon, order, isActive } = req.body;
    title = parseJsonIfNeeded(title);
    description = parseJsonIfNeeded(description);

    // Process icon file upload if provided
    if (req.files && (req.files.icon || req.files.iconFile || req.files.file)) {
      const file = req.files.icon || req.files.iconFile || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/icon_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      icon = getFileUrlFromAws(fileName);
    }

    if (!year || !title) {
      return res.status(400).json({
        status: false,
        message: 'Year and title are required.'
      });
    }

    if (order === undefined) {
      const count = await HistoryMilestone.countDocuments();
      order = count;
    }

    const milestone = new HistoryMilestone({
      year,
      title,
      description,
      icon: icon || 'History',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await milestone.save();
    await cacheService.clearPattern('about_*');

    return res.status(201).json({
      status: true,
      message: 'Milestone created successfully',
      data: milestone
    });
  } catch (error) {
    logger.error('Error creating milestone:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create milestone',
      error: error.message
    });
  }
};

// PUT /api/v1/about/history/:id
const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    let { year, title, description, icon, order, isActive } = req.body;

    const milestone = await HistoryMilestone.findById(id);
    if (!milestone) {
      return res.status(404).json({
        status: false,
        message: 'Milestone not found'
      });
    }

    if (year !== undefined) milestone.year = year;
    if (title !== undefined) milestone.title = parseJsonIfNeeded(title);
    if (description !== undefined) milestone.description = parseJsonIfNeeded(description);
    if (req.files && (req.files.icon || req.files.iconFile || req.files.file)) {
      const file = req.files.icon || req.files.iconFile || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/icon_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      milestone.icon = getFileUrlFromAws(fileName);
    } else if (icon !== undefined) {
      milestone.icon = icon;
    }
    if (order !== undefined) milestone.order = Number(order);
    if (isActive !== undefined) milestone.isActive = isActive;

    await milestone.save();
    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Milestone updated successfully',
      data: milestone
    });
  } catch (error) {
    logger.error('Error updating milestone:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update milestone',
      error: error.message
    });
  }
};

// DELETE /api/v1/about/history/:id
const deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HistoryMilestone.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Milestone not found'
      });
    }

    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Milestone deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting milestone:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete milestone',
      error: error.message
    });
  }
};

module.exports = {
  getAllMilestones,
  getAllMilestonesAdmin,
  createMilestone,
  updateMilestone,
  deleteMilestone
};

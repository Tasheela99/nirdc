const Objective = require('../schemas/ObjectiveSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

const parseJsonIfNeeded = (val) => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch (_) { return val; }
  }
  return val;
};

// GET /api/v1/about/objectives
const getAllObjectives = async (req, res) => {
  try {
    const objectives = await Objective.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      message: 'Objectives fetched successfully',
      count: objectives.length,
      data: objectives
    });
  } catch (error) {
    logger.error('Error fetching objectives:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch objectives',
      error: error.message
    });
  }
};

// GET /api/v1/about/objectives/admin/all
const getAllObjectivesAdmin = async (req, res) => {
  try {
    const objectives = await Objective.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      count: objectives.length,
      data: objectives
    });
  } catch (error) {
    logger.error('Error fetching admin objectives:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch objectives',
      error: error.message
    });
  }
};

// POST /api/v1/about/objectives
const createObjective = async (req, res) => {
  try {
    let { badge, title, description, icon, order, isActive } = req.body;
    badge = parseJsonIfNeeded(badge);
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

    if (!title || !description) {
      return res.status(400).json({
        status: false,
        message: 'Title and description are required.'
      });
    }

    if (order === undefined) {
      const count = await Objective.countDocuments();
      order = count;
    }

    const objective = new Objective({
      badge,
      title,
      description,
      icon: icon || 'Target',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await objective.save();
    await cacheService.clearPattern('about_*');

    return res.status(201).json({
      status: true,
      message: 'Objective created successfully',
      data: objective
    });
  } catch (error) {
    logger.error('Error creating objective:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create objective',
      error: error.message
    });
  }
};

// PUT /api/v1/about/objectives/:id
const updateObjective = async (req, res) => {
  try {
    const { id } = req.params;
    let { badge, title, description, icon, order, isActive } = req.body;

    const objective = await Objective.findById(id);
    if (!objective) {
      return res.status(404).json({
        status: false,
        message: 'Objective not found'
      });
    }

    if (badge !== undefined) objective.badge = parseJsonIfNeeded(badge);
    if (title !== undefined) objective.title = parseJsonIfNeeded(title);
    if (description !== undefined) objective.description = parseJsonIfNeeded(description);
    if (req.files && (req.files.icon || req.files.iconFile || req.files.file)) {
      const file = req.files.icon || req.files.iconFile || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/icon_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      objective.icon = getFileUrlFromAws(fileName);
    } else if (icon !== undefined) {
      objective.icon = icon;
    }
    if (order !== undefined) objective.order = Number(order);
    if (isActive !== undefined) objective.isActive = isActive;

    await objective.save();
    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Objective updated successfully',
      data: objective
    });
  } catch (error) {
    logger.error('Error updating objective:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update objective',
      error: error.message
    });
  }
};

// DELETE /api/v1/about/objectives/:id
const deleteObjective = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Objective.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Objective not found'
      });
    }

    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Objective deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting objective:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete objective',
      error: error.message
    });
  }
};

module.exports = {
  getAllObjectives,
  getAllObjectivesAdmin,
  createObjective,
  updateObjective,
  deleteObjective
};

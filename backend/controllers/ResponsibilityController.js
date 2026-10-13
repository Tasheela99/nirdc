const Responsibility = require('../schemas/ResponsibilitySchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

const parseJsonIfNeeded = (val) => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch (_) { return val; }
  }
  return val;
};

// GET /api/v1/about/responsibilities
const getAllResponsibilities = async (req, res) => {
  try {
    const items = await Responsibility.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      message: 'Responsibilities fetched successfully',
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching responsibilities:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch responsibilities',
      error: error.message
    });
  }
};

// GET /api/v1/about/responsibilities/admin/all
const getAllResponsibilitiesAdmin = async (req, res) => {
  try {
    const items = await Responsibility.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching admin responsibilities:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch responsibilities',
      error: error.message
    });
  }
};

// POST /api/v1/about/responsibilities
const createResponsibility = async (req, res) => {
  try {
    let { section, title, points, icon, order, isActive } = req.body;
    section = parseJsonIfNeeded(section);
    title = parseJsonIfNeeded(title);
    points = parseJsonIfNeeded(points);

    // Process icon file upload if provided
    if (req.files && (req.files.icon || req.files.iconFile || req.files.file)) {
      const file = req.files.icon || req.files.iconFile || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/icon_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      icon = getFileUrlFromAws(fileName);
    }

    if (!title) {
      return res.status(400).json({
        status: false,
        message: 'Title is required.'
      });
    }

    if (order === undefined) {
      const count = await Responsibility.countDocuments();
      order = count;
    }

    const item = new Responsibility({
      section,
      title,
      points: Array.isArray(points) ? points : [],
      icon: icon || 'ShieldCheck',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await item.save();
    await cacheService.clearPattern('about_*');

    return res.status(201).json({
      status: true,
      message: 'Responsibility created successfully',
      data: item
    });
  } catch (error) {
    logger.error('Error creating responsibility:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create responsibility',
      error: error.message
    });
  }
};

// PUT /api/v1/about/responsibilities/:id
const updateResponsibility = async (req, res) => {
  try {
    const { id } = req.params;
    let { section, title, points, icon, order, isActive } = req.body;

    const item = await Responsibility.findById(id);
    if (!item) {
      return res.status(404).json({
        status: false,
        message: 'Responsibility not found'
      });
    }

    if (section !== undefined) item.section = parseJsonIfNeeded(section);
    if (title !== undefined) item.title = parseJsonIfNeeded(title);
    if (points !== undefined) item.points = parseJsonIfNeeded(points);
    if (req.files && (req.files.icon || req.files.iconFile || req.files.file)) {
      const file = req.files.icon || req.files.iconFile || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/icon_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      item.icon = getFileUrlFromAws(fileName);
    } else if (icon !== undefined) {
      item.icon = icon;
    }
    if (order !== undefined) item.order = Number(order);
    if (isActive !== undefined) item.isActive = isActive;

    await item.save();
    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Responsibility updated successfully',
      data: item
    });
  } catch (error) {
    logger.error('Error updating responsibility:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update responsibility',
      error: error.message
    });
  }
};

// DELETE /api/v1/about/responsibilities/:id
const deleteResponsibility = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Responsibility.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Responsibility not found'
      });
    }

    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Responsibility deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting responsibility:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete responsibility',
      error: error.message
    });
  }
};

module.exports = {
  getAllResponsibilities,
  getAllResponsibilitiesAdmin,
  createResponsibility,
  updateResponsibility,
  deleteResponsibility
};

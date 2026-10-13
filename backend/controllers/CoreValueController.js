const CoreValue = require('../schemas/CoreValueSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

const parseJsonIfNeeded = (val) => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch (_) { return val; }
  }
  return val;
};

// GET /api/v1/about/values
const getAllCoreValues = async (req, res) => {
  try {
    const values = await CoreValue.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      message: 'Core values fetched successfully',
      count: values.length,
      data: values
    });
  } catch (error) {
    logger.error('Error fetching core values:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch core values',
      error: error.message
    });
  }
};

// GET /api/v1/about/values/admin/all
const getAllCoreValuesAdmin = async (req, res) => {
  try {
    const values = await CoreValue.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      count: values.length,
      data: values
    });
  } catch (error) {
    logger.error('Error fetching admin core values:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch core values',
      error: error.message
    });
  }
};

// POST /api/v1/about/values
const createCoreValue = async (req, res) => {
  try {
    let { title, description, icon, order, isActive } = req.body;
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
      const count = await CoreValue.countDocuments();
      order = count;
    }

    const value = new CoreValue({
      title,
      description,
      icon: icon || 'Sparkles',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await value.save();
    await cacheService.clearPattern('about_*');

    return res.status(201).json({
      status: true,
      message: 'Core value created successfully',
      data: value
    });
  } catch (error) {
    logger.error('Error creating core value:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create core value',
      error: error.message
    });
  }
};

// PUT /api/v1/about/values/:id
const updateCoreValue = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, icon, order, isActive } = req.body;

    const value = await CoreValue.findById(id);
    if (!value) {
      return res.status(404).json({
        status: false,
        message: 'Core value not found'
      });
    }

    if (title !== undefined) value.title = parseJsonIfNeeded(title);
    if (description !== undefined) value.description = parseJsonIfNeeded(description);
    if (req.files && (req.files.icon || req.files.iconFile || req.files.file)) {
      const file = req.files.icon || req.files.iconFile || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/icon_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      value.icon = getFileUrlFromAws(fileName);
    } else if (icon !== undefined) {
      value.icon = icon;
    }
    if (order !== undefined) value.order = Number(order);
    if (isActive !== undefined) value.isActive = isActive;

    await value.save();
    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Core value updated successfully',
      data: value
    });
  } catch (error) {
    logger.error('Error updating core value:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update core value',
      error: error.message
    });
  }
};

// DELETE /api/v1/about/values/:id
const deleteCoreValue = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CoreValue.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Core value not found'
      });
    }

    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Core value deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting core value:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete core value',
      error: error.message
    });
  }
};

module.exports = {
  getAllCoreValues,
  getAllCoreValuesAdmin,
  createCoreValue,
  updateCoreValue,
  deleteCoreValue
};

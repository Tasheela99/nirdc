const FunctionService = require('../schemas/FunctionServiceSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

const parseJsonIfNeeded = (val) => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch (_) { return val; }
  }
  return val;
};

// GET /api/v1/about/functions-services
const getAllFunctionServices = async (req, res) => {
  try {
    const items = await FunctionService.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      message: 'Functions & Services fetched successfully',
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching functions & services:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch functions & services',
      error: error.message
    });
  }
};

// GET /api/v1/about/functions-services/admin/all
const getAllFunctionServicesAdmin = async (req, res) => {
  try {
    const items = await FunctionService.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching admin functions & services:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch functions & services',
      error: error.message
    });
  }
};

// POST /api/v1/about/functions-services
const createFunctionService = async (req, res) => {
  try {
    let { category, description, offerings, icon, actionLink, actionText, order, isActive } = req.body;
    category = parseJsonIfNeeded(category);
    description = parseJsonIfNeeded(description);
    offerings = parseJsonIfNeeded(offerings);
    actionText = parseJsonIfNeeded(actionText);

    // Process icon file upload if provided
    if (req.files && (req.files.icon || req.files.iconFile || req.files.file)) {
      const file = req.files.icon || req.files.iconFile || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/icon_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      icon = getFileUrlFromAws(fileName);
    }

    if (!category || !description) {
      return res.status(400).json({
        status: false,
        message: 'Category and description are required.'
      });
    }

    if (order === undefined) {
      const count = await FunctionService.countDocuments();
      order = count;
    }

    const item = new FunctionService({
      category,
      description,
      offerings: Array.isArray(offerings) ? offerings : [],
      icon: icon || 'Lightbulb',
      actionLink: actionLink || '',
      actionText,
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await item.save();
    await cacheService.clearPattern('about_*');

    return res.status(201).json({
      status: true,
      message: 'Function & Service created successfully',
      data: item
    });
  } catch (error) {
    logger.error('Error creating function & service:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create function & service',
      error: error.message
    });
  }
};

// PUT /api/v1/about/functions-services/:id
const updateFunctionService = async (req, res) => {
  try {
    const { id } = req.params;
    let { category, description, offerings, icon, actionLink, actionText, order, isActive } = req.body;

    const item = await FunctionService.findById(id);
    if (!item) {
      return res.status(404).json({
        status: false,
        message: 'Function & Service not found'
      });
    }

    if (category !== undefined) item.category = parseJsonIfNeeded(category);
    if (description !== undefined) item.description = parseJsonIfNeeded(description);
    if (offerings !== undefined) item.offerings = parseJsonIfNeeded(offerings);
    if (req.files && (req.files.icon || req.files.iconFile || req.files.file)) {
      const file = req.files.icon || req.files.iconFile || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/icon_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      item.icon = getFileUrlFromAws(fileName);
    } else if (icon !== undefined) {
      item.icon = icon;
    }
    if (actionLink !== undefined) item.actionLink = actionLink;
    if (actionText !== undefined) item.actionText = parseJsonIfNeeded(actionText);
    if (order !== undefined) item.order = Number(order);
    if (isActive !== undefined) item.isActive = isActive;

    await item.save();
    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Function & Service updated successfully',
      data: item
    });
  } catch (error) {
    logger.error('Error updating function & service:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update function & service',
      error: error.message
    });
  }
};

// DELETE /api/v1/about/functions-services/:id
const deleteFunctionService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FunctionService.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Function & Service not found'
      });
    }

    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Function & Service deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting function & service:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete function & service',
      error: error.message
    });
  }
};

module.exports = {
  getAllFunctionServices,
  getAllFunctionServicesAdmin,
  createFunctionService,
  updateFunctionService,
  deleteFunctionService
};

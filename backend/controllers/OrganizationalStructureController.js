const OrganizationalStructure = require('../schemas/OrganizationalStructureSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

const parseJsonIfNeeded = (val) => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch (_) { return val; }
  }
  return val;
};

// GET /api/v1/about/organizational-structure
const getAllDivisions = async (req, res) => {
  try {
    const items = await OrganizationalStructure.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      message: 'Organizational divisions fetched successfully',
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching organizational divisions:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch organizational divisions',
      error: error.message
    });
  }
};

// GET /api/v1/about/organizational-structure/admin/all
const getAllDivisionsAdmin = async (req, res) => {
  try {
    const items = await OrganizationalStructure.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching admin organizational divisions:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch organizational divisions',
      error: error.message
    });
  }
};

// POST /api/v1/about/organizational-structure
const createDivision = async (req, res) => {
  try {
    let { title, focus, subUnits, icon, order, isActive } = req.body;
    title = parseJsonIfNeeded(title);
    focus = parseJsonIfNeeded(focus);
    subUnits = parseJsonIfNeeded(subUnits);

    // Process icon file upload if provided
    if (req.files && (req.files.icon || req.files.iconFile || req.files.file)) {
      const file = req.files.icon || req.files.iconFile || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/icon_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      icon = getFileUrlFromAws(fileName);
    }

    if (!title || !focus) {
      return res.status(400).json({
        status: false,
        message: 'Title and focus are required.'
      });
    }

    if (order === undefined) {
      const count = await OrganizationalStructure.countDocuments();
      order = count;
    }

    const division = new OrganizationalStructure({
      title,
      focus,
      subUnits: Array.isArray(subUnits) ? subUnits : [],
      icon: icon || 'Building',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await division.save();
    await cacheService.clearPattern('about_*');

    return res.status(201).json({
      status: true,
      message: 'Organizational division created successfully',
      data: division
    });
  } catch (error) {
    logger.error('Error creating organizational division:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create organizational division',
      error: error.message
    });
  }
};

// PUT /api/v1/about/organizational-structure/:id
const updateDivision = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, focus, subUnits, icon, order, isActive } = req.body;

    const division = await OrganizationalStructure.findById(id);
    if (!division) {
      return res.status(404).json({
        status: false,
        message: 'Organizational division not found'
      });
    }

    if (title !== undefined) division.title = parseJsonIfNeeded(title);
    if (focus !== undefined) division.focus = parseJsonIfNeeded(focus);
    if (subUnits !== undefined) division.subUnits = parseJsonIfNeeded(subUnits);
    if (req.files && (req.files.icon || req.files.iconFile || req.files.file)) {
      const file = req.files.icon || req.files.iconFile || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/icon_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      division.icon = getFileUrlFromAws(fileName);
    } else if (icon !== undefined) {
      division.icon = icon;
    }
    if (order !== undefined) division.order = Number(order);
    if (isActive !== undefined) division.isActive = isActive;

    await division.save();
    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Organizational division updated successfully',
      data: division
    });
  } catch (error) {
    logger.error('Error updating organizational division:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update organizational division',
      error: error.message
    });
  }
};

// DELETE /api/v1/about/organizational-structure/:id
const deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OrganizationalStructure.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Organizational division not found'
      });
    }

    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Organizational division deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting organizational division:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete organizational division',
      error: error.message
    });
  }
};

module.exports = {
  getAllDivisions,
  getAllDivisionsAdmin,
  createDivision,
  updateDivision,
  deleteDivision
};

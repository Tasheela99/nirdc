const Introduction = require('../schemas/IntroductionSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

const parseJsonIfNeeded = (val) => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch (_) { return val; }
  }
  return val;
};

/**
 * Get active/singleton Introduction
 * GET /api/v1/about/introduction
 * Public
 */
const getIntroduction = async (req, res) => {
  try {
    const item = await Introduction.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();
    if (!item) {
      return res.status(200).json({
        status: true,
        message: 'No active introduction found',
        data: null
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Introduction fetched successfully',
      data: item
    });
  } catch (error) {
    logger.error('Error fetching introduction:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch introduction',
      error: error.message
    });
  }
};

/**
 * Save Introduction (Singleton enforcement: Create first or Update existing)
 * POST /api/v1/about/introduction
 * Admin only
 */
const saveIntroduction = async (req, res) => {
  try {
    let {
      badge,
      title,
      subtitle,
      overviewTitle,
      overviewHeading,
      paragraphs,
      image,
      imageCaption,
      isActive
    } = req.body;

    badge = parseJsonIfNeeded(badge);
    title = parseJsonIfNeeded(title);
    subtitle = parseJsonIfNeeded(subtitle);
    overviewTitle = parseJsonIfNeeded(overviewTitle);
    overviewHeading = parseJsonIfNeeded(overviewHeading);
    paragraphs = parseJsonIfNeeded(paragraphs);
    imageCaption = parseJsonIfNeeded(imageCaption);

    // Process file upload if provided
    if (req.files && (req.files.image || req.files.file)) {
      const file = req.files.image || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/intro_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      image = getFileUrlFromAws(fileName);
    }

    if (!title || (!title.en && typeof title !== 'string')) {
      return res.status(400).json({
        status: false,
        message: 'Introduction title is required.'
      });
    }

    // Singleton check: Find existing record if any
    let item = await Introduction.findOne();

    if (item) {
      // Update existing singleton record
      if (badge !== undefined) item.badge = badge;
      if (title !== undefined) item.title = title;
      if (subtitle !== undefined) item.subtitle = subtitle;
      if (overviewTitle !== undefined) item.overviewTitle = overviewTitle;
      if (overviewHeading !== undefined) item.overviewHeading = overviewHeading;
      if (paragraphs !== undefined) item.paragraphs = paragraphs;
      if (image !== undefined) item.image = image;
      if (imageCaption !== undefined) item.imageCaption = imageCaption;
      if (isActive !== undefined) item.isActive = isActive;

      await item.save();

      await cacheService.clearPattern('about_*');

      return res.status(200).json({
        status: true,
        message: 'Introduction updated successfully (Singleton record updated)',
        data: item
      });
    }

    // If none exists, create the single record
    const newItem = new Introduction({
      badge,
      title,
      subtitle,
      overviewTitle,
      overviewHeading,
      paragraphs: Array.isArray(paragraphs) ? paragraphs : [],
      image: image || null,
      imageCaption,
      isActive: isActive !== undefined ? isActive : true
    });

    await newItem.save();

    await cacheService.clearPattern('about_*');

    return res.status(201).json({
      status: true,
      message: 'Introduction created successfully',
      data: newItem
    });
  } catch (error) {
    logger.error('Error saving introduction:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to save introduction',
      error: error.message
    });
  }
};

/**
 * Update Introduction by ID
 * PUT /api/v1/about/introduction/:id
 * Admin only
 */
const updateIntroduction = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      badge,
      title,
      subtitle,
      overviewTitle,
      overviewHeading,
      paragraphs,
      image,
      imageCaption,
      isActive
    } = req.body;

    const item = await Introduction.findById(id);
    if (!item) {
      return res.status(404).json({
        status: false,
        message: 'Introduction record not found'
      });
    }

    if (badge !== undefined) item.badge = parseJsonIfNeeded(badge);
    if (title !== undefined) item.title = parseJsonIfNeeded(title);
    if (subtitle !== undefined) item.subtitle = parseJsonIfNeeded(subtitle);
    if (overviewTitle !== undefined) item.overviewTitle = parseJsonIfNeeded(overviewTitle);
    if (overviewHeading !== undefined) item.overviewHeading = parseJsonIfNeeded(overviewHeading);
    if (paragraphs !== undefined) item.paragraphs = parseJsonIfNeeded(paragraphs);
    if (req.files && (req.files.image || req.files.file)) {
      const file = req.files.image || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/intro_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      item.image = getFileUrlFromAws(fileName);
    } else if (image !== undefined) {
      item.image = image;
    }
    if (imageCaption !== undefined) item.imageCaption = parseJsonIfNeeded(imageCaption);
    if (isActive !== undefined) item.isActive = isActive;

    await item.save();

    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Introduction updated successfully',
      data: item
    });
  } catch (error) {
    logger.error('Error updating introduction:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update introduction',
      error: error.message
    });
  }
};

module.exports = {
  getIntroduction,
  saveIntroduction,
  updateIntroduction
};

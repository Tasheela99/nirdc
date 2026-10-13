const DirectorMessage = require('../schemas/DirectorMessageSchema');
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
 * Get Director Message
 * GET /api/v1/about/director-message
 * Public
 */
const getDirectorMessage = async (req, res) => {
  try {
    const item = await DirectorMessage.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();
    if (!item) {
      return res.status(200).json({
        status: true,
        message: 'No director message found',
        data: null
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Director message fetched successfully',
      data: item
    });
  } catch (error) {
    logger.error('Error fetching director message:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch director message',
      error: error.message
    });
  }
};

/**
 * Save Director Message (Singleton enforcement: Create first or Update existing)
 * POST /api/v1/about/director-message
 * Admin only
 */
const saveDirectorMessage = async (req, res) => {
  try {
    let {
      badge,
      quote,
      directorName,
      directorRole,
      directorImage,
      credentials,
      messageTitle,
      paragraphs,
      signoffName,
      signoffRole,
      isActive
    } = req.body;

    badge = parseJsonIfNeeded(badge);
    quote = parseJsonIfNeeded(quote);
    directorName = parseJsonIfNeeded(directorName);
    directorRole = parseJsonIfNeeded(directorRole);
    credentials = parseJsonIfNeeded(credentials);
    messageTitle = parseJsonIfNeeded(messageTitle);
    paragraphs = parseJsonIfNeeded(paragraphs);
    signoffName = parseJsonIfNeeded(signoffName);
    signoffRole = parseJsonIfNeeded(signoffRole);

    // Process file upload if provided
    if (req.files && (req.files.directorImage || req.files.image || req.files.file)) {
      const file = req.files.directorImage || req.files.image || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/director_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      directorImage = getFileUrlFromAws(fileName);
    }

    if (!quote || (!quote.en && typeof quote !== 'string')) {
      return res.status(400).json({
        status: false,
        message: 'Quote is required.'
      });
    }

    // Singleton check: Find existing record if any
    let item = await DirectorMessage.findOne();

    if (item) {
      // Update existing singleton record
      if (badge !== undefined) item.badge = badge;
      if (quote !== undefined) item.quote = quote;
      if (directorName !== undefined) item.directorName = directorName;
      if (directorRole !== undefined) item.directorRole = directorRole;
      if (directorImage !== undefined) item.directorImage = directorImage;
      if (credentials !== undefined) item.credentials = credentials;
      if (messageTitle !== undefined) item.messageTitle = messageTitle;
      if (paragraphs !== undefined) item.paragraphs = paragraphs;
      if (signoffName !== undefined) item.signoffName = signoffName;
      if (signoffRole !== undefined) item.signoffRole = signoffRole;
      if (isActive !== undefined) item.isActive = isActive;

      await item.save();

      await cacheService.clearPattern('about_*');

      return res.status(200).json({
        status: true,
        message: 'Director message updated successfully (Singleton record updated)',
        data: item
      });
    }

    const newItem = new DirectorMessage({
      badge,
      quote,
      directorName,
      directorRole,
      directorImage: directorImage || null,
      credentials: Array.isArray(credentials) ? credentials : [],
      messageTitle,
      paragraphs: Array.isArray(paragraphs) ? paragraphs : [],
      signoffName,
      signoffRole,
      isActive: isActive !== undefined ? isActive : true
    });

    await newItem.save();

    await cacheService.clearPattern('about_*');

    return res.status(201).json({
      status: true,
      message: 'Director message created successfully',
      data: newItem
    });
  } catch (error) {
    logger.error('Error saving director message:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to save director message',
      error: error.message
    });
  }
};

/**
 * Update Director Message by ID
 * PUT /api/v1/about/director-message/:id
 * Admin only
 */
const updateDirectorMessage = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      badge,
      quote,
      directorName,
      directorRole,
      directorImage,
      credentials,
      messageTitle,
      paragraphs,
      signoffName,
      signoffRole,
      isActive
    } = req.body;

    const item = await DirectorMessage.findById(id);
    if (!item) {
      return res.status(404).json({
        status: false,
        message: 'Director message record not found'
      });
    }

    if (badge !== undefined) item.badge = parseJsonIfNeeded(badge);
    if (quote !== undefined) item.quote = parseJsonIfNeeded(quote);
    if (directorName !== undefined) item.directorName = parseJsonIfNeeded(directorName);
    if (directorRole !== undefined) item.directorRole = parseJsonIfNeeded(directorRole);
    if (req.files && (req.files.directorImage || req.files.image || req.files.file)) {
      const file = req.files.directorImage || req.files.image || req.files.file;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/director_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      item.directorImage = getFileUrlFromAws(fileName);
    } else if (directorImage !== undefined) {
      item.directorImage = directorImage;
    }
    if (credentials !== undefined) item.credentials = parseJsonIfNeeded(credentials);
    if (messageTitle !== undefined) item.messageTitle = parseJsonIfNeeded(messageTitle);
    if (paragraphs !== undefined) item.paragraphs = parseJsonIfNeeded(paragraphs);
    if (signoffName !== undefined) item.signoffName = parseJsonIfNeeded(signoffName);
    if (signoffRole !== undefined) item.signoffRole = parseJsonIfNeeded(signoffRole);
    if (isActive !== undefined) item.isActive = isActive;

    await item.save();

    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Director message updated successfully',
      data: item
    });
  } catch (error) {
    logger.error('Error updating director message:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update director message',
      error: error.message
    });
  }
};

module.exports = {
  getDirectorMessage,
  saveDirectorMessage,
  updateDirectorMessage
};

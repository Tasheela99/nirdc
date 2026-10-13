const HeroSection = require('../schemas/HeroSectionSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

/**
 * Get active/latest hero section
 * GET /api/v1/hero-section
 * Public
 */
const getHeroSection = async (req, res) => {
  try {
    const hero = await HeroSection.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!hero) {
      return res.status(200).json({
        status: true,
        message: 'No active hero section found',
        data: null
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Hero section fetched successfully',
      data: hero
    });
  } catch (error) {
    logger.error('Error fetching hero section:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch hero section',
      error: error.message
    });
  }
};

/**
 * Get all hero sections (for admin management)
 * GET /api/v1/hero-section/all
 * Admin only
 */
const getAllHeroSections = async (req, res) => {
  try {
    const heroes = await HeroSection.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    logger.error('Error fetching all hero sections:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch hero sections',
      error: error.message
    });
  }
};

/**
 * Create hero section
 * POST /api/v1/hero-section
 * Admin only
 */
const createHeroSection = async (req, res) => {
  try {
    let { preTitle, mainTitle, description, images, buttons, isActive } = req.body;

    // Support parsed JSON if sent via form-data
    if (typeof preTitle === 'string') {
      try { preTitle = JSON.parse(preTitle); } catch (_) {}
    }
    if (typeof mainTitle === 'string') {
      try { mainTitle = JSON.parse(mainTitle); } catch (_) {}
    }
    if (typeof description === 'string') {
      try { description = JSON.parse(description); } catch (_) {}
    }
    if (typeof buttons === 'string') {
      try { buttons = JSON.parse(buttons); } catch (_) {}
    }
    if (typeof images === 'string') {
      try { images = JSON.parse(images); } catch (_) { images = [images]; }
    }

    let finalImages = Array.isArray(images) ? [...images] : [];

    // Process image uploads if files provided
    if (req.files && req.files.images) {
      const fileList = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const file of fileList) {
        try {
          const folder = awsFolderNames.resource || 'homepage';
          const fileName = `${folder}/hero_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
          await uploadFileToAws(fileName, file.tempFilePath);
          finalImages.push(getFileUrlFromAws(fileName));
        } catch (uploadErr) {
          logger.warn('Hero image upload to AWS failed:', { error: uploadErr.message });
        }
      }
    }

    if (!finalImages || finalImages.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'At least one image URL or file is required for Hero Section.'
      });
    }

    // If new section is set to active, optionally deactivate previous active sections
    if (isActive !== false) {
      await HeroSection.updateMany({}, { isActive: false });
    }

    const newHero = new HeroSection({
      preTitle,
      mainTitle,
      description,
      images: finalImages,
      buttons: Array.isArray(buttons) ? buttons : [],
      isActive: isActive !== undefined ? isActive : true
    });

    await newHero.save();

    // Invalidate relevant caches
    await cacheService.clearPattern('hero_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(201).json({
      status: true,
      message: 'Hero section created successfully',
      data: newHero
    });
  } catch (error) {
    logger.error('Error creating hero section:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create hero section',
      error: error.message
    });
  }
};

/**
 * Update hero section by ID
 * PUT /api/v1/hero-section/:id
 * Admin only
 */
const updateHeroSection = async (req, res) => {
  try {
    const { id } = req.params;
    let { preTitle, mainTitle, description, images, buttons, isActive } = req.body;

    const hero = await HeroSection.findById(id);
    if (!hero) {
      return res.status(404).json({
        status: false,
        message: 'Hero section not found'
      });
    }

    if (typeof preTitle === 'string') {
      try { preTitle = JSON.parse(preTitle); } catch (_) {}
    }
    if (typeof mainTitle === 'string') {
      try { mainTitle = JSON.parse(mainTitle); } catch (_) {}
    }
    if (typeof description === 'string') {
      try { description = JSON.parse(description); } catch (_) {}
    }
    if (typeof buttons === 'string') {
      try { buttons = JSON.parse(buttons); } catch (_) {}
    }
    if (typeof images === 'string') {
      try { images = JSON.parse(images); } catch (_) { images = [images]; }
    }

    if (preTitle) hero.preTitle = preTitle;
    if (mainTitle) hero.mainTitle = mainTitle;
    if (description) hero.description = description;
    if (buttons !== undefined) hero.buttons = Array.isArray(buttons) ? buttons : [];
    if (isActive !== undefined) {
      if (isActive === true) {
        await HeroSection.updateMany({ _id: { $ne: id } }, { isActive: false });
      }
      hero.isActive = isActive;
    }

    // Process new image uploads if files provided
    let finalImages = Array.isArray(images) ? [...images] : [...hero.images];
    if (req.files && req.files.images) {
      const fileList = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const file of fileList) {
        try {
          const folder = awsFolderNames.resource || 'homepage';
          const fileName = `${folder}/hero_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
          await uploadFileToAws(fileName, file.tempFilePath);
          finalImages.push(getFileUrlFromAws(fileName));
        } catch (uploadErr) {
          logger.warn('Hero image upload to AWS failed:', { error: uploadErr.message });
        }
      }
    }
    if (finalImages.length > 0) {
      hero.images = finalImages;
    }

    await hero.save();

    await cacheService.clearPattern('hero_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(200).json({
      status: true,
      message: 'Hero section updated successfully',
      data: hero
    });
  } catch (error) {
    logger.error('Error updating hero section:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update hero section',
      error: error.message
    });
  }
};

/**
 * Delete hero section by ID
 * DELETE /api/v1/hero-section/:id
 * Admin only
 */
const deleteHeroSection = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HeroSection.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Hero section not found'
      });
    }

    await cacheService.clearPattern('hero_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(200).json({
      status: true,
      message: 'Hero section deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting hero section:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete hero section',
      error: error.message
    });
  }
};

/**
 * Upload image to AWS S3 for Hero Section
 * POST /api/v1/hero-section/upload-image
 * Admin only
 */
const uploadHeroImage = async (req, res) => {
  try {
    if (!req.files || (!req.files.image && !req.files.file && !req.files.images)) {
      return res.status(400).json({
        status: false,
        message: 'No image file was provided for upload.'
      });
    }

    const file = req.files.image || req.files.file || (Array.isArray(req.files.images) ? req.files.images[0] : req.files.images);
    const folder = awsFolderNames.resource || 'homepage';
    const fileName = `${folder}/hero_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    await uploadFileToAws(fileName, file.tempFilePath);
    const url = getFileUrlFromAws(fileName);

    return res.status(200).json({
      status: true,
      message: 'Image uploaded successfully to AWS S3',
      url
    });
  } catch (error) {
    logger.error('Error uploading hero image to AWS:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to upload image to AWS: ' + error.message,
      error: error.message
    });
  }
};

module.exports = {
  getHeroSection,
  getAllHeroSections,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
  uploadHeroImage
};

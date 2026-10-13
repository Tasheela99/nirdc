const PartnerCard = require('../schemas/PartnerCardSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

/**
 * Get all active partner cards
 * GET /api/v1/partner-cards
 * Public
 */
const getAllPartnerCards = async (req, res) => {
  try {
    const cards = await PartnerCard.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      message: 'Partner cards fetched successfully',
      count: cards.length,
      data: cards
    });
  } catch (error) {
    logger.error('Error fetching partner cards:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch partner cards',
      error: error.message
    });
  }
};

/**
 * Get all partner cards including inactive (admin)
 * GET /api/v1/partner-cards/admin/all
 * Admin only
 */
const getAllPartnerCardsAdmin = async (req, res) => {
  try {
    const cards = await PartnerCard.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      count: cards.length,
      data: cards
    });
  } catch (error) {
    logger.error('Error fetching admin partner cards:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch partner cards',
      error: error.message
    });
  }
};

/**
 * Get partner card by ID
 * GET /api/v1/partner-cards/:id
 * Public
 */
const getPartnerCardById = async (req, res) => {
  try {
    const card = await PartnerCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({
        status: false,
        message: 'Partner card not found'
      });
    }

    return res.status(200).json({
      status: true,
      data: card
    });
  } catch (error) {
    logger.error('Error fetching partner card by ID:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch partner card',
      error: error.message
    });
  }
};

/**
 * Create partner card
 * POST /api/v1/partner-cards
 * Admin only
 */
const createPartnerCard = async (req, res) => {
  try {
    let { title, description, logoUrl, linkUrl, order, isActive } = req.body;

    if (typeof title === 'string') {
      try { title = JSON.parse(title); } catch (_) {}
    }
    if (typeof description === 'string') {
      try { description = JSON.parse(description); } catch (_) {}
    }

    // Process logo upload if file provided
    if (req.files && (req.files.logo || req.files.logoUrl)) {
      const file = req.files.logo || req.files.logoUrl;
      try {
        const folder = awsFolderNames.resource || 'homepage';
        const fileName = `${folder}/partner_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        await uploadFileToAws(fileName, file.tempFilePath);
        logoUrl = getFileUrlFromAws(fileName);
      } catch (uploadErr) {
        logger.warn('Partner logo upload to AWS failed:', { error: uploadErr.message });
      }
    }

    if (!logoUrl) {
      return res.status(400).json({
        status: false,
        message: 'Logo URL or image file is required for partner card.'
      });
    }

    const newCard = new PartnerCard({
      title,
      description,
      logoUrl,
      linkUrl: linkUrl || '',
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await newCard.save();

    await cacheService.clearPattern('partner_cards_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(201).json({
      status: true,
      message: 'Partner card created successfully',
      data: newCard
    });
  } catch (error) {
    logger.error('Error creating partner card:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create partner card',
      error: error.message
    });
  }
};

/**
 * Update partner card by ID
 * PUT /api/v1/partner-cards/:id
 * Admin only
 */
const updatePartnerCard = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, logoUrl, linkUrl, order, isActive } = req.body;

    const card = await PartnerCard.findById(id);
    if (!card) {
      return res.status(404).json({
        status: false,
        message: 'Partner card not found'
      });
    }

    if (typeof title === 'string') {
      try { title = JSON.parse(title); } catch (_) {}
    }
    if (typeof description === 'string') {
      try { description = JSON.parse(description); } catch (_) {}
    }

    // Process new logo upload if file provided
    if (req.files && (req.files.logo || req.files.logoUrl)) {
      const file = req.files.logo || req.files.logoUrl;
      try {
        const folder = awsFolderNames.resource || 'homepage';
        const fileName = `${folder}/partner_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        await uploadFileToAws(fileName, file.tempFilePath);
        logoUrl = getFileUrlFromAws(fileName);
      } catch (uploadErr) {
        logger.warn('Partner logo upload to AWS failed:', { error: uploadErr.message });
      }
    }

    if (title) card.title = title;
    if (description) card.description = description;
    if (logoUrl) card.logoUrl = logoUrl;
    if (linkUrl !== undefined) card.linkUrl = linkUrl;
    if (order !== undefined) card.order = Number(order);
    if (isActive !== undefined) card.isActive = isActive;

    await card.save();

    await cacheService.clearPattern('partner_cards_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(200).json({
      status: true,
      message: 'Partner card updated successfully',
      data: card
    });
  } catch (error) {
    logger.error('Error updating partner card:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update partner card',
      error: error.message
    });
  }
};

/**
 * Delete partner card by ID
 * DELETE /api/v1/partner-cards/:id
 * Admin only
 */
const deletePartnerCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PartnerCard.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Partner card not found'
      });
    }

    await cacheService.clearPattern('partner_cards_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(200).json({
      status: true,
      message: 'Partner card deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting partner card:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete partner card',
      error: error.message
    });
  }
};

/**
 * Upload partner logo to AWS S3
 * POST /api/v1/partner-cards/upload-logo
 * Admin only
 */
const uploadPartnerLogo = async (req, res) => {
  try {
    if (!req.files || (!req.files.logo && !req.files.file && !req.files.image)) {
      return res.status(400).json({
        status: false,
        message: 'No logo file was provided for upload.'
      });
    }

    const file = req.files.logo || req.files.file || req.files.image;
    const folder = awsFolderNames.resource || 'homepage';
    const fileName = `${folder}/partner_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    await uploadFileToAws(fileName, file.tempFilePath);
    const url = getFileUrlFromAws(fileName);

    return res.status(200).json({
      status: true,
      message: 'Partner logo uploaded successfully to AWS S3',
      url
    });
  } catch (error) {
    logger.error('Error uploading partner logo to AWS:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to upload logo to AWS: ' + error.message,
      error: error.message
    });
  }
};

module.exports = {
  getAllPartnerCards,
  getAllPartnerCardsAdmin,
  getPartnerCardById,
  createPartnerCard,
  updatePartnerCard,
  deletePartnerCard,
  uploadPartnerLogo
};

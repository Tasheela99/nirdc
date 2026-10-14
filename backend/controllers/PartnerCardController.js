const mongoose = require('mongoose');
const PartnerCard = require('../schemas/PartnerCardSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

const DEFAULT_PARTNER_CARDS = [
  {
    title: {
      en: "President's Office",
      si: "ජනාධිපති කාර්යාලය",
      ta: "ஜனாதிபதி செயலகம்"
    },
    description: {
      en: "Official website of the Presidential Secretariat of Sri Lanka.",
      si: "ශ්‍රී ලංකා ජනාධිපති කාර්යාලයේ නිල වෙබ් අඩවිය.",
      ta: "இலங்கை ஜனாதிபதி செயலகத்தின் உத்தியோகபூர்வ இணையதளம்."
    },
    logoUrl: "/presidentsoffice_logo.png",
    linkUrl: "https://www.presidentsoffice.gov.lk/",
    order: 1,
    isActive: true
  },
  {
    title: {
      en: "Clean Sri Lanka",
      si: "ක්ලීන් ශ්‍රී ලංකා",
      ta: "க்ளீன் ஸ்ரீலங்கா"
    },
    description: {
      en: "Official website of the Clean Sri Lanka National Programme.",
      si: "ක්ලීන් ශ්‍රී ලංකා ජාතික වැඩසටහනේ නිල වෙබ් අඩවිය.",
      ta: "Clean Sri Lanka தேசிய திட்டத்தின் உத்தியோகபூர்வ இணையதளம்."
    },
    logoUrl: "/cleansrilanka_logo.png",
    linkUrl: "https://cleansrilanka.gov.lk/",
    order: 2,
    isActive: true
  },
  {
    title: {
      en: "Prajashakthi",
      si: "ප්‍රජාශක්ති",
      ta: "பிரஜாசக்தி"
    },
    description: {
      en: "Official website of the Prajashakthi National Programme.",
      si: "ප්‍රජාශක්ති වැඩසටහනේ නිල වෙබ් අඩවිය.",
      ta: "பிரஜாசக்தி தேசிய திட்டத்தின் உத்தியோகபூர்வ இணையதளம்."
    },
    logoUrl: "/praajashakthi_logo.webp",
    linkUrl: "https://www.prajashakthi.gov.lk/",
    order: 3,
    isActive: true
  }
];

/**
 * Get all active partner cards
 * GET /api/v1/partner-cards
 * Public
 */
const getAllPartnerCards = async (req, res) => {
  try {
    let cards = await PartnerCard.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    if (!cards || cards.length === 0) {
      const count = await PartnerCard.countDocuments();
      if (count === 0) {
        await PartnerCard.insertMany(DEFAULT_PARTNER_CARDS);
        cards = await PartnerCard.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
      }
    }
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
    let cards = await PartnerCard.find().sort({ order: 1, createdAt: 1 }).lean();
    if (!cards || cards.length === 0) {
      await PartnerCard.insertMany(DEFAULT_PARTNER_CARDS);
      cards = await PartnerCard.find().sort({ order: 1, createdAt: 1 }).lean();
    }
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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid partner card ID'
      });
    }

    const card = await PartnerCard.findById(id).lean();
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
    if (req.files && (req.files.logo || req.files.logoUrl || req.files.file || req.files.image)) {
      const file = req.files.logo || req.files.logoUrl || req.files.file || req.files.image;
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

    // Normalize multiLang fields
    const normalizedTitle = {
      en: title?.en || title?.si || title?.ta || 'Partner',
      si: title?.si || '',
      ta: title?.ta || ''
    };
    const normalizedDesc = {
      en: description?.en || description?.si || description?.ta || '',
      si: description?.si || '',
      ta: description?.ta || ''
    };

    const newCard = new PartnerCard({
      title: normalizedTitle,
      description: normalizedDesc,
      logoUrl: logoUrl.trim(),
      linkUrl: linkUrl ? linkUrl.trim() : '',
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? (isActive === true || isActive === 'true') : true
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid partner card ID'
      });
    }

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
    if (req.files && (req.files.logo || req.files.logoUrl || req.files.file || req.files.image)) {
      const file = req.files.logo || req.files.logoUrl || req.files.file || req.files.image;
      try {
        const folder = awsFolderNames.resource || 'homepage';
        const fileName = `${folder}/partner_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        await uploadFileToAws(fileName, file.tempFilePath);
        logoUrl = getFileUrlFromAws(fileName);
      } catch (uploadErr) {
        logger.warn('Partner logo upload to AWS failed:', { error: uploadErr.message });
      }
    }

    if (title) {
      card.title = {
        en: title.en !== undefined ? title.en : (card.title?.en || ''),
        si: title.si !== undefined ? title.si : (card.title?.si || ''),
        ta: title.ta !== undefined ? title.ta : (card.title?.ta || '')
      };
      if (!card.title.en) {
        card.title.en = card.title.si || card.title.ta || 'Partner';
      }
    }

    if (description) {
      card.description = {
        en: description.en !== undefined ? description.en : (card.description?.en || ''),
        si: description.si !== undefined ? description.si : (card.description?.si || ''),
        ta: description.ta !== undefined ? description.ta : (card.description?.ta || '')
      };
    }

    if (logoUrl) card.logoUrl = logoUrl.trim();
    if (linkUrl !== undefined) card.linkUrl = linkUrl ? linkUrl.trim() : '';
    if (order !== undefined) card.order = Number(order);
    if (isActive !== undefined) card.isActive = (isActive === true || isActive === 'true');

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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid partner card ID'
      });
    }

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
  uploadPartnerLogo,
  DEFAULT_PARTNER_CARDS
};

const ContactInfo = require('../schemas/ContactInfoSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');

/**
 * Get active/latest contact information
 * GET /api/v1/contact-info
 * Public
 */
const getContactInfo = async (req, res) => {
  try {
    let info = await ContactInfo.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!info) {
      info = await ContactInfo.findOne().sort({ createdAt: -1 });
    }
    if (!info) {
      info = new ContactInfo({
        organizationName: {
          en: "National Initiative for Research and Development Commercialization",
          si: "පර්යේෂණ හා සංවර්ධන වාණිජකරණ ජාතික ප්‍රවේශය",
          ta: "தேசிய ஆராய்ச்சி மற்றும் அபிவிருத்தி வணிகமயமாக்கல் முயற்சி"
        },
        location: {
          title: {
            en: "President's Office",
            si: "කාර්යාල පිහිටීම",
            ta: "அலுவலக இடம்"
          },
          address: {
            en: "President's Office, Galle Face, Colombo 01, Sri Lanka.",
            si: "ජනාධිපති කාර්යාලය, ගාලුමුවදොර, කොළඹ 01, ශ්‍රී ලංකාව.",
            ta: "ஜனாதிபதி அலுவலகம், காலி முகத்திடல், கொழும்பு 01, இலங்கை."
          }
        },
        email: {
          title: {
            en: "Email Inquiries",
            si: "විද්‍යුත් තැපෑල",
            ta: "மின்னஞ்சல்"
          },
          address: "nirdc@presidentsoffice.lk"
        },
        telephone: {
          title: {
            en: "Telephone",
            si: "දුරකථන අංකය",
            ta: "தொலைபேசி"
          },
          number: "+94 (0)11 2354 354"
        },
        fax: {
          title: {
            en: "Fax Number",
            si: "ෆැක්ස් අංකය",
            ta: "தொலைநகல்"
          },
          number: "+94 (0)11 2354 355"
        },
        workingHours: {
          title: {
            en: "Working Hours",
            si: "සේවා වේලාවන්",
            ta: "வேலை நேரம்"
          },
          schedule: {
            en: "Monday - Friday: 8:30 AM - 4:30 PM",
            si: "සඳුදා - සිකුරාදා: පෙ.ව. 8:30 - ප.ව. 4:30",
            ta: "திங்கள் - வெள்ளி: காலை 8:30 - மாலை 4:30"
          }
        },
        isActive: true
      });
      await info.save();
      logger.info('Default contact info seeded successfully');
    }

    return res.status(200).json({
      status: true,
      message: 'Contact information fetched successfully',
      data: info
    });
  } catch (error) {
    logger.error('Error fetching contact info:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch contact information',
      error: error.message
    });
  }
};

/**
 * Get all contact info records (admin)
 * GET /api/v1/contact-info/all
 * Admin only
 */
const getAllContactInfos = async (req, res) => {
  try {
    const items = await ContactInfo.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    logger.error('Error fetching all contact info records:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch contact info records',
      error: error.message
    });
  }
};

const normalizeMultiLang = (val) => {
  if (!val) return { en: '', si: '', ta: '' };
  if (typeof val === 'string') return { en: val.trim(), si: '', ta: '' };
  return {
    en: typeof val.en === 'string' ? val.en.trim() : '',
    si: typeof val.si === 'string' ? val.si.trim() : '',
    ta: typeof val.ta === 'string' ? val.ta.trim() : '',
  };
};

/**
 * Create contact information
 * POST /api/v1/contact-info
 * Admin only
 */
const createContactInfo = async (req, res) => {
  try {
    let { organizationName, location, email, telephone, fax, workingHours, isActive } = req.body;

    if (typeof organizationName === 'string') {
      try { organizationName = JSON.parse(organizationName); } catch (_) {}
    }
    if (typeof location === 'string') {
      try { location = JSON.parse(location); } catch (_) {}
    }
    if (typeof email === 'string') {
      try { email = JSON.parse(email); } catch (_) {}
    }
    if (typeof telephone === 'string') {
      try { telephone = JSON.parse(telephone); } catch (_) {}
    }
    if (typeof fax === 'string') {
      try { fax = JSON.parse(fax); } catch (_) {}
    }
    if (typeof workingHours === 'string') {
      try { workingHours = JSON.parse(workingHours); } catch (_) {}
    }

    if (isActive !== false) {
      await ContactInfo.updateMany({}, { isActive: false });
    }

    const safeLocation = location || {};
    const safeEmail = email || {};
    const safeTelephone = telephone || {};
    const safeFax = fax || {};
    const safeWorkingHours = workingHours || {};

    const newContact = new ContactInfo({
      organizationName: normalizeMultiLang(organizationName),
      location: {
        title: normalizeMultiLang(safeLocation.title),
        address: normalizeMultiLang(safeLocation.address),
      },
      email: {
        title: normalizeMultiLang(safeEmail.title),
        address: typeof safeEmail.address === 'string' ? safeEmail.address.trim() : '',
      },
      telephone: {
        title: normalizeMultiLang(safeTelephone.title),
        number: typeof safeTelephone.number === 'string' ? safeTelephone.number.trim() : '',
      },
      fax: {
        title: normalizeMultiLang(safeFax.title),
        number: typeof safeFax.number === 'string' ? safeFax.number.trim() : '',
      },
      workingHours: {
        title: normalizeMultiLang(safeWorkingHours.title),
        schedule: normalizeMultiLang(safeWorkingHours.schedule),
      },
      isActive: isActive !== undefined ? isActive : true
    });

    await newContact.save();

    await cacheService.clearPattern('contact_info_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(201).json({
      status: true,
      message: 'Contact info created successfully',
      data: newContact
    });
  } catch (error) {
    logger.error('Error creating contact info:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create contact information',
      error: error.message
    });
  }
};

/**
 * Update contact information by ID
 * PUT /api/v1/contact-info/:id
 * Admin only
 */
const updateContactInfo = async (req, res) => {
  try {
    const { id } = req.params;
    let { organizationName, location, email, telephone, fax, workingHours, isActive } = req.body;

    const info = await ContactInfo.findById(id);
    if (!info) {
      return res.status(404).json({
        status: false,
        message: 'Contact information not found'
      });
    }

    if (typeof organizationName === 'string') {
      try { organizationName = JSON.parse(organizationName); } catch (_) {}
    }
    if (typeof location === 'string') {
      try { location = JSON.parse(location); } catch (_) {}
    }
    if (typeof email === 'string') {
      try { email = JSON.parse(email); } catch (_) {}
    }
    if (typeof telephone === 'string') {
      try { telephone = JSON.parse(telephone); } catch (_) {}
    }
    if (typeof fax === 'string') {
      try { fax = JSON.parse(fax); } catch (_) {}
    }
    if (typeof workingHours === 'string') {
      try { workingHours = JSON.parse(workingHours); } catch (_) {}
    }

    if (organizationName !== undefined) {
      info.organizationName = normalizeMultiLang(organizationName);
    }
    if (location !== undefined) {
      info.location = {
        title: normalizeMultiLang(location?.title),
        address: normalizeMultiLang(location?.address),
      };
    }
    if (email !== undefined) {
      info.email = {
        title: normalizeMultiLang(email?.title),
        address: typeof email?.address === 'string' ? email.address.trim() : (info.email?.address || ''),
      };
    }
    if (telephone !== undefined) {
      info.telephone = {
        title: normalizeMultiLang(telephone?.title),
        number: typeof telephone?.number === 'string' ? telephone.number.trim() : (info.telephone?.number || ''),
      };
    }
    if (fax !== undefined) {
      info.fax = {
        title: normalizeMultiLang(fax?.title),
        number: typeof fax?.number === 'string' ? fax.number.trim() : (info.fax?.number || ''),
      };
    }
    if (workingHours !== undefined) {
      info.workingHours = {
        title: normalizeMultiLang(workingHours?.title),
        schedule: normalizeMultiLang(workingHours?.schedule),
      };
    }
    if (isActive !== undefined) {
      if (isActive === true) {
        await ContactInfo.updateMany({ _id: { $ne: id } }, { isActive: false });
      }
      info.isActive = isActive;
    }

    await info.save();

    await cacheService.clearPattern('contact_info_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(200).json({
      status: true,
      message: 'Contact info updated successfully',
      data: info
    });
  } catch (error) {
    logger.error('Error updating contact info:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update contact information',
      error: error.message
    });
  }
};

/**
 * Delete contact information by ID
 * DELETE /api/v1/contact-info/:id
 * Admin only
 */
const deleteContactInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactInfo.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Contact information not found'
      });
    }

    await cacheService.clearPattern('contact_info_*');
    await cacheService.clearPattern('homepage_*');

    return res.status(200).json({
      status: true,
      message: 'Contact information deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting contact info:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete contact information',
      error: error.message
    });
  }
};

module.exports = {
  getContactInfo,
  getAllContactInfos,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo
};

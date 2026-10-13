const HeadOfficeOfficer = require('../schemas/HeadOfficeOfficerSchema');
const logger = require('../utils/LoggerUtil');

const defaultOfficers = [
  {
    name: {
      en: "Dr. H. M. Bandara",
      si: "ආචාර්ය එච්. එම්. බණ්ඩාර",
      ta: "கலாநிதி எச். எம். பண்டார"
    },
    designation: {
      en: "Director General / CEO",
      si: "අධ්‍යක්ෂ ජනරාල් / ප්‍රධාන විධායක නිලධාරී",
      ta: "பணிப்பாளர் நாயகம் / பிரதம நிறைவேற்று அதிகாரி"
    },
    division: {
      en: "Executive Directorate",
      si: "විධායක අධ්‍යක්ෂ මණ්ඩලය",
      ta: "நிறைவேற்று பணிப்பாளர் சபை"
    },
    generalNumber: "+94 (0)11 2354 354 Ext. 101",
    mobileNumber: "+94 (0)71 2345 678",
    email: "director@presidentsoffice.lk",
    order: 1,
    isActive: true
  },
  {
    name: {
      en: "Mrs. K. D. Jayawardena",
      si: "කේ. ඩී. ජයවර්ධන මිය",
      ta: "திருமதி கே. டி. ஜயவர்தன"
    },
    designation: {
      en: "Deputy Director (Commercialization)",
      si: "නියෝජ්‍ය අධ්‍යක්ෂ (වාණිජකරණ)",
      ta: "பிரதி பணிப்பாளர் (வணிகமயமாக்கல்)"
    },
    division: {
      en: "Commercialization & Industry Linkage",
      si: "වාණිජකරණ හා කර්මාන්ත සබඳතා අංශය",
      ta: "வணிகமயமாக்கல் மற்றும் கைத்தொழில் இணைப்பு"
    },
    generalNumber: "+94 (0)11 2354 354 Ext. 104",
    mobileNumber: "+94 (0)77 3456 789",
    email: "dep.director@presidentsoffice.lk",
    order: 2,
    isActive: true
  },
  {
    name: {
      en: "Mr. T. S. Senanayake",
      si: "ටී. එස්. සේනානායක මයා",
      ta: "திரு டி. எஸ். சேனநாயக்க"
    },
    designation: {
      en: "Senior Technical & Research Officer",
      si: "ජ්‍යෙෂ්ඨ තාක්ෂණික හා පර්යේෂණ නිලධාරී",
      ta: "சிரேஷ்ட தொழில்நுட்ப மற்றும் ஆராய்ச்சி அதிகாரி"
    },
    division: {
      en: "Research & Development Division",
      si: "පර්යේෂණ හා සංවර්ධන අංශය",
      ta: "ஆராய்ச்சி மற்றும் அபிவிருத்தி பிரிவு"
    },
    generalNumber: "+94 (0)11 2354 354 Ext. 110",
    mobileNumber: "",
    email: "tech.officer@presidentsoffice.lk",
    order: 3,
    isActive: true
  },
  {
    name: {
      en: "Ms. R. M. Perera",
      si: "ආර්. එම්. පෙරේරා මෙනවිය",
      ta: "செல்வி ஆர். எம். பெரேரா"
    },
    designation: {
      en: "Public Inquiries & Administrative Officer",
      si: "මහජන විමසීම් හා පරිපාලන නිලධාරී",
      ta: "பொது விசாரணைகள் மற்றும் நிர்வாக அதிகாரி"
    },
    division: {
      en: "Administration & Inquiries",
      si: "පරිපාලන හා මහජන සබඳතා අංශය",
      ta: "நிர்வாகம் மற்றும் விசாரணைகள்"
    },
    generalNumber: "+94 (0)11 2354 354 Ext. 102",
    mobileNumber: "+94 (0)70 1234 567",
    email: "inquiries@presidentsoffice.lk",
    order: 4,
    isActive: true
  }
];

const getOfficers = async (req, res) => {
  try {
    let officers = await HeadOfficeOfficer.find({ isActive: true }).sort({ order: 1 });
    if (!officers || officers.length === 0) {
      await HeadOfficeOfficer.insertMany(defaultOfficers);
      officers = await HeadOfficeOfficer.find({ isActive: true }).sort({ order: 1 });
    }
    return res.status(200).json({
      status: true,
      data: officers
    });
  } catch (error) {
    logger.error('Error fetching head office officers:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch officers',
      error: error.message
    });
  }
};

const getAllOfficers = async (req, res) => {
  try {
    const officers = await HeadOfficeOfficer.find().sort({ order: 1 });
    return res.status(200).json({
      status: true,
      data: officers
    });
  } catch (error) {
    logger.error('Error fetching all officers:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch officers',
      error: error.message
    });
  }
};

const createOfficer = async (req, res) => {
  try {
    const officer = new HeadOfficeOfficer(req.body);
    await officer.save();
    return res.status(201).json({
      status: true,
      message: 'Officer created successfully',
      data: officer
    });
  } catch (error) {
    logger.error('Error creating officer:', { error: error.message });
    return res.status(500).json({ status: false, message: 'Failed to create officer', error: error.message });
  }
};

const updateOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await HeadOfficeOfficer.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ status: false, message: 'Officer not found' });
    }
    return res.status(200).json({ status: true, message: 'Officer updated successfully', data: updated });
  } catch (error) {
    logger.error('Error updating officer:', { error: error.message });
    return res.status(500).json({ status: false, message: 'Failed to update officer', error: error.message });
  }
};

const deleteOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HeadOfficeOfficer.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ status: false, message: 'Officer not found' });
    }
    return res.status(200).json({ status: true, message: 'Officer deleted successfully' });
  } catch (error) {
    logger.error('Error deleting officer:', { error: error.message });
    return res.status(500).json({ status: false, message: 'Failed to delete officer', error: error.message });
  }
};

module.exports = {
  getOfficers,
  getAllOfficers,
  createOfficer,
  updateOfficer,
  deleteOfficer
};

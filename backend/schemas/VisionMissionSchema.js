const mongoose = require('mongoose');

const multiLangString = {
  en: { type: String, default: '', trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
};

const visionMissionSchema = new mongoose.Schema({
  vision: {
    title: multiLangString,
    highlightText: multiLangString,
    description: multiLangString
  },
  mission: {
    title: multiLangString,
    highlightText: multiLangString,
    description: multiLangString
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('VisionMission', visionMissionSchema);

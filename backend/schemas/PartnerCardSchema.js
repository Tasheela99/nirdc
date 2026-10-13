const mongoose = require('mongoose');

const multiLangString = {
  en: { type: String, required: true, trim: true },
  si: { type: String, default: '', trim: true },
  ta: { type: String, default: '', trim: true }
};

const partnerCardSchema = new mongoose.Schema({
  title: multiLangString,
  description: multiLangString,
  logoUrl: { type: String, required: true, trim: true },
  linkUrl: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PartnerCard', partnerCardSchema);
